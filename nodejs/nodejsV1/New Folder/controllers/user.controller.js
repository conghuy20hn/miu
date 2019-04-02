const { User } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');
const obj = require('../lib/Obj');
const response = require('../lib/ResponseCode');
const VnUserBase = require('../models/VnUser.model');
const VnConfigBase = require('../models/config.model');
const VnUserTokenBase = require('../models/VnUserToken.model');
const VnUserOtpBase = require('../models/VnUserOtp.model');
const VnSmsMtBase = require('../models/VnSmsMt.model');

const params = require('../config/params');
const Utils = require('../lib/Utils');
const Common = require('../lib/CommonModel');
const VnHelper = require('../lib/VnHelper');
const initUser = require('../lib/helper/initUser');
const md5 = require('md5');
const RSA = require('../lib/helper/RSA');
const SHA = require('../lib/helper/SHA');
const dbredis = require('../config/redis');
const redisService = require('../services/redis.service');
const configStr = params.configStr;
const redis = dbredis.constant;

exports.authorize = async function (req, res) {

    let grantType = req.body.grant_type;
    let osType = req.body.os_type;
    let osVersionCode = req.body.os_version_code;
    let userAgent = Utils.isset(req.headers['user-agent']) ? req.headers['user-agent'] : 'ua';
    let userAgentEncrypted = md5(configStr.userAgentSecretCode + userAgent);
    let accessTokenExpiredTime = Utils.time() + configStr.accessTokenTimeout;
    let refreshTokenExpiredTime = Utils.time() + configStr.refreshTokenTimeout;

    // let isForceUpdateAPP = 0; // require app update when new version
    // let isUpdateAPP = 0; // notice new version app

    let isShowUpdateAPP = (Utils.isEmpty(osType)) ? 0 : await VnConfigBase.getConfigKey("IS_SHOW_UPDATE_APP_" + osType.toUpperCase(), 0);
    let isAutoLogin = false;
    let needChangePassword = false;
    let msisdn = "";
    let user = null;
    let userToken = null;
    let infoUpdate = await Common.getInfoUpdate(osType, osVersionCode);
    let ip = VnHelper.getUserIp(req);
    console.log('auth 0',grantType,req.body);
    if (grantType === 'auto_login') {
        msisdn = VnHelper.getMsisdn();
        if (!Utils.isEmpty(msisdn)) {
            isAutoLogin = true;
            user = await VnUserBase.getByMsisdn(msisdn);
        }

    } else if (grantType === 'login') {
        let username = req.body.username;
        let password = req.body.password;
        let captcha = req.body.captcha;
        let captchaToken = 'no-cap-t-cha';
        let authHeader = req.headers['authorization'];
        let accessToken = "";
        if (!Utils.isEmpty(authHeader) && Utils.validateRegex(authHeader, configStr.authBearer)) {
            let matches = Utils.parseBearer(authHeader);
            captchaToken = md5(ip + matches[1]);
            accessToken = matches[1];
        }
        if (Utils.isEmpty(accessToken)) {
            console.log('auth 1');
            return res.json({ responseCode: response.FORBIDDEN, message: response.getMessage(response.INVALID_ACCESS_TOKEN_EMPTY) });
        }
        if (Utils.isEmpty(username) || Utils.isEmpty(password)) {

            console.log('auth 2');
            return res.json({ responseCode: response.FORBIDDEN, message: response.getMessage(response.INVALID_USERNAME_PWD_EMPTY) });
        }
        msisdn = Utils.getMobileNumber(username, configStr.MOBILEGLOBAL);

        console.log('auth 3');
        let dbRedis = redis.dbCache;
        let countLoginFail = Utils.intval(redisService.getKey('count_login_fail_' + ip, dbRedis));
        let ipUser = md5(ip + username);
        let countLock = Utils.intval(redisService.getKey('count_lock_' + ipUser, dbRedis));

        //-- Kiem tra khoa tai khoan trong 10phut
        let isLockIPUser = redisService.getKey('lock_login_' + ipUser, dbRedis);
        let configCaptchaShow = configStr.loginCaptchaShowCount;
        let configCountLock = configStr.loginLockCount;

        if (countLock >= configCountLock || isLockIPUser == true) {
            if (isLockIPUser == true) {
                console.log(isLockIPUser);
                redisService.setKey('count_lock_' + ipUser, 0, redis.CACHE_1DAY, dbRedis);
            } else {
                redisService.setKey('lock_login_' + ipUser, 1, redis.CACHE_10MINUTE, dbRedis);
                redisService.delKey('count_lock_' + ipUser);
                redisService.delKey('count_login_fail_' + ip);
            }
            return res.json({ responseCode: response.LOCK_USER, message: response.getMessage(response.LOCK_USER) });
        }

        if (countLoginFail >= configCaptchaShow) {
            if (Utils.isEmpty(captcha)) {
                return res.json({ responseCode: response.CAPTCHA_EMPTY, message: response.getMessage(response.CAPTCHA_EMPTY) });
            } else {
                let serverCaptcha = redisService.getKey("captcha_" + captchaToken, dbRedis);
                // refreshCaptcha
                let randomCode = Utils.generateVerifyCode();
                redisService.setKey("captcha_" + captchaToken, randomCode, redis.CACHE_15MINUTE, dbRedis);// luu captcha trong 15P

                if (Utils.isEmpty(serverCaptcha) || serverCaptcha !== captcha) {
                    return res.json({ responseCode: response.CAPTCHA_INVALID, message: response.getMessage(response.CAPTCHA_INVALID) });
                }
            }
        }
        user = await VnUserBase.getByMsisdnOrEmail(msisdn, username);
        //@todo: kiem tra xu ly not + bo sung captcha
        if (!Utils.isEmpty(user) && user.status == 1 && await VnUserBase.checkPassword(user, password)) {

            msisdn = user.msisdn;
            if (!user.changed_password) {
                needChangePassword = true;
            }

            // -Login success then remove key
            redisService.delKey('count_lock_' + ipUser, dbRedis);
            redisService.delKey('count_login_fail_' + ip, dbRedis);

        } else {
            // Neu empty user thi chi tang lock login , khong khoa user
            if (Utils.isEmpty(user)) {
                redisService.setKey("count_login_fail_" + ip, countLoginFail + 1, redis.CACHE_1DAY, dbRedis);
            } else {
                redisService.setKey("count_lock_" + ipUser, countLock + 1, redis.CACHE_1DAY, dbRedis);
                redisService.setKey("count_login_fail_" + ip, countLoginFail + 1, redis.CACHE_1DAY, dbRedis);
            }
            return res.json({
                responseCode: response.FORBIDDEN,
                message: response.getMessage(response.INVALID_PARAM),
                captcha: (countLoginFail >= (configCaptchaShow - 1)) ? 1 : 0
            });

        }
    } else if (grantType === 'refresh_token') {
        let refreshToken = req.body.refresh_token;
        let q = {
            token: refreshToken
        }
        userToken = await VnUserTokenBase.getByUserByQuery(q);
        if (userToken) {
            if (userAgent != userToken.user_agent || Utils.toTimestamp(userToken.token_expired_time) < Utils.toTimestamp(new Date())) {

                let responseObj = {
                    responseCode: response.FORBIDDEN,
                    message: await response.getMessage(response.FORBIDDEN),
                    data: {
                        isForceUpdateAPP: infoUpdate.isForceUpdateAPP,
                        isUpdateAPP: (isShowUpdateAPP) ? infoUpdate.isUpdateAPP : 0,

                    }
                }
                return ReS(res, responseObj, 200);

            } else {
                msisdn = userToken.msisdn;
                user = await VnUserBase.getUserById(userToken.user_id);
            }
        }
    }
    let secretString = "";
    if (Utils.isValidMsisdn(msisdn) || !Utils.isEmpty(user) || userToken != null) {

        let userId = (user) ? user.id : null;
        let refreshToken = Utils.generateGuid();
        let refeshTokenExpiredTimeStamp = Utils.converTimeStampToDate(refreshTokenExpiredTime, "yyyy-mm-dd HH:MM:ss");
        if (userToken != null) { // ton token thi update

            let update = {
                token_expired_time: refeshTokenExpiredTimeStamp,
                last_login_type: isAutoLogin,
                token: refreshToken,
                ip: ip,
                user_agent: userAgent,
                last_login: new Date()
            }
            let where = {
                id: userToken.id
            }
            await VnUserTokenBase.updateToken(update, where);
            secretString = accessTokenExpiredTime + "&" + userToken.user_id + "&" + userToken.msisdn + "&" + userAgentEncrypted;
        } else if (user) {
            let q = {
                user_id: user.id
            }
            userToken = await VnUserTokenBase.getByUserByQuery(q);
            if (userToken) {
                let update = {
                    token_expired_time: refeshTokenExpiredTimeStamp,
                    last_login_type: isAutoLogin,
                    token: refreshToken,
                    ip: ip,
                    user_agent: userAgent,
                    msisdn: msisdn,
                    last_login: new Date()
                }
                let where = {
                    id: userToken.id
                }
                await VnUserTokenBase.updateToken(update, where);

            } else {
                let userTK = {};
                userTK.token_expired_time = refeshTokenExpiredTimeStamp;
                userTK.last_login_type = isAutoLogin;
                userTK.token = refreshToken;
                userTK.ip = ip;
                userTK.user_agent = userAgent;
                userTK.msisdn = msisdn;
                userTK.user_id = user.id;
                await VnUserTokenBase.saveToken(userTK);
            }
            secretString = accessTokenExpiredTime + "&" + user.id + "&" + msisdn + "&" + userAgentEncrypted;

        } else {
            let q = {
                msisdn: msisdn
            }
            userToken = await VnUserTokenBase.getByUserByQuery(q);
            if (userToken) {
                let update = {
                    token_expired_time: refeshTokenExpiredTimeStamp,
                    last_login_type: isAutoLogin,
                    token: refreshToken,
                    ip: ip,
                    user_agent: userAgent,
                    msisdn: msisdn,
                    last_login: new Date()
                }
                let where = {
                    id: userToken.id
                }
                await VnUserTokenBase.updateToken(update, where);
            } else {
                userToken.token_expired_time = refeshTokenExpiredTimeStamp;
                userToken.last_login_type = isAutoLogin;
                usertToken.token = refreshToken;
                userToken.ip = ip;
                userToken.user_agent = userAgent;
                userToken.msisdn = msisdn;
                userToken.user_id = null;
                await VnUserTokenBase.saveToken(userToken);
            }
            secretString = accessTokenExpiredTime + "&0&" + msisdn + "&" + userAgentEncrypted;
        }

        //check version
        if (!Utils.isEmpty(osType) && !Utils.isEmpty(osVersionCode)) {

            if (osType.toUpperCase() == 'IOS' && Utils.version_compare(osVersionCode, await VnConfigBase.getConfigKey("VERSION_APP_" + osType.toUpperCase(), 0)) > 0) {
                secretString = secretString + "&1";
            } else {
                //Khong can hidden noi dung tinh phi duyet APP IOS
                secretString = secretString + "&0";
            }
        } else {
            secretString = secretString + "&0";
        }

        accessToken = RSA.encrypt(secretString);
        let responseObj = {
            responseCode: response.SUCCESS,
            message: await response.getMessage(response.SUCCESS),
            data: {
                accessToken: accessToken,
                refreshToken: refreshToken,
                fullname: (Utils.isEmpty(user) || Utils.isEmpty(user.full_name)) ? Utils.hideMsisdn(msisdn) : user.full_name,
                avatarImage: (!Utils.isEmpty(user)) ? VnHelper.getThumbUrl(user.bucket, user.path, obj.SIZE_AVATAR) : "",
                msisdn: Utils.hideMsisdn(msisdn),
                userId: (!Utils.isEmpty(user.id)) ? user.id : 0,
                expiredTime: configStr.accessTokenTimeout,
                isForceUpdateAPP: infoUpdate.isForceUpdateAPP,
                isUpdateAPP: (isShowUpdateAPP) ? infoUpdate.isUpdateAPP : 0,
                needChangePassword: needChangePassword

            }
        }

        return ReS(res, responseObj, 200);
    } else {
        console.log('auth 0.1');
        let responseObj = {
            responseCode: response.FORBIDDEN,
            message: await response.getMessage(response.FORBIDDEN),
            data: {
                isForceUpdateAPP: Common.getInfoUpdate(osType, osVersionCode).isForceUpdateAPP,
                isUpdateAPP: (isShowUpdateAPP) ? Common.getInfoUpdate(osType, osVersionCode).isUpdateAPP : 0
            }
        }

        return ReS(res, responseObj, 200);
    }

}

exports.getCaptcha = function (req, res) {

    let captchaToken = 'no-cap-t-cha';
    let authHeader = req.headers['authorization'];
    if (Utils.isEmpty(authHeader) || !Utils.validateRegex(authHeader, configStr.authBearer)) {
        return res.json({ responseCode: response.FORBIDDEN, message: response.getMessage(response.INVALID_TOKEN) });
    } else {
        let matches = Utils.parseBearer(authHeader);
        let key = req.query.key;
        if (Utils.isEmpty(key)) {
            key = "captcha_";
        }
        let dbRedis = redis.dbCache;
        var svgCaptcha = require('node-svgcaptcha');
        matches = authHeader.split(" ");
        captchaToken = md5(VnHelper.getUserIp(req) + matches[1]);
        var captcha = svgCaptcha({
            values: 'abcdefghjklmnpqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ23456789',
            // ignoreChars: '0o1i',
            length: configStr.captchaLength, // lenght of chars in generated captcha
            width: 200, // width of the generated image
            height: 50, // height of the generated image
            color: true, // true means that letters are painted in colors and false in gray scale
            lines: 0, // number of lines in the captcha
            noise: 0, // level of noise (points) in the captcha
        });

        redisService.setKey(key + captchaToken, captcha.captchaValue, redis.CACHE_15MINUTE, dbRedis);
        res.set('Content-Type', 'image/svg+xml');
        res.send(captcha.svg);
    }
}

exports.logout = async function (req, res) {
    let refreshToken = req.body.refresh_token;
    let userAgent = Utils.isset(req.headers['user-agent']) ? req.headers['user-agent'] : 'ua';

    if (Utils.isEmpty(refreshToken)) {
        return res.json({ responseCode: response.UNSUCCESS, message: response.getMessage(response.INVALID_REFRESH_TOKEN) });
    }

    let q = {
        token: refreshToken
    }
    let userToken = await VnUserTokenBase.getByUserByQuery(q);

    if (userToken) {
        if (userAgent == userToken.user_agent && Utils.toTimestamp(userToken.token_expired_time) > Utils.toTimestamp(new Date())) {

            let update = {
                token_expired_time: new Date(),
            }
            let where = {
                id: userToken.id
            }
            await VnUserTokenBase.updateToken(update, where);
            return res.json({ responseCode: response.SUCCESS, message: response.getMessage(response.SUCCESS_LOGOUT) });
        }
    }

    return res.json({ responseCode: response.UNSUCCESS, message: response.getMessage(response.FAIL_LOGOUT) });


}
exports.createdOpt = async function (req, res) {

    let msisdn = req.body.msisdn;

    msisdn = Utils.getMobileNumber(msisdn, configStr.MOBILE_GLOBAL);
    //    console.log(initUser.auth(req, res));

    if (Utils.isValidMsisdn(msisdn)) {
        let ip = VnHelper.getUserIp(req);
        let msisdnNumThisDay = await VnUserOtpBase.countPerDayByQuery({ msisdn: msisdn });
        let ipNumThisDay = await VnUserOtpBase.countPerDayByQuery({ ip: ip });
        if (msisdnNumThisDay < configStr.otpMsisdnPerDay && ipNumThisDay < configStr.otpIpPerDay) {

            await VnUserOtpBase.updateUserOpt({ status: 0 }, { msisdn: msisdn, status: 1 });

            let otp = Utils.generateVerifyCode(configStr.otpLength, configStr.otpLength);
            let expiredTime = Utils.converTimeStampToDate(Utils.time() + configStr.otpTimeout, 'yyyy-mm-dd HH:MM:ss');
            let item = {
                msisdn: msisdn,
                ip: ip,
                otp: otp,
                expired_time: expiredTime
            };
            await VnUserOtpBase.saveUserOtp(item);

            let smsMessage = Utils.str_replace('%otp%', otp, await VnConfigBase.getConfigKey('OTP_TEMPLATE'));
            await VnSmsMtBase.saveSmsMt({ msisdn: msisdn, content: smsMessage })
            return res.json({ responseCode: response.SUCCESS, message: response.getMessage(response.SUCCESS) });

        } else {
            return res.json({ responseCode: response.UNSUCCESS, message: response.getMessage(response.FAIL_OTP) });

        }
    }
    return res.json({ responseCode: response.UNSUCCESS, message: response.getMessage(response.INVALID_MSISDN) });
}
exports.changePassword = async function (req, res) {
    let auth = initUser.auth(req, res);
    if (auth.responseCode != response.SUCCESS) {
        return res.json({ responseCode: auth.responseCode, message: auth.message });
    }

    let checkEmpty = req.body.check_empty;
    if (checkEmpty == 1) {
        let user = await VnUserBase.getActiveUserById(auth.data.userId);
        if (user.password == '' && user.salt == '') {
            return res.json({ responseCode: response.SUCCESS, message: response.getMessage(response.SUCCESS) });
        } else {
            return res.json({ responseCode: response.UNSUCCESS, message: response.getMessage(response.UNSUCCESS) });
        }
    }
    let password = Utils.isEmpty(req.body.password) ? "" : req.body.password.trim();
    let newPassword = Utils.isEmpty(req.body.new_password) ? "" : req.body.new_password.trim();
    let repeatPassword = Utils.isEmpty(req.body.repeat_password) ? "" : req.body.repeat_password.trim();
    let captcha = Utils.isEmpty(req.body.captcha) ? "" : req.body.captcha.trim();

    let captchaToken = md5(VnHelper.getUserIp(req) + auth.data.captchaToken);
    let dbRedis = redis.dbCache;
    let serverCaptcha = await redisService.getKey('captcha_' + captchaToken, dbRedis);
    //clear captcha 
    redisService.delKey('captcha_' + captchaToken, dbRedis);
    if (Utils.isEmpty(serverCaptcha) || serverCaptcha != captcha) {
        return res.json({ responseCode: response.CAPTCHA_INVALID, message: response.getMessage(response.UNAUTHORIZED) });
    }
    let user = await VnUserBase.getActiveUserById(auth.data.userId);
    if (Utils.isEmpty(user)) {
        return res.json({ responseCode: response.INVALID_OLD_PASSWORD, message: response.getMessage(response.INVALID_OLD_PASSWORD) });
    }

    let hashCurrentPassword = user.password;
    let SHA = require('../lib/helper/SHA');
    let hashInputPassword = SHA.getSecurePassword(password, user.salt, "SHA-512");
    let hashInputNewPassword = SHA.getSecurePassword(newPassword, user.salt, "SHA-512");

    if (hashCurrentPassword == hashInputPassword || user.password == '' && user.salt == '') {
        if (newPassword != repeatPassword) {
            return res.json({ responseCode: response.INVALID_MAP_PASSWORD, message: response.getMessage(response.INVALID_MAP_PASSWORD) });

        } else if (hashCurrentPassword == hashInputNewPassword) {
            return res.json({
                responseCode: response.INVALID_MAP_NEW_PASSWORD,
                message: response.getMessage(response.INVALID_MAP_NEW_PASSWORD)
            });

        } else if (!Utils.isEmpty(newPassword) && newPassword.length >= configStr.passMinLength && newPassword.length <= configStr.passMaxLength) {
            let salt = md5(Utils.uuid());
            await VnUserBase.update({
                salt: salt,
                password: SHA.getSecurePassword(newPassword, salt, "SHA-512"),
                changed_password: 1
            },
                { id: user.id }
            );

            return res.json({
                responseCode: response.SUCCESS,
                message: response.getMessage(response.SUCCESS_CHANGE_PASS)
            });

        } else {
            return res.json({
                responseCode: response.INVALID_NEW_PASSWORD,
                message: response.getMessage(response.INVALID_NEW_PASSWORD)
            });

        }
    }
    return res.json({ responseCode: response.INVALID_OLD_PASSWORD, message: response.getMessage(response.INVALID_OLD_PASSWORD) });
}
exports.sign = async function (req, res) {
    let msisdn = Utils.isEmpty(req.body.msisdn) ? "" : req.body.msisdn;
    let password = Utils.isEmpty(req.body.password) ? "" : req.body.password;
    let otp = Utils.isEmpty(req.body.otp) ? "" : req.body.otp;
    let captcha = Utils.isEmpty(req.body.captcha) ? "" : req.body.captcha;

    let matches = Utils.parseBearer(req.headers['authorization']);
    let captchaToken = (matches == null) ? 'no-cap-t-cha' : matches[1];
    let ip = VnHelper.getUserIp(req);
    captchaToken = md5(ip + matches[1]);
    let dbRedis = redis.dbCache;

    ip = md5(ip);
    let numOtpFail = Utils.intval(await redisService.getKey('otp_spam_' + ip, dbRedis));
    let lockOtpFail = configStr.otpLockCount;
    let isShowCaptcha = 0;

    if (numOtpFail >= lockOtpFail) {
        isShowCaptcha = 1;
        if (Utils.isEmpty(captcha)) {
            return res.json({
                responseCode: response.CAPTCHA_EMPTY,
                message: response.getMessage(response.CAPTCHA_EMPTY),
                captcha: isShowCaptcha
            });

        }
        let serverCaptcha = await redisService.getKey('captcha_' + captchaToken, dbRedis);
        // refreshCaptcha
        redisService.delKey('captcha_' + captchaToken, dbRedis);
        if (Utils.isEmpty(serverCaptcha) || serverCaptcha !== captcha) {
            return res.json({
                responseCode: response.CAPTCHA_INVALID,
                message: response.getMessage(response.CAPTCHA_INVALID),
                captcha: isShowCaptcha
            });

        }
    }
    if (Utils.isEmpty(msisdn) || Utils.isEmpty(password) || Utils.isEmpty(otp)) {
        return res.json({
            responseCode: response.UNSUCCESS,
            message: response.getMessage(response.INVALID_PARAM_EMPTY),
            captcha: isShowCaptcha
        });

    }

    msisdn = Utils.getMobileNumber(msisdn, configStr.MOBILE_GLOBAL);
    // kiem tra thue bao co hop le
    if (!Utils.isValidMsisdn(msisdn)) {
        return res.json({
            responseCode: response.UNSUCCESS,
            message: response.getMessage(response.INVALID_MSISDN),
            captcha: isShowCaptcha
        });

    };
    if (password.length < configStr.passMinLength || password.length > configStr.passMaxLength) {
        return res.json({
            responseCode: response.UNSUCCESS,
            message: Utils.str_replace({
                MIN: configStr.passMinLength,
                MAX: configStr.passMaxLength
            }, response.getMessage(response.INVALID_PARAM_LENGTH)),
            captcha: isShowCaptcha
        });

    }

    // Kiem tra otp co ton tai
    let objOtp = await VnUserOtpBase.checkOTP(msisdn, otp)
    if (!Utils.isEmpty(objOtp)) {
        // Kiem tra xem user co ton tai?
        let user = await VnUserBase.getUserByQueryOne({ msisdn: msisdn });
        if (user == null) {
            let salt = Utils.uuid();
            let hashPassword = SHA.getSecurePassword(password, salt, "SHA-512");
            let userAgent = Utils.isset(req.headers['user-agent']) ? req.headers['user-agent'] : 'ua';
            VnUserBase.saveUser(
                {
                    ip: VnHelper.getUserIp(req),
                    msisdn: msisdn,
                    user_agent: userAgent,
                    password: hashPassword,
                    salt: salt
                }

            );
            // xoa key
            isShowCaptcha = 0;
            redisService.delKey('otp_spam_' + ip, dbRedis);
            return res.json({
                responseCode: response.SUCCESS,
                message: response.getMessage(response.SUCCESS),
                captcha: isShowCaptcha
            });
        } else {
            return res.json({
                responseCode: response.UNSUCCESS,
                message: response.getMessage(response.USER_EXITS),
                captcha: isShowCaptcha
            });

        }
    } else {

        if (numOtpFail >= lockOtpFail) {
            return res.json({
                responseCode: response.UNSUCCESS,
                message: response.getMessage(response.OTP_EXPIRED),
                captcha: isShowCaptcha
            });

        } else {
            redisService.setKey('otp_spam_' + ip, numOtpFail + 1, configStr.CACHE_15MINUTE, dbRedis);
            return res.json({
                responseCode: response.UNSUCCESS,
                message: response.getMessage(response.INVALID_OTP),
                captcha: isShowCaptcha
            });
        }
    }

}

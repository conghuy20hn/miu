const response = require('../ResponseCode');
const params = require('../../config/params');
const Utils = require('../Utils');
const RSA = require('./RSA');
const md5 = require('md5');
const { to, ReE, ReS } = require('../../services/util.service');

const configStr = params.configStr;
exports.auth = function (req, res) {
    let authHeader = req.headers['authorization'];
    if (authHeader === null) {
        return { responseCode: response.UNAUTHORIZED, message: response.getMessage(response.FAIL_LOGIN) };
    }
    if (!Utils.validateRegex(authHeader, configStr.authBearer)) {
        return { responseCode: response.FORBIDDEN, message: response.getMessage(response.FORBIDDEN) };
    }
    let matches = Utils.parseBearer(authHeader);
    let token = RSA.decrypt(matches[1]);
    let accessToken = token.split("&");
    let expired_time = accessToken[0];
    let userId = accessToken[1];
    let msisdn = accessToken[2];
    let uaEncrypted = accessToken[3];
    let needHiddenFreemiumContent = (accessToken[4]) ? 1 : 0;
    let needShowPopupRequireInstallNewApp = (accessToken[4] == 2) ? 1 : 0;
    let userAgent = Utils.isset(req.headers['user-agent']) ? req.headers['user-agent'] : 'ua';
    let userAgentEncrypted = md5(configStr.userAgentSecretCode + userAgent);

    if (Utils.isEmpty(userId) && Utils.isEmpty(msisdn) || uaEncrypted != userAgentEncrypted || expired_time < Utils.time()) {
        return { responseCode: response.FORBIDDEN, message: response.getMessage(response.FORBIDDEN) };
    } else {
        let responseObj = {
            responseCode: response.SUCCESS,
            message: response.getMessage(response.SUCCESS),
            data: {
                accessToken: token,
                msisdn: msisdn,
                userId: userId,
                needHiddenFreemiumContent: needHiddenFreemiumContent,
                needShowPopupRequireInstallNewApp: needShowPopupRequireInstallNewApp,
                captchaToken: matches[1]

            }
        }

        return responseObj;
    }

}


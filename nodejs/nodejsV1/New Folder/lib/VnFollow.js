const S3Service = require('../lib/S3Service');
const vnPromotion = require('../models/VnPromotionData.model');
const vnSub = require('../models/VnSub.model');
const redis = require('../config/redis');
const params = require('../config/params');
const config = params.configStr;
const redisService = require('../services/redis.service');
const obj = require('../lib/Obj');
const Utils = require('../lib/Utils');
const VnConfigModel = require('../models/vnConfig.model');
const VnHelper = require('../lib/VnHelper');
const VnSubModel = require('../models/VnSub.model');

const VnCdrBlacklistModel = require('../models/vnCdrBlacklist.model');

/**
 * dungld
 * Tra ve popup
 * @param msisdn
 */
exports.loadPromotionPopup = async function (msisdn, isLoadFirst = false) {
    if (Utils.isEmpty(msisdn)) {
        return [];
    }

    promotion = await vnPromotion.checkPromotionData(msisdn);
    if (promotion != null) {

        // check msisdn exits sub
        let objSub = await vnSub.getOneSubByMsisdn(msisdn);
        //if exits sub then not display popup
        if (objSub) {
            return [];
        }
        let key = obj.promotion_ + msisdn;
        let hasInRedis = redisService.getKey(key, redis.dbCache);

        //check key redis
        var keyPopup = obj.promotion_popup_firsttime;
        if (isLoadFirst) {
            keyPopup = obj.promotion_popup_firsttime;
        } else if (!Utils.isEmpty(hasInRedis)) {
            keyPopup = promotion.popup;
        } else {
            redisService.setKey(key, Utils.getCurrentTime("yyyy-mm-dd HH:MM:ss"), redis.CACHE_10MINUTE, dbRedis);
        }

        if (keyPopup) {
            let arrReplace = [];
            arrReplace.MSISDN = Utils.getMobileNumber(msisdn, params.configStr.MOBILESIMPLE);
            arrReplace.EXPIREDAT = Utils.converDate(promotion.expired_at, "dd/MM/yyyy HH:MM:ss");
            return {
                popupId: keyPopup,
                popupMessage: str_replace(array_keys($arrReplace), array_values($arrReplace), config.getConfigKey(keyPopup, ""))
            };
        } else {
            return [];
        }
    } else {
        return [];
    }
}

viewVideo = async function (msisdn, video, playlistId = false, profile = false, userId = 0, authJson, supportType = S3Service.VODCDN, acceptLossData = 0, allowViewFreeDontNeedLogin = null, distributionId = null, networkDeviceId = null, deviceType = '', appId = 'app-api') {
    let arrReturn = new Promise(async function (resolve, reject) {
        if (Utils.isEmpty(video)) {
            resolve({
                errorCode: ResponseCode.UNSUCCESS,
                message: 'Video không hợp lệ',
                urlStreaming: '',
            });
        }
        // chuyen type xem ve video
        video.type = 'VOD';
        // Kiem tra xem co cap quyen xem noi dung mien phi khong can dang nhap khong?
        if (!Utils.isset(allowViewFreeDontNeedLogin)) {
            allowViewFreeDontNeedLogin = await VnConfigModel.getConfig('ALLOW_VIEW_FREE_DONT_NEED_LOGIN', 0);
        }
        let isInPool = VnHelper.isIPInDetectPool();
        let popupObj = [];
        let canView = false;
        if (allowViewFreeDontNeedLogin && video.price_play == 0) {
            if (!isInPool) {
                canView = true;
                // Yii::info('VIEW_FREE_WIFI|' . $msisdn . "|" . $userId . "|" . $video['id'] . "|" . $video['slug'], 'traceview');
            } else {
                if (!msisdn && !userId) {
                    resolve({
                        errorCode: authJson.responseCode,
                        message: authJson.message,
                        urlStreaming: '',
                    });
                }
            }
        } else if (!msisdn && !userId) {
            resolve({
                errorCode: authJson.responseCode,
                message: authJson.message,
                urlStreaming: '',
            });
        }

        //Kiem tra xem KH co quyen xem mien phi noi dung khi dang cho dang ky hay khong?
        let keyViewWaitRegister = Obj.VIEW_WAIT_REGISTER.replace('[userId]', userId);
        let viewWaitRegister = await redisService.getKey(keyViewWaitRegister);
        if (userId && viewWaitRegister) {
            let keyNumViewWaitRegister = Obj.NUM_VIEW_WAIT_REGISTER.replace('[userId]', userId);
            let numVideoHasView = await redisService.getKey(keyNumViewWaitRegister);
            await redisService.setKey(keyNumViewWaitRegister), numViewWaitRegister;
            // Yii::$app->getCache()->set("NUM_VIEW_WAIT_REGISTER_".$userId, numVideoHasView +1, Object.CACHE_1DAY);
            if (numVideoHasView <= Obj.num_video_viewfree_waitregister) {
                canView = true;
                // Yii::info('VIEW_FREE_WAIT_REGISTER|' . $msisdn . "|" . $userId . "|" . $video['id'] . "|" . $video['slug'], 'traceview');
            }
        }

        //Kiem tra xem noi dung co mien phi
        let quotaFreeNDay;
        let traceAtTime;
        let viewIdsKey;
        let idStr;
        if (!canView && video.price_play == 0) {

            quotaFreeNDay = config.quota_free_n_day;
            videoFreeNDay = config.quota_video_free_n_day;
            //Check quyen xem dua tren quota
            traceAtTime = "trace_at_" + "_" + (Utils.isset(msisdn) ? msisdn : "") + "_" + userId + "_" + quotaFreeNDay;
            viewIdsKey = "view_ids_" + (Utils.isset(msisdn) ? msisdn : "") + "_" + userId + "_" + quotaFreeNDay;

            //if not exist item => reset
            let checkTraceAtTime = await redisService.getKey(traceAtTime);
            if (!checkTraceAtTime) {
                await promise.all([
                    redisService.setKey(traceAtTime, quotaFreeNDay * 86400),
                    redisService.setKey(viewIdsKey, ""),
                ]);
            } else {
                idStr = await redisService.getKey(viewIdsKey);

            }

            ids = array();

            if (!Utils.isEmpty(idStr)) {
                ids = idStr.split(',');
            }

            if (ids.length < videoFreeNDay || Utils.in_array(video.id, ids)) {
                canView = true;
                // Yii::info('VIEW_FREE|' . $msisdn . "|" . $userId . "|" . $video['id'] . "|" . $video['slug'], 'traceview');
                ids.push(video.id);
                redisService.setKey(viewIdsKey, ids.join(","));

            } else {
                canView = false;
                // Yii::info('CHECK FREE QUOTA|' . $msisdn . "|" . $video['id'] . "|FALSE" . "|REMAIN QUOTA: " . ($videoFreeNDay-count($ids)), 'traceview');
            }
        }

        // Kiem tra xem khach hang co dang ky goi cuoc video
        let objSub = await VnSubModel.getOneSubByMsisdn(msisdn);

        if (objSub) {
            // XU LY TRUONG HOP TAM NGHUNG SU DUNG DICH VU (4GPPLAY)
            if (objSub.is_block == "1" && await VnConfigModel.getConfig("is_enable_block_viewsub", 0)) {
                canView = false;
                popupObj.is_register_sub = 0;
                popupObj.is_buy_video = 0;
                popupObj.is_buy_playlist = 0;
                popupObj.confirm = await VnConfigBase.getConfig("msg_block_sub", "Thuê bao đang bị tạm ngưng sử dụng dịch vụ");
                // Yii::info('BLOCKVIEW_SUB|' . $msisdn . "|" . $objSub['id'] . "|" . $video['id'] . "|" . $video['slug'], 'traceview');

            } else {
                // Goi CDR doi soat
                if (!await VnCdrBlacklistModel.checkBlacklist(video.id, video.created_by, video.cp_id)
                    && (empty(objSub.distribution_id) || objSub.distribution_id >= 9990)
                    && (!strstr(video.cp_code, "USER_UPLOAD") || validator.isIn(video.created_by, arrWhitelistUserUpload))) {
                    exportCdr(video, objSub, config.app_source);
                }

                canView = true;
                // Yii::info('VIEW_SUB|' . $msisdn . "|" . $objSub['id'] . "|" . $video['id'] . "|" . $video['slug'], 'traceview');
            }
        } else {
            // Yii::info('CHECK REGISTER SUB|' . $msisdn . "|" . $objSub['id'] . "|FALSE", 'traceview');

            // Kiem tra xem khach hang da mua le video hay chua?
            let objBuyVideo = ''; //await VnBuyVideoModel.checkBuyVideo(msisdn, video);

            if (objBuyVideo) {
                canView = true;
                // Yii::info('VIEW_BUYVIDEO|' . $msisdn . "|" . $objBuyVideo['id'] . "|" . "|" . $video['id'] . "|" . $video['slug'], 'traceview');
            } else {
                // Yii::info('CHECK BUY VIDEO|' . $msisdn . "|" . $video['id'] . "|FALSE", 'traceview');
                // Kiem tra xem da mua playlist chua video
                let objBuyPlaylist = ""; //await VnBuyPlaylistModel.checkBuyPlaylist(msisdn, video);

                if (objBuyPlaylist) {
                    canView = true;
                    // Yii::info('VIEW_BUYPLAYLIST|' . $msisdn . "|" . $objBuyPlaylist['id'] . "|" . $video['id'] . "|" . $video['slug'], 'traceview');
                } else {
                    // Yii::info('CHECK BUY PLAYLIST|' . $msisdn . "|" . $objBuyPlaylist['id'] . "|FALSE", 'traceview');

                    // Moi dang ky goi cuoc
                    objPackage = await VnPackageModel.getSuggestPackage();
                    let find = [
                        '#free_times', "#free_range", '#videoName', '#fee', '#packageName', '#cycle', '#subPrice'
                    ];
                    let replace = [
                        videoFreeNDay, quotaFreeNDay, video.name, Utils.number_format(video.price_play), objPackage.name,
                        Utils.convertDay(objPackage.charge_range), Utils.number_format(objPackage.fee)
                    ];
                    // Moi neu co goi cuoc
                    if (objPackage) {
                        popupObj.is_register_sub = 1;
                        popupObj.confirm_register_sub = Utils.replaceArray(find, replace, config.popup_confirm_registersub);
                        popupObj.package_id = objPackage.id;
                    } else {// Moi khi khong co goi cuoc
                        popupObj.is_register_sub = 0;
                    }

                    if (await VnConfigModel.getConfig('ALLOW_BUY_VIDEO') && video.price_play > 0) {
                        popupObj.video_id = video.id;
                        popupObj.is_buy_video = 1;
                        popupObj.confirm_buy_video = Utils.replaceArray(find, replace, config.popup_confirm_buyvideo);
                    } else {
                        popupObj.is_buy_video = 0;
                    }

                    if (VnConfigModel.getConfig('ALLOW_BUY_PLAYLIST')) {
                        playlist = await VnPlaylistModel.checkVideoInPlaylist(video.id, playlistId);
                        if (playlist && playlist.price_play > 0) {
                            find.push('#playlistName');
                            find.push('#playlistPrice');
                            replace.push(playlist.name);
                            replace.push(playlist.price_play);

                            popupObj['is_buy_playlist'] = 1;
                            popupObj['playlist_id'] = playlistId;
                            popupObj['confirm_buy_playlist'] = Utils.replaceArray(find, replace, config.popup_confirm_buyplaylist);
                        } else {
                            popupObj.is_buy_playlist = 0;
                        }
                    } else {
                        popupObj.is_buy_playlist = 0;
                    }
                    popupObj.is_register_fast = 0;

                    let tmpConfig = popupObj.is_register_sub + popupObj.is_buy_video + popupObj.is_buy_playlist;
                    let strConfig = 'popup_confirm_' + tmpConfig;

                    popupObj.confirm = Utils.replaceArray(find, replace, config[strConfig]);

                    //Suggest popup by video
                    if (!Utils.isEmpty(video.suggest_package_id)) {
                        objPackage = await VnPackageModel.getSuggestPackage(video.suggest_package_id);
                        let findPack = ['#videoName', '#fee', '#packageName', '#cycle', '#subPrice'];
                        let replacePack = [video.name, Utils.number_format(video.price_play), objPackage.name, Utils.convertDay(objPackage.charge_range, Utils.number_format(objPackage.fee))];
                        popupObj.is_register_sub = 1;
                        popupObj.confirm = Utils.replaceArray(findPack, replacePack, config.popup_suggestion_confirm);
                        popupObj.confirm_register_sub = Utils.replaceArray(findPack, replacePack, config.popup_suggestion_register_sub);
                        popupObj.package_id = objPackage.id;
                    }

                    //@todo: override subdomain package
                    if (Utils.isEmpty(distributionId)) {
                        let objPackage = await VnPackageModel.getDistributionPackage(distributionId);
                        let findDispack = ['#videoName', '#fee', '#cycle', '#subPrice'];
                        let replaceDispack = [video.name, Utils.number_format(video.price_play), Utils.convertDay(objPackage.charge_range), Utils.number_format(objPackage.fee)];

                        popupObj.is_register_sub = 1;
                        popupObj.confirm = Utils.replaceArray(findDispack, replaceDispack, config.popup_suggestion_confirm);
                        popupObj.confirm_register_sub = Utils.replaceArray(findDispack, replaceDispack, config.popup_suggestion_register_sub);
                        popupObj.package_id = objPackage.id;
                    }
                }
            }
        }
        //Kiem tra khuyen mai
        if (!canView) {
            promotion = await VnPromotionDataModel.checkPromotion(msisdn);
            if (promotion) {
                canView = true;
                //Yii::info('VIEW_FREE_PROMOTION|' . $video['id'] . "|" . $profile . "|" . $promotion['code'], 'traceview');
            }
        }


        if (!Utils.isEmpty(video.category_id) && !Utils.isEmpty(userId)) {
            let keyCatIds = config.category_list_watch.replace('[userId]', userId);
            let strCatIds = redisService.getKey(keyCatIds);
            let categoryIds = strCatIds.split(','); //array_filter(explode(',', Yii::$app->getCache()->get("category_list_watch_" . $userId)));

            if (!Utils.isEmpty(categoryIds)) {
                categoryIds = categoryIds.diff([video.category_id]); //array_diff($categoryIds, [$video['category_id']]);
            }

            //array_push($categoryIds, $video['category_id']);
            categoryIds.push(video.category_id);
            await redisService.setKey(keyCatIds, categoryIds.join(','))

            //Yii::$app->getCache()->set("category_list_watch_" . $userId, implode(',', $categoryIds));
        }

        if (canView || (acceptLossData == '1' && $video['price_play'] == 0)) {

            if (canView || (acceptLossData == '1' && video.price_play == 0)) {
                let profile = 4;
                let supportType = S3Service.OBJCDN;
                let isDrmSuccess = await drmHandle(msisdn, userId, networkDeviceId, deviceType);
                if (!isDrmSuccess) {
                    resolve({
                        errorCode: FLOW_FAIL,
                        message: "Xác thực bản quyền thất bại",
                        urlStreaming: "",
                        popup: popupObj,
                        videoId: video.id,
                    });
                }
            }

            try {
                VnHistoryViewModel.insertContinue(userId, msisdn, video, 0, playlistId);

            } catch (e) {
                // Yii::error("Elastic Search ERROR:" . $ex);
            }
            // Yii::info($msisdn . "|" . $userId . "|" . $video['id'] . "|" . date("YmdHis") . "|" . $profile, 'view');

            convertFile = await VnConvertedFileModel.getConvertFile(video, profile);
            if (!convertFile) {
                //Yii::info('CONVERT_FILE_NOT_FOUND|' . $video['id'] . "|" . $profile, 'traceview');
                convertFile = video;
            } else {
                //Yii::info('PLAY_CONVERT_FILE|' . $video['id'] . "|" . $profile, 'traceview');
            }

            if (!Utils.isEmpty(networkDeviceId)) {
                //$convertFile['bucket'] = 'bucket';
                //$convertFile['path'] = '/2017/07/14/15/75236b20/75236b20-8991-4f28-9a70-c1f1aa2067cc_1_.m3u8';
            }

            // Cap nhat luot xem (comment - chuyen sang tien trinh)
            //VtVideoBase::updatePlayTimes($video['id']);
            //if ($playlistId > 0) {
            //    VtPlaylistBase::updatePlayTimes($playlistId);
            //}

            //Tu dong hien thi popup moi khi xem
            let keyFreeWatchCount = config.free_watch_count.replace('[msisdn]', msisdn);
            let currentFreeWatchCount = await redisService.getKey(keyFreeWatchCount); //intval(Yii::$app->cache->get('free_watch_count_' . $msisdn));
            await redisService.setKey(keyViewWaitRegister, currentFreeWatchCount + 1);

            let streamUrl = await S3Service.generateStreamURL(convertFile, supportType, canView);

            // Yii::info('LOG_VOD|' . $video['type'] . '|' . $video['id'] . '|' . $profile . '|' . $msisdn . '|' . $userId . '|' . str_replace('|', ' ', $video['name']) . '|' . $streamUrl . '|' . $video['category_id'] . '|' . Yii::$app->id. '|' . $video['cp_id']. '|' . $video['cp_code'], 'log_vod');

            let response = {
                errorCode: FLOW_SUCCESS,
                message: 'Thành công',
                urlStreaming: streamUrl,
            };

            if (popupObj && ((video.suggest_package_id)) && appId == 'app-api') {
                response.popup = popupObj;
            }

            resolve(response);
        } else {

            if (video.price_play == 0 && isInPool) {
                popupObj.confirm_accept_loss_data = config.popup_confirm_accept_loss_data;
                popupObj.accept_loss_data = 1;
            }

            let isConfirm = 0;

            //Kiem tra cau hinh xem co can confirm dang ky hay khong?
            switch (appId) {
                case 'app-wap':
                    isConfirm = await VnConfigModel.getConfig("IS_ON_CONFIRM_SMS_WAP", 0);
                    break;
                case 'app-api':
                    isConfirm = await VnConfigModel.getConfig("IS_ON_CONFIRM_SMS_APP", 0);
                    break;
                case 'app-web':
                    isConfirm = await VnConfigModel.getConfig("IS_ON_CONFIRM_SMS_WEB", 0);
                    break;
            }

            let source = ''; //Yii::$app->session->get('source');

            //Kiem tra source, neu thuoc whitelist thi khong can conffimr (GA)
            whiteList = await VnConfigModel.getConfig('register.whitelist.no.confirm');

            if (whiteList.toUpperCase().indexOf(source.toUpperCase()) !== false) {
                isConfirm = 0;
            }
            // Neu mua sub, khong mua le, khong co xem tiep va bat dang ky nhanh(confirm SMS)
            if (popupObj.is_register_sub && !popupObj.is_buy_video && !popupObj.is_buy_playlist && !popupObj.accept_loss_data && isConfirm) {
                let isRegisterFast = await VnConfigModel.getConfig("IS_REGISTER_FAST", 0);
                if (isRegisterFast) {
                    popupObj.is_register_fast = 1;
                    popupObj.content_id = video.id;
                }
            }

            popupObj.is_confirm_sms = isConfirm;

            resolve({
                errorCode: FLOW_FAIL,
                message: 'Thất bại',
                urlStreaming: '',
                popup: popupObj
            });
        }
    })
    return arrReturn;
}
module.exports.viewVideo = viewVideo;

exportCdr = function () {

}
drmHandle = function () {

}
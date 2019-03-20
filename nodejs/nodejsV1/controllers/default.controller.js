const obj = require('../lib/Obj');
const response = require('../lib/ResponseCode');
const CategoryObj = require('../lib/CategoryObj');
const VideoObj = require('../lib/VideoObj');
const CommentObj = require('../lib/CommentObj');
const ChannelObj = require('../lib/ChannelObj');
const config = require('../models/config.model');
const groupCate = require('../models/VnGroupCategory.model');
const packageBase = require('../models/VnPackage.model');
const vnSubBase = require('../models/VnSub.model');
const VnVideoBase = require('../models/VnVideo.model');
const VnCommentBase = require('../models/VnComment.model');
const VnCommentLikeBase = require('../models/VnCommentLike.model');
const VnHotKeywordBase = require('../models/VnHotKeyword.model');
const VnUserBase = require('../models/VnUser.model');
const VnPlaylistBase = require('../models/VnPlaylist.model');
const VnFeedBackBase = require('../models/VnFeedBack.model');
const VnUserFollowBase = require('../models/VnUserFollow.model');
const params = require('../config/params');
const utils = require('../lib/Utils');
const VnHelper = require('../lib/VnHelper');
const { to, ReE, ReS } = require('../services/util.service');
const vnFollow = require('../lib/VnFollow');
const validator = require('validator');
const vc = require('version_compare');
const configStr = params.configStr;

exports.getHome = async function (req, res) {
    let limitN = configStr.videoLimitNboxHome;
    let limitCategory = configStr.appCategoryLimit = 12;
    let msisdn = '84989826271'; //todo msisdn
    let appId = '';
    let dataResponse = [];
    let categoryBox = CategoryObj.serialize(
        obj.CATEGORY_PARENT, await groupCate.getParents(0, limitCategory, false), true, appId
    );

    if (typeof categoryBox.content !== 'undefined' && categoryBox.content) {
        dataResponse.push(categoryBox);
    }
    //Lay danh sach video moi
    let ids = await VnVideoBase.getVideoHomePage(limitN, true);
    // //home_video_v2
    videoBox = VideoObj.serialize(
        obj.HOME_VIDEO_V2, await VnVideoBase.getAllVideo(ids), true, false, obj.NEWSFEED, appId
    );

    if (utils.isset(videoBox.content) && videoBox.content) {
        dataResponse.push(videoBox);
    }

    let responseObj = {
        responseCode: response.SUCCESS,
        message: await response.getMessage(response.SUCCESS),
        data: dataResponse,
        popup: vnFollow.loadPromotionPopup(msisdn)
    }

    return ReS(res, responseObj, 200);

};

exports.getSetting = async function (req, res) {
    let htmlContent =
        [
            {
                type: "term-condition",
                content: await config.getConfigKey('HTML_TERM_CONDITION')
            },
            {
                type: "intro",
                content: await config.getConfigKey('HTML_INTRO')
            },
            {
                type: "contact",
                content: await config.getConfigKey('HTML_CONTACT')
            },
            {
                type: "term-privacy",
                content: await config.getConfigKey('HTML_PRIVACY')
            },
            {
                type: "summary",
                content: await config.getConfigKey('HTML_SUMMARY')
            },
        ];
    var hiddenPackage = false;
    var osVersionCode = req.query.os_version_code;
    var osType = req.query.os_type;
    if (osVersionCode && osType) {
        osType = osType.toUpperCase();
        if (osType == 'IOS' && vc.gte(osVersionCode, await config.getConfigKey("VERSION_APP_" + osType), 0) == true) {
            hiddenPackage = true;
        }

    }
    let type = ['VOD', 'FILM'];
    if (hiddenPackage) {
        type = 'VOD';
    }
    categories = await groupCate.getAllActiveCategory(type);

    let tmpCate = [];
    let cc = 0;
    // Danh sach the loai nhac, video
    let mcList = await config.getConfigKey('music.category.list');
    let vcList = await config.getConfigKey('video.category.list');
    let fcList = await config.getConfigKey('film.category.list');
    let musicCategoryList = (mcList == "") ? [] : mcList.split(",");
    let videoCategoryList = (vcList == "") ? [] : vcList.split(",");
    let filmCategoryList = (fcList == "") ? [] : fcList.split(",");

    if (categories != null) {
        categories.forEach(function (items) {
            let cateId = items.id + "";
            if (musicCategoryList.includes(cateId) && items.type == obj.VOD) {
                let tmpMus = {};
                tmpMus.id = items.id;
                tmpMus.name = items.name;
                tmpMus.type = items.type;
                tmpMus.filter_type = obj.MUSIC;
                tmpMus.getMoreContentId = obj.CATEGORY_GROUP + items.id;
                tmpCate[cc] = tmpMus;
                cc++;
            }

            if (videoCategoryList.includes(cateId) >= 0 && items.type == obj.VOD) {
                let tmpVod = {};
                tmpVod.id = items.id;
                tmpVod.name = items.name;
                tmpVod.type = items.type;
                tmpVod.filter_type = obj.VIDEO;
                tmpVod.getMoreContentId = obj.CATEGORY_GROUP + items.id;
                tmpCate[cc] = tmpVod;
                cc++;
            }

            if (filmCategoryList.includes(cateId) && items.type == obj.FILM) {
                let tmpFilm = {};
                tmpFilm.id = items.id;
                tmpFilm.name = items.name;
                tmpFilm.type = items.type;
                tmpFilm.filter_type = obj.VIDEO;
                tmpFilm.getMoreContentId = obj.CATEGORY_GROUP + items.id;
                tmpCate[cc] = tmpFilm;
                cc++;

            }
        });

    }
    let responseObj = {
        responseCode: response.SUCCESS,
        message: await response.getMessage(response.SUCCESS),
        data: {
            isOnGame: parseInt(await config.getConfigKey("IS_ENABLE_GAME_TET")),
            event: await config.getConfigKey('event.name'),
            isOnEventIphoneX: parseInt(await config.getConfigKey('IS_ON_EVENT_IPHONEX_APP')),
            quality: params.settingQuality,
            feedBack: params.settingFeedback,
            categories: tmpCate,
            acceptLostDataTimeout: params.configStr.acceptLostDataTimeout,
            htmlContent: htmlContent,

        }
    };
    return ReS(res, responseObj, 200);

};
exports.getListPackage = async function (req, res) {
    //todo 
    let msisdn = '0989826271';

    let needHiddenFreemiumContent = false;
    let osType = req.query.os_type;
    let osVersionCode = req.query.os_version_code;
    let distributionId = req.query.distribution_id;
    let source = req.query.source;
    let hiddenPackage = checkHiddenContent(osType, osVersionCode);
    let popupPromotion = await vnFollow.loadPromotionPopup(msisdn, true);
    if (popupPromotion != null) {
        let responseObj = {
            responseCode: response.SUCCESS,
            message: await response.getMessage(response.SUCCESS),
            data: [],
            popup: popupPromotion
        }

        return ReS(res, responseObj, 200);
    }
    let arrPackages = await packageBase.getListPackage(distributionId);
    var strSub = [];
    var data = [];

    if (msisdn) {
        arrSubS = await vnSubBase.getSub(msisdn);
        if (arrSubS != null) {
            arrSubS.forEach(function (items) {
                strSub.push(items.package_id);
            });
        }
    }
    let packageName = null;
    if (arrPackages != null) {
        arrPackages.forEach(function (package) {

            if ((utils.isEmpty(distributionId) && utils.isEmpty(package.distribution_id)) || (utils.isEmpty(distributionId) && strSub.includes(package.id)) || (!utils.isEmpty(distributionId) && distributionId == package.distribution_id)) {

                let item = {};
                item.id = package.id;
                item.name = package.name;
                item.fee = package.fee;
                item.short_description = package.short_description;
                item.description = package.description;

                let cycleArr = package.charge_range.split(' ');
                item.cycle = utils.isset(cycleArr[1]) ? cycleArr[1] : '';
                if (strSub.includes(package.id)) {
                    packageName = package.name;
                    item.status = 1;
                    let arrReplace = {
                        PACKAGENAME: utils.htmlspecialchars(item.name, 'ENT_QUOTES', 'UTF-8'),
                        CYCLE: utils.convertDay(package.charge_range),
                        PRICE: package.fee
                    };
                    let popup = [];
                    popup.push(utils.str_replace(configStr.listPackageCancelConfirm, utils.array_keys(arrReplace), utils.array_values(arrReplace)));
                    item.popup = popup;

                } else {
                    item.status = 0;
                    let arrReplace = {
                        PACKAGENAME: utils.htmlspecialchars(item.name, 'ENT_QUOTES', 'UTF-8'),
                        CYCLE: utils.convertDay(package.charge_range),
                        PRICE: package.fee
                    };

                    let popup = [];
                    popup.push(utils.str_replace(configStr.listPackageConfirm, utils.array_keys(arrReplace), utils.array_values(arrReplace)));
                    item.popup = popup;

                }
                //Chi hien thi nhung thue bao da dang ky goi cuoc hoac hien thi frontend
                if (item.status || package.is_display_frontend) {
                    data.push(item);
                }
            }

        });
    }
    let infoMessage = configStr.listPackageInfoMessage;
    if (packageName != null) {
        infoMessage = utils.str_replace("MSISDN", utils.hideMsisdn(msisdn), utils.str_replace("PACKAGENAME", packageName, infoMessage));
    }

    // Neu can hidden noi dung de duyet app iOS
    if (needHiddenFreemiumContent || hiddenPackage) {
        let responseObj = {
            responseCode: response.SUCCESS,
            message: await response.getMessage(response.SUCCESS),
            data: []
        }

        return ReS(res, responseObj, 200);
    } else {

        let isConfirm = config.getConfigKey('IS_ON_CONFIRM_SMS_APP', 0);
        let whiteList = config.getConfigKey('register.whitelist.no.confirm');
        if (utils.strpos(whiteList.toUpperCase(), source.toUpperCase()) !== false) {
            isConfirm = 0;
        }

        let responseObj = {
            responseCode: response.SUCCESS,
            message: await response.getMessage(response.SUCCESS),
            data: data,
            infoMessage: infoMessage,
            isConfirmSMS: isConfirm,
            is_confirm_sms: isConfirm
        }

        return ReS(res, responseObj, 200);

    }
}
exports.toggleLikeComment = async function (req, res) {
    //todo
    let userId = 1;
    const body = req.body;
    let type = req.body.type;
    let commentId = req.body.commentId;
    let contentId = req.body.contentId;

    if (utils.isEmpty(type) == false) {
        type = type.toUpperCase();
    }
    if (utils.isEmpty(commentId) || utils.isEmpty(contentId) || !validator.isIn(type, configStr.objectType)) {
        return res.json({ responseCode: response.UNSUCCESS, message: response.getMessage(response.INVALID_PARAM) });
    }
    let isLike = true;
    let favObj = await VnCommentLikeBase.getDetailLike(userId, commentId);
    console.log(favObj);
    if (favObj) {
        let res = await VnCommentLikeBase.deleteLike(favObj.id);
        isLike = false;
    } else {
        let insert = await VnCommentLikeBase.creatCommentLike(userId, commentId, contentId, type);
        isLike = true;
    }

    let up = await VnCommentBase.updateLikeCount(commentId, isLike);
    return res.json({
        responseCode: response.SUCCESS,
        message: response.getMessage(response.SUCCESS),
        data: {
            isLike: isLike
        }
    });
}
exports.search = async function (req, res) {

    let responseObj = {
        responseCode: response.SUCCESS,
        message: await response.getMessage(response.SUCCESS),
        data: ""

    };
    return ReS(res, responseObj, 200);
}
exports.searchSuggestion = async function (req, res) {

    let responseObj = {
        responseCode: response.SUCCESS,
        message: await response.getMessage(response.SUCCESS),
        data: ""

    };
    return ReS(res, responseObj, 200);
}
exports.postComment = async function (req, res) {
    //todo
    let userId = 13;
    const body = req.body;
    let type = req.body.type;
    let commentId = req.body.commentId;
    let contentId = req.body.contentId;
    let parentId = req.body.parent_id;
    let comment = req.body.comment;

    if (utils.isEmpty(type) == false) {
        type = type.toUpperCase();
    }
    if (utils.isEmpty(comment) || !validator.isIn(type, configStr.objectType)) {
        return res.json({ responseCode: response.UNSUCCESS, message: response.getMessage(response.INVALID_DATA) });
    }

    if (comment.length < configStr.commentMinlength || comment.length > configStr.commentMaxlength) {
        let p = {
            "MIN%": configStr.commentMinlength,
            "MAX%": configStr.commentMaxlength
        };
        let msg = utils.replaceBulk(response.getMessage(response.INVALID_LENGTH), utils.array_keys(p), utils.array_values(p));
        return res.json({ responseCode: response.UNSUCCESS, message: msg });

    }
    if (utils.isEmpty(commentId) || !validator.isNumeric(contentId) || utils.isEmpty(type) || utils.isEmpty(parentId) || !validator.isNumeric(parentId)) {
        return res.json({ responseCode: response.UNSUCCESS, message: response.getMessage(response.INVALID_COMMENT) });
    }
    let content = "";
    switch (type) {
        case 'VOD':
            let video = await VnVideoBase.getDetail(contentId, type);
            if (video) {
                content = video.name;
            }
            break;
        case 'PLAYLIST':
            let playlist = await VnPlaylistBase.getDetail(contentId);
            if (playlist) {
                content = playlist.name;
            }
            break;
    }
    if (utils.isEmpty(content)) {
        return res.json({ responseCode: response.NOT_FOUND, message: response.getMessage(response.INVALID_CONTENT_COMMENT) });
    }
    let vnComment = await VnCommentBase.creatComment(userId, commentId, contentId, type, content, content);
    let vnUser = await VnUserBase.getUserById(userId);
    console.log(vnUser);
    return res.json({
        responseCode: response.SUCCESS,
        message: response.getMessage(response.SUCCESS),
        data: {
            id: vnComment.id,
            type: vnComment.type,
            full_name: (vnUser.full_name) ? vnUser.full_name : vnUser.msisdn,
            user_id: vnUser.id,
            avatarImage: VnHelper.getThumbUrl(vnUser.bucket, vnUser.path, obj.SIZE_AVATAR),
            comment: vnComment.comment,
            like_count: 0,
            parent_id: vnComment.parent_id,
            created_at: new Date(),
            created_at_format: utils.timeElapsedString(vnComment.created_at),
            is_like: false

        }
    });
}
exports.getListComment = async function (req, res) {
    //todo
    userId = 13;
    let type = req.query.type;
    let contentId = req.query.content_id;
    let limit = req.query.limit;


    if (utils.isEmpty(limit)) {
        limit = configStr.commentLimit;
    }

    let offset = req.query.offset;
    let commentId = req.query.comment_id;

    if (utils.isEmpty(type) == false) {
        type = type.toUpperCase();
    }
    if (utils.isEmpty(type) || utils.isEmpty(contentId) || !validator.isIn(type, configStr.objectType)) {
        return res.json({ responseCode: response.UNSUCCESS, message: response.getMessage(response.INVALID_DATA) });
    }
    let parentComments = [];
    let isLikesArr = [];
    if (!utils.isEmpty(commentId)) {
        let contents = await VnCommentBase.getByContentId(userId, type, contentId, limit, offset, commentId);

        if (!utils.isEmpty(userId)) {
            isLikesArr = await VnCommentLikeBase.getLikeIdWithUserId(userId, contentId);
        }
        let comments = CommentObj.serialize(contents, isLikesArr);
        parentComments = comments.content;
    } else {
        let contents = await VnCommentBase.getByContentId(userId, type, contentId, parseInt(limit), parseInt(offset), null);
        if (!utils.isEmpty(userId)) {
            isLikesArr = await VnCommentLikeBase.getLikeIdWithUserId(userId, contentId);
        }
        let comments = CommentObj.serialize(contents);
        let parentIds = comments.parentIds;
        let childComments = VnCommentBase.getByContentId(userId, type, contentId, null, null, parentIds);
        let childContent = CommentObj.serialize(contents, isLikesArr, childComments);
        parentComments = childContent.content;
        console.log(parentComments);
    }


    let responseObj = {
        responseCode: response.SUCCESS,
        message: await response.getMessage(response.SUCCESS),
        data: parentComments

    };
    return ReS(res, responseObj, 200);
}
exports.getMoreContent = async function (req, res) {
    let id = req.query.id.trim();
    let offset = req.query.offset.trim();
    let limit = req.query.limit.trim();
    let contents = [];
    limit = parseInt(limit);
    offset = parseInt(offset);
    //todo
    let appId = "app-api";
    switch (id.toLowerCase()) {
        case obj.VIDEO_HOT_2.toLowerCase():
        case obj.VIDEO_HOT.toLowerCase():
            let ids = await VnVideoBase.getVideoHomePage(configStr.videoLimitNboxHome, true);
            // //home_video_v2
            contents = VideoObj.serialize(
                obj.HOME_VIDEO_V2, await VnVideoBase.getAllVideo(ids), true, false, obj.NEWSFEED, appId
            );
            break;
        case obj.VIDEO_NEW.toLowerCase():

            contents = VideoObj.serialize(
                obj.VIDEO_NEW, await VnVideoBase.getNewVideo("", limit, offset)
            );
            break;
        case obj.VIDEO_RECOMMEND.toLowerCase():

            contents = VideoObj.serialize(
                obj.VIDEO_RECOMMEND, await VnVideoBase.getRecommendVideoMixQuery(limit, offset)
            );
            break;

        case obj.VIDEO_OWNER.toLowerCase():
            //todo
            let userId = 13;
            contents = VideoObj.serialize(
                obj.VIDEO_OWNER, await VnVideoBase.getAllVideosByUser('', userId, limit, offset, vnVideoEnum.TYPE_VOD), false, obj.getName(obj.VIDEO_OWNER)
            );
            break;
        case obj.VIDEO_WATCH_LATER.toLowerCase():
            //todo
            let userId = 13;

            break;
        case obj.VIDEO_HISTORY.toLowerCase():
            //todo
            let userId = 13;

            break;
        case obj.VIDEO_CHANNEL_FOLLOW.toLowerCase():
            //todo
            let userId = 13;

            break;
        case obj.LIST_CHANNEL_FOLLOW.toLowerCase():
            //todo
            let userId = 13;
            contents = ChannelObj.serialize(
                Obj.CHANNEL_FOLLOW, VnUserFollowBase.getChannelFollowQuery(userId, limit, offset), limit
            );
            break;
        case obj.LIST_CHANNEL_FOLLOW_WITH_HOT.toLowerCase():
            //todo
            let userId = 13;

            break;
        case obj.LIST_HOT_CHANNEL.toLowerCase():
            //todo
            let userId = 13;

            break;
        case obj.MY_PLAYLIST.toLowerCase():
            //todo
            let userId = 13;

            break;
        case obj.HISTORY_SEARCH.toLowerCase():
            //todo
            let userId = 13;

            break;
        case obj.CATEGORY_PARENT.toLowerCase():
            //todo
            let userId = 13;

            break;
        default:
            if (utils.strpos(id.toLowerCase(), obj.RELATED_OF_VIDEO) === 0) {

            } else if (utils.strpos(id.toLowerCase(), obj.RELATED_OF_VIDEO) === 0) {

            }

    }

    let responseObj = {
        responseCode: response.SUCCESS,
        message: await response.getMessage(response.SUCCESS),
        data: contents

    };
    return ReS(res, responseObj, 200);
}
exports.feedBack = async function (req, res) {
    //todo
    let msisdn = 84989826271;
    let userId = 13;
    const body = req.body;
    let id = req.body.id;
    let content = req.body.content;
    let itemId = req.body.item_id;
    let type = req.body.type;

    type = utils.isset(type) ? type.trim() : type;
    if (utils.isEmpty(type) || !utils.in_array(type, configStr.objectType) || utils.isEmpty(id) || utils.isEmpty(content) || !utils.in_array(id, utils.arrayColumn(params.settingFeedback, 'id'))) {
        return res.json({ responseCode: response.UNSUCCESS, message: response.getMessage(response.INVALID_DATA) });
    }
    if (content.length < configStr.commentMinlength || content.length > configStr.commentMaxlength) {
        let p = {
            "MIN%": configStr.commentMinlength,
            "MAX%": configStr.commentMaxlength
        };
        let msg = utils.replaceBulk(response.getMessage(response.INVALID_CONTENT_FEEDBACK), utils.array_keys(p), utils.array_values(p));
        return res.json({ responseCode: response.UNSUCCESS, message: msg });

    }

    let count = await VnFeedBackBase.countFeedbackByUserThisDay(userId, msisdn);
    if (count >= configStr.feedbackLimit) {
        return res.json({ responseCode: response.SUCCESS, message: await response.getMessage(response.FEEDBACK_SUCCESS) });
    }
    await VnFeedBackBase.saveFeedBack(userId, msisdn, id, content, itemId, type);
    let responseObj = {
        responseCode: response.SUCCESS,
        message: await response.getMessage(response.FEEDBACK_SUCCESS),
    };
    return res.json(responseObj);
}
exports.getFilm = async function (req, res) {

    let responseObj = {
        responseCode: response.SUCCESS,
        message: await response.getMessage(response.SUCCESS),
        data: ""

    };
    return ReS(res, responseObj, 200);
}
exports.getHomeWeb = async function (req, res) {

    let responseObj = {
        responseCode: response.SUCCESS,
        message: await response.getMessage(response.SUCCESS),
        data: ""

    };
    return ReS(res, responseObj, 200);
}


exports.getKeywords = async function (req, res) {
    let limit = req.query.limit;
    if (limit == null || limit == "") {
        limit = configStr.appHotKeywordLimit;
    }
    let data = await VnHotKeywordBase.getActiveKeyword(limit);
    let responseObj = {
        responseCode: response.SUCCESS,
        message: await response.getMessage(response.SUCCESS),
        data: data

    };
    return ReS(res, responseObj, 200);
}
checkHiddenContent = async function (osType, osVersionCode) {
    let hiddenPackage = false;
    if (osVersionCode && osType) {
        osType = osType.toUpperCase();
        if (osType == 'IOS' && vc.gte(osVersionCode, await config.getConfigKey("VERSION_APP_" + osType), 0) == true) {
            hiddenPackage = true;
        }

    }
    return hiddenPackage;
}

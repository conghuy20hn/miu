const obj = require('../lib/Obj');
const response = require('../lib/ResponseCode');
const CategoryObj = require('../lib/CategoryObj');
const VideoObj = require('../lib/VideoObj');
const CommentObj = require('../lib/CommentObj');
const ChannelObj = require('../lib/ChannelObj');
const UserPlaylistVideoObj = require('../lib/UserPlaylistVideoObj');
const UserPlaylistObj = require('../lib/UserPlaylistObj');
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
const VnUserPlaylistItemBase = require('../models/VnUserPlaylistItem.model');
const VnVideoSearchBase = require('../models/VnVideoSearch.model');
const VnUserSearchBase = require('../models/VnUserSearch.model');
const VnGroupCategoryBase = require('../models/VnGroupCategory.model');
// const VnHistoryViewBase = require('../models/VnHistoryView.model');
const VnVideoHotBase = require('../models/VnVideoHot.model');
const Common = require('../lib/CommonModel');
const params = require('../config/params');
const Utils = require('../lib/Utils');
const VnHelper = require('../lib/VnHelper');
const { to, ReE, ReS } = require('../services/util.service');
const vnFollow = require('../lib/VnFollow');
const initUser = require('../lib/helper/initUser');
const validator = require('validator');
const vc = require('version_compare');
const configStr = params.configStr;
const dbredis = require('../config/redis');
const redis = dbredis.constant;
const redisService = require('../services/redis.service');

exports.getHome = async function (req, res) {

    let limitN = configStr.videoLimitNboxHome;
    let limitCategory = configStr.appCategoryLimit = 12;
    let user = initUser.auth(req);
    let msisdn = (user.responseCode == response.SUCCESS && Utils.isEmpty(user.data)) ? user.data.msisdn : ""; //todo msisdn
    var appId = req.headers['app_id'];
    let dataResponse = [];
    let categoryBox = await CategoryObj.serialize(
        obj.CATEGORY_PARENT, await groupCate.getParents(0, limitCategory, true), true, appId
    );

    if (typeof categoryBox.content !== 'undefined' && categoryBox.content) {
        dataResponse.push(categoryBox);
    }
    //Lay danh sach video moi
    let ids = await VnVideoBase.getVideosFindAllQuery(await VnVideoBase.getVideoHomePage(limitN, true), "getVideosFindAllQuery");
    // //home_video_v2
    videoBox = await VideoObj.serialize(
        obj.HOME_VIDEO_V2, await VnVideoBase.getAllVideo(Utils.arrayColumn(ids, "id")), true, false, obj.NEWSFEED, appId
    );

    if (Utils.isset(videoBox.content) && videoBox.content) {
        dataResponse.push(videoBox);
    }

    let responseObj = {
        responseCode: response.SUCCESS,
        message: await response.getMessage(response.SUCCESS),
        data: dataResponse,
        popup: await vnFollow.loadPromotionPopup(msisdn)
    }

    return ReS(res, responseObj, 200);

};

exports.getSetting = async function (req, res) {
    let init = initUser.auth(req);
    let needHiddenFreemiumContent = 0;
    if (init.responseCode != 200) {
        needHiddenFreemiumContent = Utils.isEmpty(init.data) ? 0 : init.data.needHiddenFreemiumContent;
    }
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
    if (needHiddenFreemiumContent == 1 || hiddenPackage) { //hide package when approved app ios
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

    let user = initUser.auth(req);
    let msisdn = (user.responseCode == obj.SUCCESS && Utils.isEmpty(user.data)) ? user.data.msisdn : '';

    let needHiddenFreemiumContent = false;
    let osType = req.query.os_type;
    let osVersionCode = req.query.os_version_code;
    let distributionId = req.query.distribution_id;
    let source = req.query.source;
    let hiddenPackage = await Common.checkHiddenContent(osType, osVersionCode);
    let popupPromotion = await vnFollow.loadPromotionPopup(msisdn, true);
    if (popupPromotion.length > 0) {
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

            if ((Utils.isEmpty(distributionId) && Utils.isEmpty(package.distribution_id)) || (Utils.isEmpty(distributionId) && strSub.includes(package.id)) || (!Utils.isEmpty(distributionId) && distributionId == package.distribution_id)) {

                let item = {};
                item.id = package.id;
                item.name = package.name;
                item.fee = package.fee;
                item.short_description = package.short_description;
                item.description = package.description;

                let cycleArr = package.charge_range.split(' ');
                item.cycle = Utils.isset(cycleArr[1]) ? cycleArr[1] : '';
                if (strSub.includes(package.id)) {
                    packageName = package.name;
                    item.status = 1;
                    let arrReplace = {
                        PACKAGENAME: Utils.htmlspecialchars(item.name, 'ENT_QUOTES', 'UTF-8'),
                        CYCLE: Utils.convertDay(package.charge_range),
                        PRICE: package.fee
                    };
                    let popup = [];
                    popup.push(Utils.str_replace(configStr.listPackageCancelConfirm, Utils.array_keys(arrReplace), Utils.array_values(arrReplace)));
                    item.popup = popup;

                } else {
                    item.status = 0;
                    let arrReplace = {
                        PACKAGENAME: Utils.htmlspecialchars(item.name, 'ENT_QUOTES', 'UTF-8'),
                        CYCLE: Utils.convertDay(package.charge_range),
                        PRICE: package.fee
                    };

                    let popup = [];
                    popup.push(Utils.str_replace(configStr.listPackageConfirm, Utils.array_keys(arrReplace), Utils.array_values(arrReplace)));
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
        infoMessage = Utils.str_replace("MSISDN", Utils.hideMsisdn(msisdn), Utils.str_replace("PACKAGENAME", packageName, infoMessage));
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

        let isConfirm = await config.getConfigKey('IS_ON_CONFIRM_SMS_APP', 0);
        let whiteList = await config.getConfigKey('register.whitelist.no.confirm');
        if (!Utils.isEmpty(whiteList) && Utils.strpos(whiteList.toUpperCase(), source.toUpperCase()) !== false) {
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
    let user = initUser.auth(req);
    if (user.responseCode != response.SUCCESS) {
        return res.json({ responseCode: user.responseCode, message: user.message });
    }
    let msisdn = (Utils.isEmpty(user.data)) ? user.data.msisdn : 0;
    let userId = (Utils.isEmpty(user.data)) ? user.data.userId : '';
    if (!Utils.isValidMsisdn(msisdn) || Utils.isEmpty(userId)) {
        return { responseCode: response.FORBIDDEN, message: response.getMessage(response.FORBIDDEN) };
    }
    let type = req.body.type;
    let commentId = req.body.commentId;
    let contentId = req.body.contentId;

    if (Utils.isEmpty(type) == false) {
        type = type.toUpperCase();
    }
    if (Utils.isEmpty(commentId) || Utils.isEmpty(contentId) || !validator.isIn(type, configStr.objectType)) {
        return res.json({ responseCode: response.UNSUCCESS, message: response.getMessage(response.INVALID_PARAM) });
    }
    let isLike = true;
    let favObj = await VnCommentLikeBase.getDetailLike(userId, commentId);
    if (favObj) {
        await VnCommentLikeBase.deleteLike(favObj.id);
        isLike = false;
    } else {
        await VnCommentLikeBase.creatCommentLike(userId, commentId, contentId, type);
        isLike = true;
    }

    await VnCommentBase.updateLikeCount(commentId, isLike);
    return res.json({
        responseCode: response.SUCCESS,
        message: response.getMessage(response.SUCCESS),
        data: {
            isLike: isLike
        }
    });
}
exports.searchSuggestion = async function (req, res) {
    let query = req.query.query;
    let limit = req.query.limit;
    let offset = req.query.offset;
    if (Utils.isEmpty(limit)) {
        limit = configStr.appSearchFirstPageLimit;
    }
    if (Utils.isEmpty(query)) {
        return res.json({ responseCode: response.UNSUCCESS, message: response.getMessage(response.INVALID_CONTENT_EMPTY) });
    }
    if (query.length > 255) {
        return res.json({ responseCode: response.UNSUCCESS, message: response.getMessage(response.INVALID_CONTENT_SEARCH) });
    }
    let searchVideos = await VnVideoSearchBase.search(query, offset, limit);

    let videoSuggestionArr = {
        name: 'Video',
        type: 'VOD',
        content: []
    };

    if (!Utils.isEmpty(searchVideos) && searchVideos.length > 0) {
        for (let i = 0; i < searchVideos.length; i++) {
            let video = searchVideos[i];
            let suggestion = {};
            suggestion.id = video['_source']['id'];
            suggestion.name = Utils.truncateWords((video['_source']['name_original']) ? video['_source']['name_original'] : video['_source']['name'], 65);
            suggestion.name_original = video['_source']['name_original'] ? video['_source']['name_original'] : video['_source']['name'];
            suggestion.play_times = video['_source']['play_times'];
            suggestion.type = 'VOD';
            suggestion.coverImage = Utils.getThumbUrl(video['_source']['bucket'], video['_source']['path'], obj.SIZE_VIDEO);
            nameNoSign = Utils.removeSignOnly(suggestion['name']);
            queryNoSign = Utils.removeSignOnly(query);
            suggestion.indexOfQuery = Utils.strpos(nameNoSign.toLowerCase(), queryNoSign.toLowerCase()) === false ? 99999 : strpos(nameNoSign.toLowerCase(), queryNoSign.toLowerCase());
            videoSuggestionArr.content = suggestion;
        }
    }
    if (!Utils.isEmpty(videoSuggestionArr) && !Utils.isEmpty(videoSuggestionArr.content) && videoSuggestionArr.content.length > 0) {
        Utils.uasort(videoSuggestionArr.content, function (a, b) {

            rs = a['indexOfQuery'] - b['indexOfQuery'];

            rs += b['play_times'] - a['play_times'];
            return rs;
        });
    }
    videoSuggestionArr.content = Utils.array_values(videoSuggestionArr.content);
    let channels = await VnUserSearchBase.search(query, offset, limit);

    let channelSuggestionArr = {
        name: 'Kênh',
        type: 'CHANNEL',
        content: []
    };

    if (!Utils.isEmpty(channels) && channels.length > 0) {
        for (let i = 0; i < channels.length; i++) {
            let video = channels[i];
            suggestion = {};
            suggestion.id = channel['_source']['id'];

            if (channel['_source']['full_name']) {
                suggestion.name = channel['_source']['full_name'];
            } else {
                suggestion.name = (channel['_source']['name_original']) ? channel['_source']['name_original'] : channel['_source']['name'];
            }

            suggestion.video_count = channel['_source']['video_count'];
            suggestion.follow_count = channel['_source']['follow_count'];
            suggestion.num_video = channel['_source']['video_count'];
            suggestion.num_follow = channel['_source']['follow_count'];

            suggestion.coverImage = VnHelper.getThumbUrl(channel['_source']['bucket'], channel['_source']['path'], obj.SIZE_VIDEO);
            suggestion.type = 'CHANNEL';
            channelSuggestionArr.content = suggestion;
        }
    }
    let responseObj = {
        responseCode: response.SUCCESS,
        message: await response.getMessage(response.SUCCESS),
        data: [
            videoSuggestionArr,
            channelSuggestionArr
        ]

    };
    return ReS(res, responseObj, 200);
}
exports.postComment = async function (req, res) {
    //todo
    let user = initUser.auth(req);
    if (user.responseCode != response.SUCCESS) {
        return res.json({ responseCode: user.responseCode, message: user.message });
    }
    let msisdn = (Utils.isEmpty(user.data)) ? user.data.msisdn : 0;
    let userId = (Utils.isEmpty(user.data)) ? user.data.userId : '';
    if (!Utils.isValidMsisdn(msisdn) || Utils.isEmpty(userId)) {
        return { responseCode: response.FORBIDDEN, message: response.getMessage(response.FORBIDDEN) };
    }

    let type = req.body.type;
    let commentId = req.body.commentId;
    let contentId = req.body.contentId;
    let parentId = req.body.parent_id;
    let comment = req.body.comment;

    if (Utils.isEmpty(type) == false) {
        type = type.toUpperCase();
    }
    if (Utils.isEmpty(comment) || !validator.isIn(type, configStr.objectType)) {
        return res.json({ responseCode: response.UNSUCCESS, message: response.getMessage(response.INVALID_DATA) });
    }

    if (comment.length < configStr.commentMinlength || comment.length > configStr.commentMaxlength) {
        let p = {
            "MIN%": configStr.commentMinlength,
            "MAX%": configStr.commentMaxlength
        };
        let msg = Utils.replaceBulk(response.getMessage(response.INVALID_LENGTH), Utils.array_keys(p), Utils.array_values(p));
        return res.json({ responseCode: response.UNSUCCESS, message: msg });

    }
    if (Utils.isEmpty(commentId) || !validator.isNumeric(contentId) || Utils.isEmpty(type) || Utils.isEmpty(parentId) || !validator.isNumeric(parentId)) {
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
    if (Utils.isEmpty(content)) {
        return res.json({ responseCode: response.NOT_FOUND, message: response.getMessage(response.INVALID_CONTENT_COMMENT) });
    }
    let vnComment = await VnCommentBase.creatComment(userId, commentId, contentId, type, content, content);
    let vnUser = await VnUserBase.getUserById(userId);
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
            created_at_format: Utils.timeElapsedString(vnComment.created_at),
            is_like: false

        }
    });
}
exports.getListComment = async function (req, res) {
    //todo
    let user = initUser.auth(req);
    let userId = (user.responseCode == response.SUCCESS && Utils.isEmpty(user.data)) ? user.data.userId : 0;
    let type = req.query.type;
    let contentId = req.query.content_id;
    let limit = req.query.limit;


    if (Utils.isEmpty(limit)) {
        limit = configStr.commentLimit;
    }

    let offset = req.query.offset;
    let commentId = req.query.comment_id;

    if (Utils.isEmpty(type) == false) {
        type = type.toUpperCase();
    }
    if (Utils.isEmpty(type) || Utils.isEmpty(contentId) || !validator.isIn(type, configStr.objectType)) {
        return res.json({ responseCode: response.UNSUCCESS, message: response.getMessage(response.INVALID_DATA) });
    }
    let parentComments = [];
    let isLikesArr = [];
    if (!Utils.isEmpty(commentId)) {
        let contents = await VnCommentBase.getByContentId(userId, type, contentId, limit, offset, commentId);

        if (!Utils.isEmpty(userId)) {
            isLikesArr = await VnCommentLikeBase.getLikeIdWithUserId(userId, contentId);
        }
        let comments = CommentObj.serialize(contents, isLikesArr);
        parentComments = comments.content;
    } else {
        let contents = await VnCommentBase.getByContentId(userId, type, contentId, parseInt(limit), parseInt(offset), null);
        if (!Utils.isEmpty(userId)) {
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
    let user = initUser.auth(req);
    // if (user.responseCode != response.SUCCESS) {
    //     return res.json({ responseCode: user.responseCode, message: user.message });
    // }
    let msisdn = (user.responseCode == response.SUCCESS && Utils.isEmpty(user.data)) ? user.data.msisdn : 0;
    let userId = (user.responseCode == response.SUCCESS && Utils.isEmpty(user.data)) ? user.data.userId : 0;;
    // if (!Utils.isValidMsisdn(msisdn) || Utils.isEmpty(userId)) {
    //     return { responseCode: response.FORBIDDEN, message: response.getMessage(response.FORBIDDEN) };
    // }
    //todo
    let appId = req.headers['app_id'];
    switch (id.toLowerCase()) {
        case obj.VIDEO_HOT_2.toLowerCase():
            if (Utils.isEmpty(offset)) {
                limitN = configStr.videoLimitNboxHome;

                //home_video_v2
                contents = await VideoObj.serialize(
                    obj.VIDEO_HOT, await VnVideoBase.getVideoHomePage(limitN, true), true, obj.getMessage(obj.NEWSFEED), obj.NEWSFEED
                );

            } else {
                let idsPage1 = Utils.isEmpty(redisService.getKey("VIDEO_HOMEPAGE_IDS", redis.dbCache)) ? [] : redisService.getKey("VIDEO_HOMEPAGE_IDS", redis.dbCache).split(",");
                contents = await VideoObj.serialize(
                    obj.VIDEO_HOT, await VnVideoBase.getHotVideoWithOutIds(idsPage1, limit, offset), true
                );
            }
            break;
        case obj.VIDEO_HOT.toLowerCase():
            let idsPage1 = Utils.isEmpty(redisService.getKey("VIDEO_HOMEPAGE_IDS", redis.dbCache)) ? [] : redisService.getKey("VIDEO_HOMEPAGE_IDS", redis.dbCache).split(",");
            contents = await VideoObj.serialize(
                obj.VIDEO_HOT, await VnVideoBase.getHotVideoWithOutIds(idsPage1, limit, offset), true
            );
            // let ids = await VnVideoBase.getVideoHomePage(configStr.videoLimitNboxHome, true);
            // // //home_video_v2
            // contents = await VideoObj.serialize(
            //     obj.HOME_VIDEO_V2, await VnVideoBase.getAllVideo(ids), true, false, obj.NEWSFEED, appId
            // );
            break;
        case obj.VIDEO_HOME.toLowerCase():
            let histories = [];
            let categoryIds = [];
            if (userId > 0) {
                let cacheIds = redisService.getKey("category_list_watch_" + userId, redis.dbCache);
                cacheIds = Utils.explode(",", cacheIds);
                categoryIds = Utils.array_filter(cacheIds);
                // histories = VnHistoryViewBase.getByUser(userId, msisdn, 200, 0, VnHistoryViewBase.TYPE_VOD);
            }

            if (categoryIds.length < configStr.categoryHotLimit) {
                let categories = VnGroupCategoryBase.getAllHotCategories(configStr.categoryHotLimit - categoryIds.length, categoryIds);
                let categoryIds = Utils.array_merge(categoryIds, Utils.arrayColumn(categories, 'id'));
            }
            let videoIds = [];
            if (offset == 0) {
                let videoHotLimit = configStr.videoHotRandomlimit;
                videoIds = Utils.arrayColumn(VnVideoHotBase.getByCategoryIds(categoryIds, videoHotLimit, offset), 'video_id');
                videoIds = Utils.array_diff(videoIds, histories);
            } else {
                let videoHotOffset = offset + (configStr.videoHotRandomlimit - limit);
                videoIds = Utils.arrayColumn(VnVideoHotBase.getByCategoryIds(categoryIds, limit, videoHotOffset), 'video_id');
            }
            contents = await VideoObj.serialize(
                obj.VIDEO_HOME, VnVideoBase.getByIdsQuery(null, videoIds, limit), false
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
            userId = 13;
            contents = VideoObj.serialize(
                obj.VIDEO_OWNER, await VnVideoBase.getAllVideosByUser('', userId, limit, offset, vnVideoEnum.TYPE_VOD), false, obj.getName(obj.VIDEO_OWNER)
            );
            break;
        case obj.VIDEO_WATCH_LATER.toLowerCase():
            //todo
            userId = 13;

            break;
        case obj.VIDEO_HISTORY.toLowerCase():
            //todo
            userId = 13;

            break;
        case obj.VIDEO_CHANNEL_FOLLOW.toLowerCase():
            //todo
            userId = 13;

            break;
        case obj.LIST_CHANNEL_FOLLOW.toLowerCase():
            //todo
            userId = 13;
            contents = ChannelObj.serialize(
                Obj.CHANNEL_FOLLOW, VnUserFollowBase.getChannelFollowQuery(userId, limit, offset), limit
            );
            break;
        case obj.LIST_CHANNEL_FOLLOW_WITH_HOT.toLowerCase():
            //todo
            userId = 13;

            break;
        case obj.LIST_HOT_CHANNEL.toLowerCase():
            //todo
            userId = 13;

            break;
        case obj.MY_PLAYLIST.toLowerCase():
            //todo
            userId = 13;

            break;
        case obj.HISTORY_SEARCH.toLowerCase():
            //todo
            userId = 13;

            break;
        case obj.CATEGORY_PARENT.toLowerCase():
            //todo
            userId = 13;

            break;
        default:
            if (Utils.strpos(id.toLowerCase(), obj.RELATED_OF_VIDEO) === 0) {

            } else if (Utils.strpos(id.toLowerCase(), obj.VIDEO_OF_PLAYLIST) === 0) {

            } else if (Utils.strpos(id.toLowerCase(), obj.VIDEO_USER_LIKE) === 0) {

            } else if (Utils.strpos(id.toLowerCase(), obj.VIDEO_MOST_VIEW_OF_CHANNEL) === 0) {

            } else if (Utils.strpos(id.toLowerCase(), obj.VIDEO_NEW_OF_CHANNEL) === 0) {

            } else if (Utils.strpos(id.toLowerCase(), obj.VIDEO_NEWEST_CHANNEL) === 0) {
                let itemId = Utils.str_replace(obj.VIDEO_NEWEST_CHANNEL, '', id);
                let user = VnUserBase.getActiveUserById(itemId);
                if (Utils.isEmpty(user)) {
                    return "INVALID";
                }
                contents = VideoObj.serialize(
                    id, VnVideoBase.getVideosByChannel(itemId, limit, offset, 'NEW'), false, user.full_name
                );

            } else if (Utils.strpos(id.toLowerCase(), obj.PLAYLIST_PUBLIC_OF_USER) === 0) {
                let userId = Utils.str_replace(obj.PLAYLIST_PUBLIC_OF_USER, '', id);
                let isForSmartTv = req.query.is_for_smart_tv.trim();

                if (isForSmartTv) {
                    contents = await UserPlaylistVideoObj.serialize(
                        id, await VnUserPlaylistItemBase.getPlaylistByUserQuery(userId, limit, offset), true, false
                    );
                } else {
                    contents = await UserPlaylistObj.serialize(
                        id, await VnUserPlaylistItemBase.getPlaylistByUserQuery(userId, limit, offset), true, false
                    );
                }
            } else if (Utils.strpos(id.toLowerCase(), obj.CATEGORY_CHILD) === 0) {
                let id = Utils.str_replace(obj.CATEGORY_CHILD + "_", '', id);

                let categorys = CategoryObj.serialize(
                    obj.CATEGORY_PARENT, await VnGroupCategoryBase.getChilds(id, offset, limit), true
                );
                let tmpContent = [];
                let loop = configStr.categoryLoadMoreLimit;
                if (categorys.content.length > 0) {
                    for (let index = 0; index < categorys.content.length; index++) {
                        const element = categorys.content[index];
                        id = element.id;
                        name = element.name;
                        let tmpBox = await VideoObj.serialize(
                            obj.CATEGORY_CHILD + '_' + id, VnVideoBase.getVideoByCategory(id, null, 0, loop), false, name
                        );
                        tmpContent.push(tmpBox);
                    }

                }
                contents.content = tmpContent;

            } else if (Utils.strpos(id.toLowerCase(), obj.CATEGORY_CHILD_VIDEO) === 0) {

                let contentId = Utils.str_replace(obj.CATEGORY_CHILD_VIDEO + "_", '', id);
                // lay video theo chuyen muc
                let group = await VnGroupCategoryBase.getCategoryGroup(contentId);
                if (group.length == 0) {
                    return "INVALID";
                }

                let name = group.name;
                contents = await VideoObj.serialize(
                    id, await VnVideoBase.getVideoByCategory(contentId, null, 0, limit), false, name);

            } else if (Utils.strpos(id.toLowerCase(), obj.VIDEO_MOST_TRENDING_CATE) === 0) {
                let itemId = Utils.str_replace(obj.VIDEO_MOST_TRENDING_CATE + "_", '', id);
                contents = await VideoObj.serialize(
                    id, await VnVideoBase.getVideosByCate(itemId, limit, offset, 'MOSTTRENDING'), false, obj.getName(obj.VIDEO_MOST_TRENDING_CATE)
                );
            } else if (Utils.strpos(id.toLowerCase(), obj.VIDEO_MOST_VIEW_CATE) === 0) {

                let itemId = Utils.str_replace(obj.VIDEO_MOST_VIEW_CATE + "_", '', id);
                contents = await VideoObj.serialize(
                    id, await VnVideoBase.getVideosByCate(itemId, limit, offset, 'MOSTVIEW'), false, obj.getName(obj.VIDEO_MOST_VIEW_CATE)
                );

            } else if (Utils.strpos(id.toLowerCase(), obj.VIDEO_NEW_CATE) === 0) {
                let itemId = Utils.str_replace(obj.VIDEO_NEW_CATE + "_", '', id);
                contents = await VideoObj.serialize(
                    id, await VnVideoBase.getVideosByCate(itemId, limit, offset, 'NEW'), false, obj.getName(obj.VIDEO_NEW_CATE)
                );
            } else if (Utils.strpos(id.toLowerCase(), obj.VIDEO_OF_CATEGORY) === 0) {
                let itemId = Utils.str_replace(obj.VIDEO_OF_CATEGORY + "_", '', id);
                if (!validator.isNumeric(itemId)) {
                    return "INVALID";
                }
                let objCategory = await VnGroupCategoryBase.getActiveById(itemId);
                let childOfCategory = redisService.getKey("CATEGORY_CHILD_" + itemId, redis.dbCache);
                if (Utils.isEmpty(childOfCategory)) {

                    let childs = await VnGroupCategoryBase.getChilds(itemId);
                    if (!Utils.isEmpty(childs)) {
                        childs.forEach(element => {
                            childOfCategory.push(element.id);
                        });
                        let value = Utils.implode(",", childOfCategory);
                        redisService.setKey("CATEGORY_CHILD_" + itemId, value, redis.CACHE_1HOUR, redis.cache);
                    }
                } else {
                    childOfCategory = Utils.explode(",", childOfCategory);
                }
                if (!Utils.isEmpty(childOfCategory)) {
                    contents = await VideoObj.serialize(
                        id, await VnVideoBase.getVideosByCate(childOfCategory.push(itemId), limit, offset, 'NEW', false), true, Utils.truncateWords(objCategory.name, 27)
                    );
                } else {
                    contents = await VideoObj.serialize(
                        id, await VnVideoBase.getVideosByCate(itemId, limit, offset, 'NEW', false), true, Utils.truncateWords(objCategory.name, 27)
                    );
                }

            }



    }

    let responseObj = {
        responseCode: response.SUCCESS,
        message: await response.getMessage(response.SUCCESS),
        data: contents

    };
    return ReS(res, responseObj, 200);
}
exports.search = async function (req, res) {
    let query = req.query.query;
    let limit = req.query.limit;
    let offset = req.query.offset;
    if (Utils.isEmpty(limit)) {
        limit = configStr.appSearchFirstPageLimit;
    }

    loadLimit = 200;
    loadOffset = 0;
    if (Utils.isEmpty(query) || query.length > 255) {
        return res.json({ responseCode: response.UNSUCCESS, message: response.getMessage(response.INVALID_CONTENT_SEARCH) });
    }

    let searchVideos = VnVideoSearchBase.search(query, loadOffset, loadLimit);
    let videoArr = [];
    if (!Utils.isEmpty(searchVideos) && searchVideos.length > 0) {
        for (let i = 0; i < searchVideos.length; i++) {
            let video = searchVideos[i];
            let suggestion = {};
            suggestion.id = video['_source']['id'];
            suggestion.name = Utils.truncateWords((video['_source']['name_original']) ? video['_source']['name_original'] : video['_source']['name'], 65);
            suggestion.play_times = video['_source']['play_times'];
            nameNoSign = Utils.removeSignOnly(suggestion['name']);
            queryNoSign = Utils.removeSignOnly(query);
            suggestion.indexOfQuery = Utils.strpos(nameNoSign.toLowerCase(), queryNoSign.toLowerCase()) === false ? 99999 : strpos(nameNoSign.toLowerCase(), queryNoSign.toLowerCase());
            videoArr.push(suggestion);
        }
    }
    if (!Utils.isEmpty(videoArr) && !Utils.isEmpty(videoArr.content) && videoArr.content.length > 0) {
        Utils.uasort(videoArr, function (a, b) {

            rs = a['indexOfQuery'] - b['indexOfQuery'];

            rs += b['play_times'] - a['play_times'];
            return rs;
        });
    }
    let dataResponse = [];

    let videoIds = Utils.arrayColumn(videoArr, 'id');



    searchUsers = VnUserSearchBase.search(query, loadOffset, loadLimit);
    let userIds = Utils.arrayColumn(searchUsers, '_id');
    if (userIds.length > 0) {
        userIds = Utils.array_slice(userIds, offset, limit);
    }
    if (!Utils.isEmpty(videoIds)) {
        let videos = VideoObj.serialize(obj.VIDEO_SEARCH, VnVideoBase.getVideosByIdsQuery(videoIds, limit));
        if (Utils.isset(videos)) {
            dataResponse.push(videos);
        }
    }
    if (!Utils.isEmpty(userIds)) {
        let channels = ChannelObj.serialize(
            obj.CHANNEL_SEARCH, await VnUserBase.getByIdsQuery(userIds, limit)
        );
        if (Utils.isset(channels)) {
            dataResponse.push(channels);
        }
    }



    let responseObj = {
        responseCode: response.SUCCESS,
        message: await response.getMessage(response.SUCCESS),
        data: dataResponse

    };
    return ReS(res, responseObj, 200);
}
exports.feedBack = async function (req, res) {
    let user = initUser.auth(req);
    if (user.responseCode != response.SUCCESS) {
        return res.json({ responseCode: user.responseCode, message: user.message });
    }
    let msisdn = (Utils.isEmpty(user.data)) ? user.data.msisdn : 0;
    let userId = (Utils.isEmpty(user.data)) ? user.data.userId : '';
    if (!Utils.isValidMsisdn(msisdn) || Utils.isEmpty(userId)) {
        return { responseCode: response.FORBIDDEN, message: response.getMessage(response.FORBIDDEN) };
    }
    let id = req.body.id;
    let content = req.body.content;
    let itemId = req.body.item_id;
    let type = req.body.type;

    type = Utils.isset(type) ? type.trim() : type;
    if (Utils.isEmpty(type) || !Utils.in_array(type, configStr.objectType) || Utils.isEmpty(id) || Utils.isEmpty(content) || !Utils.in_array(id, Utils.arrayColumn(params.settingFeedback, 'id'))) {
        return res.json({ responseCode: response.UNSUCCESS, message: response.getMessage(response.INVALID_DATA) });
    }
    if (content.length < configStr.commentMinlength || content.length > configStr.commentMaxlength) {
        let p = {
            "MIN%": configStr.commentMinlength,
            "MAX%": configStr.commentMaxlength
        };
        let msg = Utils.replaceBulk(response.getMessage(response.INVALID_CONTENT_FEEDBACK), Utils.array_keys(p), Utils.array_values(p));
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
    let dataResponse = [];
    let limitN = configStr.videoLimitNboxHome;
    //Lay danh sach video moi
    let ids = await VnVideoBase.getVideoHomePage(limitN, true);
    // //home_video_v2
    videoBox = await VideoObj.serialize(
        obj.HOME_VIDEO_V2, await VnVideoBase.getAllVideo(ids), true, false, obj.NEWSFEED, appId
    );
    if (Utils.isset(videoBox.content) && videoBox.content) {
        dataResponse.push(videoBox);
    }

    let newVideo = await VideoObj.serialize(
        obj.VIDEO_NEW, VnVideoBase.getNewVideo('', configStr.appHomeLimit), true, false
    );
    if (Utils.isset(newVideo.content) && newVideo.content) {
        dataResponse.push(newVideo);
    }
    //todo history
    let limitHotChannel = configStr.appHomeHotchannellimit;

    if (Utils.isEmpty(limitHotChannel)) {
        limitHotChannel = 5;
    }
    let user = initUser.auth(req);
    let userId = (user.responseCode == response.SUCCESS && Utils.isEmpty(user.data)) ? user.data.userId : 0; //todo msisdn
    let msisdn = (user.responseCode == response.SUCCESS && Utils.isEmpty(user.data)) ? user.data.msisdn : 0; //todo msisdn
    var appId = req.headers['app_id'];

    // Danh sach video theo kenh
    let arrChannel = [];
    if (userId > 0) {

        let listHotChannel = VnUserBase.getHotUser(limitHotChannel);
        for (let index = 0; index < listHotChannel.length; index++) {
            arrChannel.push(listHotChannel[index]);

        }
    } else {
        let channelFollows = VnUserFollowBase.getChannelFollowQuery(userId, limitHotChannel);
        let arrChannelId = [];
        for (let index = 0; index < channelFollows.length; index++) {
            let channel = channelFollows[index];
            arrChannel.push(channel);
            arrChannelId.push(channel.id);
        }

        if (channelFollows.length < limitHotChannel) {
            let listHotChannel = VnUserBase.getHotUser(limitHotChannel);

            arrChannel = Utils.mergeById(arrChannel, listHotChannel, 'id', limitHotChannel);
        }
    }

    if (arrChannel.length > 0) {
        let alreadyAdd = [];
        // Voi moi kenh lay duoc, hien thi danh sach video moi nhat
        for (let i = 0; i < arrChannel.length; i++) {
            if (!Utils.in_array(arrChannel[i]['id'], alreadyAdd)) {
                alreadyAdd.push(arrChannel[i]['id']);
                let newestVideos = await VideoObj.serialize(
                    obj.VIDEO_NEWEST_CHANNEL + arrChannel[i]['id'], VnVideoBase.getVideosByChannel(arrChannel[i]['id'], configStr.appHomeLimit, 0, 'NEW'), false, arrChannel[i]['full_name']
                );

                if (Utils.isset(newestVideos['content']) && newestVideos['content']) {
                    dataResponse.push(newestVideos);
                }
            }
        }
    }
    //Lay anh banner
    let bannerArr = VnSlideshowBase.getSlideShowByLocation("HOME", configStr.slideshowHomeLimit);

    let bannerList = [];

    if (!Utils.isEmpty(bannerArr)) {
        for (let index = 0; index < bannerArr.length; index++) {
            const banner = bannerArr[index];
            bannerArr.push(
                {
                    image: VnHelper.getThumbUrl(banner.bucket, banner.path),
                    link: banner.href,
                    type: banner.type,
                    item_id: banner.item_id
                }

            );
        }


    }
    let responseObj = {
        responseCode: response.SUCCESS,
        message: await response.getMessage(response.SUCCESS),
        data: dataResponse,
        popup: VnFlow.loadPromotionPopup(msisdn),
        banner: bannerList

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


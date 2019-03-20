const ResponseCode = require('../services/ResponseCode');
const Obj = require('../services/Obj');
const UserFollowObj = require('../services/UserFollowObj');
const vnVideoService = require('../services/vnVideo.service');
const redisService = require('../services/redis.service');
const {to, ReE, ReS} = require('../services/util.service');
const VnVideoModel = require('../models/vnVideo.model');
const VideoObj = require('../services/VideoObj');
const VnFolow = require('../services/vnFolow');

const validator = require('validator');
const redis = require('../config/redis');
const params = require('../config/params');
const VnFavouriteVideoModel = require('../models/vnFavouriteVideo.model');


const listDb = redis.listDb;
const listKey = redis.listKey;

function getUserLogin() {
    return {user_id: '1', user_phone: '84354926551'};
}


validToggleWatchlate = function (body) {
    if (typeof body.id === 'undefined') {
        return ({responseCode: ResponseCode.UNSUCCESS, message: 'ID không hợp lệ',});
    } else {
        let status = (typeof body.status === 'undefined') ? '-1' : (body.status.trim());
        if (!validator.isIn(status, [0, 1])) {
            return ({responseCode: ResponseCode.UNSUCCESS, message: 'Trạng thái không hợp lệ',});
        } else {
            return true;
        }
    }
}

const actionToggleWatchLater = async function (req, res) {
    const body = req.body;

    let {user_id} = getUserLogin();
    let config = params.configStr;
    if (!user_id) {
        return ReE(res, config.errAuth, 201);
    }

    let id = parseInt(body.id.trim());
    let status = parseInt(body.status.trim());
    let validInput = validToggleWatchlate(body);
    if (validInput !== true) {
        return ReE(res, validInput, 201);
    }

    let [err, video] = await to(VnVideoModel.getDetail(id));
    if (err || video == null) return ReE(res, {
        responseCode: ResponseCode.NOT_FOUND,
        message: 'Video không tồn tại.'
    }, 422);

    let dbRedis = listDb.config;

    let keyRedis = listKey.video_list_watch_later.replace('[userId]', userId);
    let videoStr = await redisService.getKey(keyRedis, dbRedis);
    //Lay danh sach video trong danh sach xem sau

    let arrVideo = videoStr.split(',');
    let isWatchLater = false;
    if (status == 0) {
        //Neu videoId da co trong danh sach thi xoa item i
        isWatchLater = false;
        arrVideo = arrVideo.filter(x => ![id].includes(x));
        redisService.setKey(keyRedis, arrVideo.join(','), false, dbRedis);
    }
    elseif($status == 1)
    {
        //Neu chua co thi them vao
        isWatchLater = true;
        if (videoStr) {

            arrVideo = arrVideo.filter(x => ![id].includes(x));
            if (arrVideo.length >= 100) {
                arrVideo.splice(arrVideo.length - 1, 1);
            }

            videoStr = arrVideo.join(',');
            redisService.setKey(keyRedis, id + ',' + videoStr, false, dbRedis);
        } else {
            redisService.setKey(keyRedis, id, false, dbRedis);
        }
    }
    let responseObj = {
        responseCode: ResponseCode.SUCCESS,
        message: ResponseCode.getMessage(ResponseCode.SUCCESS),
        data: {isWatchLater: isWatchLater}
    }
    return ReS(res, responseObj, 200);
}
module.exports.actionToggleWatchLater = actionToggleWatchLater;

actionGetFriendsVideo = async function (req, res) {
    const body = req.body;
    let filterType = (typeof body.filter_type === 'undefined') ? '' : body.filter_type.trim();
    let {user_id} = getUserLogin();

    let boxUserFollow = [];
    switch (filterType.toUpperCase()) {
        case "VIDEO":
            boxUserFollow = await UserFollowObj.serialize(
                Obj.USER_FOLLOW_VIDEO,
                {userId: user_id, limit: 4, offset: 0}
            );
            break;
        case "MUSIC":
            boxUserFollow = await UserFollowObj.serialize(
                Obj.USER_FOLLOW_MUSIC,
                {userId: user_id, limit: 4, offset: 0}
            );
            break;
        default:
            boxUserFollow = await UserFollowObj.serialize(
                Obj.USER_FOLLOW,
                {userId: user_id, limit: 4, offset: 0}
            );
            break;
    }


    res.json({
        responseCode: ResponseCode.SUCCESS,
        message: ResponseCode.getMessage(ResponseCode.SUCCESS),
        data: boxUserFollow
    });
}

module.exports.actionGetFriendsVideo = actionGetFriendsVideo;

actionGetNewVideo = async function (req, res) {
    const body = req.body;
    let content = await VnVideoModel.getNewVideo('', params.app_page_limit);
    let newVideo = await VideoObj.serialize(Obj.VIDEO_NEW, content, true);
    let dataResponse = [];
    if (typeof newVideo.content !== 'undefined' && newVideo.content) {
        dataResponse.push(newVideo);
    }

    let arrReturn = {
        responseCode: ResponseCode.SUCCESS,
        message: ResponseCode.getMessage(ResponseCode.SUCCESS),
        data: dataResponse
    };
    res.json(arrReturn);
}

module.exports.actionGetNewVideo = actionGetNewVideo;


const msisdn = "84386252255";
const userId = "123";
const authJson = 1;
const supportType = 1;
const distributionId = 1;
const needHiddenFreemiumContent = 1;
actionGetVideoStream = async function (req, res) {
    const body = req.body;
    let id = body.id;
    let profileId = body.profileId;
    // if (!$profileId) {
    //     $profileId = trim(Yii::$app->request->get('profile_id', Yii::$app->params['streaming.vodProfileId']));
    // }
    // $playlistId = trim(Yii::$app->request->get('playlist_id', false));
    let playlistId = body.playlistId;
    let acceptLossData = body.accept_loss_data

    // if (!isset($acceptLossData)) {
    //     $acceptLossData = Yii::$app->request->get("accept_loss_data", 0);
    // }

    let objVideo = await vnVideoService.getDetail(id); //VtVideoBase::getDetail($id);

    if (objVideo) {
        let streamingObj = VnFolow.viewVideo(msisdn, objVideo, playlistId, profileId, userId, authJson, supportType, acceptLossData, null, distributionId);
        //An noi dung tinh phi khi duyet APP iOS
        if (needHiddenFreemiumContent) {
            if (streamingObj.hasOwnProperty("popup")) {
                streamingObj.popup = [];
            }
        }
        res.json({
            responseCode: ResponseCode.SUCCESS,
            message: ResponseCode.getMessage(ResponseCode.SUCCESS),
            data: {
                streams: streamingObj,
            }
        });
    } else {
        res.json({
            responseCode: ResponseCode.NOT_FOUND,
            message: ResponseCode.getMessage(ResponseCode.NOT_FOUND)
        });
    }

    res.json({
        responseCode: ResponseCode.NOT_FOUND,
        message: ResponseCode.getMessage(ResponseCode.NOT_FOUND)
    });
}

module.exports.actionGetVideoStream = actionGetVideoStream;

actionToggleLikeVideo = async function (req, res) {
    const body = req.body;
    // if (!$this->isValidUser()) {
    //         return $this->authJson;
    //     }

    let id = body.id;
    let status = (typeof body.status === 'undefined') ? body.status : "0";
    if (validator.isIn(status, params.status_actionToggleLikeVideo)) {
        res.json({
            responseCode: ResponseCode.UNSUCCESS,
            message: 'Trạng thái không hợp lệ',
        });
    } else {

        let video = await vnVideoService.getDetail(id);

        if (video == false) {
            res.json({
                responseCode: ResponseCode.NOT_FOUND,
                message: ResponseCode.getMessage(ResponseCode.NOT_FOUND),
            });
        } else {
            let favObj = await VnFavouriteVideoModel.getFavourite(userId, id);
            let lastStatus = (favObj) ? favObj.status : 0;

            if (favObj) {
                if (status == params.VnFavouriteVideoBase_STATUS_REMOVE) {
                    await VnFavouriteVideoModel.deleteById(id);
                    let isLike = false;

                } else if (lastStatus != status) {
                    //$favObj->status = $status;
                    //$favObj->save();
                    await VnFavouriteVideoModel.updateItem({status: status}, {video_id: id, user_id: userId});

                    //Dat log user dislike
                    if (status == params.VnFavouriteVideoBase_STATUS_DISLIKE) {
                        // MongoDBModel::insertEvent(MongoDBModel::DISLIKE, $id, $this->userId, $this->msisdn, "", $video["created_by"]);
                    } else {
                        // MongoDBModel::insertEvent(MongoDBModel::LIKE, $id, $this->userId, $this->msisdn, "", $video["created_by"]);
                    }
                }
            } else if (validator.isIn(status, params.status_actionToggleLikeVideo)) {
                // $favObj = new VtFavouriteVideoBase();
                // $favObj->insertFavourite($this->userId, $id, $status);
                await VnFavouriteVideoModel.updateItem({status: status}, {video_id: id, user_id: userId});

                if ($status == params.VnFavouriteVideoBase_STATUS_DISLIKE) {
                    // MongoDBModel::insertEvent(MongoDBModel::DISLIKE, $id, $this->userId, $this->msisdn, "", $video["created_by"]);
                } else {
                    // MongoDBModel::insertEvent(MongoDBModel::LIKE, $id, $this->userId, $this->msisdn, "", $video["created_by"]);
                }
                //Dat log user like

            }

            if (lastStatus == params.VnFavouriteVideoBase_STATUS_DISLIKE && status == params.VnFavouriteVideoBase_STATUS_LIKE) {
                VnVideoModel.updateLikeVsDisLikeCount(id, 1, -1);
                // VtVideoBase::updateLikeVsDisLikeCount($id, 1, -1);
            } else if (lastStatus == 0 && status == params.VnFavouriteVideoBase_STATUS_LIKE) {
                // VtVideoBase::updateLikeVsDisLikeCount($id, 1, 0);
                VnVideoModel.updateLikeVsDisLikeCount(id, 1, 0);
            } else if (lastStatus == params.VnFavouriteVideoBase_STATUS_LIKE && status == params.VnFavouriteVideoBase_STATUS_DISLIKE) {
                // VtVideoBase::updateLikeVsDisLikeCount($id, -1, 1);
                VnVideoModel.updateLikeVsDisLikeCount(id, -1, 1);
            } else if (lastStatus == 0 && status == params.VnFavouriteVideoBase_STATUS_DISLIKE) {
                // VtVideoBase::updateLikeVsDisLikeCount($id, 0, 1);
                VnVideoModel.updateLikeVsDisLikeCount(id, 0, 1);
            } else if (lastStatus == params.VnFavouriteVideoBase_STATUS_LIKE && status == params.VnFavouriteVideoBase_STATUS_REMOVE) {
                // VtVideoBase::updateLikeVsDisLikeCount($id, -1, 0);
                VnVideoModel.updateLikeVsDisLikeCount(id, -1, 0);
            } else if (lastStatus == params.VnFavouriteVideoBase_STATUS_DISLIKE && status == params.VnFavouriteVideoBase_STATUS_REMOVE) {
                // VtVideoBase::updateLikeVsDisLikeCount($id, 0, -1);
                VnVideoModel.updateLikeVsDisLikeCount(id, 0, -1);
            }

            res.json({
                    responseCode: ResponseCode.SUCCESS,
                    message: ResponseCode.getMessage(ResponseCode.SUCCESS),
                    data: {
                        status: status
                    }
                }
            );
        }
    }
}
module.exports.actionToggleLikeVideo = actionToggleLikeVideo;


actionRelatedVideoBox = async function (req, res) {
    const body = req.body;
    let id = (typeof body.id === 'undefined') ? body.id : "0";
    let channelId = (typeof body.channel_id === 'undefined') ? body.channel_id : "0";
    let channelName = (typeof body.channel_name === 'undefined') ? body.channel_name : "";
    let videoName = (typeof body.video_name === 'undefined') ? body.video_name : "";
    let tagName = (typeof body.tag_name === 'undefined') ? body.tag_name : "";
    let categoryId = (typeof body.category_id === 'undefined') ? body.category_id : "0";
    let categoryName = (typeof body.category_name === 'undefined') ? body.category_name : "";
    let categoryParentId = (typeof body.category_parent_id === 'undefined') ? body.category_parent_id : "";
    let deviceId = (typeof body.device_id === 'undefined') ? body.device_id : "";
    let limitRelated = params.app_video_relate_limit;


    let relateds = null;
    if ((deviceId) && params.recommendation_enable) {

        let videoIds = await RecommendationService.getVideoIds(params.RecommendationService_BOX_RELATED, deviceId, id, [
            channel_id
    :
        channelId,
            channel_name
    :
        channelName,
            video_name
    :
        videoName,
            tag_name
    :
        tagName,
            category_id
    :
        categoryId,
            category_name
    :
        categoryName,
            category_parent_id
    :
        categoryParentId
    ])
        ;

        let relateds = null;
        if (videoIds) {
            relateds = await VideoObj::serialize(Obj.VIDEO_RECOMMEND_RELATE, await VnVideoModel.getVideosByIdsQuery(videoIds, limitRelated));
        }

    }

    if (typeof relateds.content === 'undefined' || relateds.content.length == 0) {
        let video = await vnVideoService.getDetail(id, "", false, true);

        let relateds = await VideoObj.serialize(
            Obj.VIDEO_RELATE, await VnVideoModel.getVideoRelatedQuery(video.id, video.category_id, video.created_by, limitRelated, 0, video.published_time), false
        );
    }

    res.json({
        responseCode: ResponseCode.SUCCESS,
        message: ResponseCode.getMessage(ResponseCode.SUCCESS),
        data: relateds
    });
}
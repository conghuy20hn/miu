const ResponseCode = require('../lib/ResponseCode');
const Obj = require('../lib/Obj');
const response = require('../lib/ResponseCode');
const initUser = require('../lib/helper/initUser');
const UserFollowObj = require('../lib/UserFollowObj');
const vnVideoService = require('../services/vnVideo.service');
const redisService = require('../services/redis.service');
// const {to, ReE, ReS} = require('../services/util.service');
const { to, ReE, ReS }      = require('../services/util.service');
const VnVideoModel = require('../models/VnVideo.model');
const VideoObj = require('../lib/VideoObj');
const VnFolow = require('../lib/VnFollow');

const validator = require('validator');
const redis = require('../config/redis');
const params = require('../config/params');
const config = params.configStr;
const VnGroupCategoryModel = require('../models/VnGroupCategory.model');
const VnFavouriteVideoModel = require('../models/vnFavouriteVideo.model');
const VnUserModel = require('../models/VnUser.model');
const VnHistoryViewModel = require('../models/vnHistoryView.model');
const VnUserFollowModel = require('../models/VnUserFollow.model');
const VnUserPlaylistModel = require('../models/vnUserPlaylist.model');
const VnUserPlaylistItemModel = require('../models/VnUserPlaylistItem.model');
const Utils = require('../lib/Utils');
const vnVideoEnum = require('../services/lib/vnVideoEnum');

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
    let auth = initUser.auth(req, res);
    if (auth.responseCode != response.SUCCESS) {
        return res.json({ responseCode: auth.responseCode, message: auth.message });
    }
    const body = req.body;
    let userId = auth.data.userId;

    if (!userId) {
        return ReE(res, config.errAuth, 201);
    }

    let id = parseInt(body.id);
    let status = parseInt(body.status);
    let validInput = validToggleWatchlate(body);
    if (validInput !== true) {
        return ReE(res, validInput, 201);
    }

    let [err, video] = await to(VnVideoModel.getDetail(id));
    console.log(err, video);
    if (err || video == null) return ReE(res, {
        responseCode: ResponseCode.NOT_FOUND,
        message: 'Video không tồn tại.'
    }, 422);

    let dbRedis = listDb.config;

    let keyRedis = listKey.video_list_watch_later.replace('[userId]', userId);
    let videoStr = await redisService.getKey(keyRedis, dbRedis);
    //Lay danh sach video trong danh sach xem sau
    let arrVideo = [];

    if(!Utils.isEmpty(videoStr)){
        arrVideo = videoStr.split(',');
    }
    let isWatchLater = false;
    if (status == 0) {
        //Neu videoId da co trong danh sach thi xoa item i
        isWatchLater = false;
        arrVideo = arrVideo.filter(x => ![id].includes(x));
        redisService.setKey(keyRedis, arrVideo.join(','), false, dbRedis);
    }else if(status == 1) {
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

const PlaylistModel = require('../models/playlist.model');
actionGetFriendsVideo = async function(req, res){
    let auth = initUser.auth(req, res);
    if (auth.responseCode != response.SUCCESS) {
        return res.json({ responseCode: auth.responseCode, message: auth.message });
    }
    const body = req.body;
    let filterType = (typeof body.filter_type === 'undefined') ? '' : body.filter_type.trim();
    let user_id = auth.data.userId;

    let boxUserFollow;
    let userFollow = await (VnUserFollowModel.getFollowUser(user_id, Obj.app_page_limit, 0));
    // if (err || userFollow === false) return ReE(res, err, 422);

    switch (filterType.toUpperCase()) {
        case "VIDEO":
            boxUserFollow = await UserFollowObj.serialize(
                Obj.USER_FOLLOW_VIDEO,
                userFollow
            );
            break;
        case "MUSIC":
            boxUserFollow = await UserFollowObj.serialize(
                Obj.USER_FOLLOW_MUSIC,
                userFollow
            );
            break;
        default:
            boxUserFollow = await UserFollowObj.serialize(
                Obj.USER_FOLLOW,
                userFollow
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
    let auth = initUser.auth(req, res);
    if (auth.responseCode != response.SUCCESS) {
        return res.json({ responseCode: auth.responseCode, message: auth.message });
    }
    const body = req.body;
    // let {err, content} = await to(VnVideoModel.getNewVideo('', Obj.app_page_limit));
    // if (err || content === false) return ReE(res, err, 422);
    let query = await (VnVideoModel.getNewVideoQuery('', Obj.app_page_limit));

    let newVideo = await VideoObj.serialize(Obj.VIDEO_NEW, query, true);
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


const authJson = 1;
const supportType = 1;
const distributionId = 1;
const needHiddenFreemiumContent = 1;

actionGetVideoStream = async function (req, res) {
    let auth = initUser.auth(req, res);
    if (auth.responseCode != response.SUCCESS) {
        return res.json({ responseCode: auth.responseCode, message: auth.message });
    }
    let userId = auth.data.userId;
    let msisdn = auth.data.msisdn;

    const body = req.body;
    let id = body.id;
    let profileId = body.profileId;
    if(Utils.isEmpty(profileId)){
        profileId = Obj.streaming_vodProfileId;
    }
    let playlistId = body.playlistId;
    if(Utils.isEmpty(playlistId)) playlistId = false;
    let acceptLossData = body.accept_loss_data;
    if(Utils.isEmpty(acceptLossData)) acceptLossData = 0;

    let {err, objVideo} = await to(vnVideoService.getDetail(id));
    if (err || content === false) return ReE(res, err, 422);

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
    let auth = initUser.auth(req, res);
    if (auth.responseCode != response.SUCCESS) {
        return res.json({ responseCode: auth.responseCode, message: auth.message });
    }
    const body = req.body;
    let userId = auth.data.userId;
    let id = body.id;
    let status = (typeof body.status === 'undefined') ? body.status : "0";
    if (!Utils.in_array(body.status, config.status_actionToggleLikeVideo)) {
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
                if (status == config.VnFavouriteVideoBase_STATUS_REMOVE) {
                    await VnFavouriteVideoModel.deleteById(id);
                    let isLike = false;

                } else if (lastStatus != status) {
                    //$favObj->status = $status;
                    //$favObj->save();
                    await VnFavouriteVideoModel.updateItem({status: status}, {video_id: id, user_id: userId});

                    //Dat log user dislike
                    if (status == config.VnFavouriteVideoBase_STATUS_DISLIKE) {
                        // MongoDBModel::insertEvent(MongoDBModel::DISLIKE, $id, $this->userId, $this->msisdn, "", $video["created_by"]);
                    } else {
                        // MongoDBModel::insertEvent(MongoDBModel::LIKE, $id, $this->userId, $this->msisdn, "", $video["created_by"]);
                    }
                }
            } else if (validator.isIn(status, config.status_actionToggleLikeVideo)) {
                // $favObj = new VtFavouriteVideoBase();
                // $favObj->insertFavourite($this->userId, $id, $status);
                await VnFavouriteVideoModel.updateItem({status: status}, {video_id: id, user_id: userId});

                if (status == config.VnFavouriteVideoBase_STATUS_DISLIKE) {
                    // MongoDBModel::insertEvent(MongoDBModel::DISLIKE, $id, $this->userId, $this->msisdn, "", $video["created_by"]);
                } else {
                    // MongoDBModel::insertEvent(MongoDBModel::LIKE, $id, $this->userId, $this->msisdn, "", $video["created_by"]);
                }
                //Dat log user like

            }

            if (lastStatus == config.VnFavouriteVideoBase_STATUS_DISLIKE && status == config.VnFavouriteVideoBase_STATUS_LIKE) {
                VnVideoModel.updateLikeVsDisLikeCount(id, 1, -1);
                // VtVideoBase::updateLikeVsDisLikeCount($id, 1, -1);
            } else if (lastStatus == 0 && status == config.VnFavouriteVideoBase_STATUS_LIKE) {
                // VtVideoBase::updateLikeVsDisLikeCount($id, 1, 0);
                VnVideoModel.updateLikeVsDisLikeCount(id, 1, 0);
            } else if (lastStatus == config.VnFavouriteVideoBase_STATUS_LIKE && status == config.VnFavouriteVideoBase_STATUS_DISLIKE) {
                // VtVideoBase::updateLikeVsDisLikeCount($id, -1, 1);
                VnVideoModel.updateLikeVsDisLikeCount(id, -1, 1);
            } else if (lastStatus == 0 && status == config.VnFavouriteVideoBase_STATUS_DISLIKE) {
                // VtVideoBase::updateLikeVsDisLikeCount($id, 0, 1);
                VnVideoModel.updateLikeVsDisLikeCount(id, 0, 1);
            } else if (lastStatus == config.VnFavouriteVideoBase_STATUS_LIKE && status == config.VnFavouriteVideoBase_STATUS_REMOVE) {
                // VtVideoBase::updateLikeVsDisLikeCount($id, -1, 0);
                VnVideoModel.updateLikeVsDisLikeCount(id, -1, 0);
            } else if (lastStatus == config.VnFavouriteVideoBase_STATUS_DISLIKE && status == config.VnFavouriteVideoBase_STATUS_REMOVE) {
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


actionRelatedVideoBox = async function(req, res){
    let auth = initUser.auth(req, res);
    if (auth.responseCode != response.SUCCESS) {
        return res.json({ responseCode: auth.responseCode, message: auth.message });
    }
    const body = req.body;
    let id = (typeof body.id === 'undefined') ?  body.id : "0";
    let channelId = (typeof body.channel_id === 'undefined') ?  body.channel_id : "0";
    let channelName = (typeof body.channel_name === 'undefined') ?  body.channel_name : "";
    let videoName = (typeof body.video_name === 'undefined') ?  body.video_name : "";
    let tagName = (typeof body.tag_name === 'undefined') ?  body.tag_name : "";
    let categoryId = (typeof body.category_id === 'undefined') ?  body.category_id : "0";
    let categoryName = (typeof body.category_name === 'undefined') ?  body.category_name : "";
    let categoryParentId = (typeof body.category_parent_id === 'undefined') ?  body.category_parent_id : "";
    let deviceId = (typeof body.device_id === 'undefined') ?  body.device_id : "";
    let limitRelated = params.app_video_relate_limit;


        let relateds = null;
        if ((deviceId) && params.recommendation_enable) {

        let videoIds = await RecommendationService.getVideoIds(config.RecommendationService_BOX_RELATED, deviceId, id, {
            channel_id:  channelId,
            channel_name:  channelName,
            video_name:  videoName,
            tag_name:  tagName,
            category_id:  categoryId,
            category_name:  categoryName,
            category_parent_id:  categoryParentId
            });

        let relateds ;
        if (videoIds) {
            relateds = await VideoObj.serialize(Obj.VIDEO_RECOMMEND_RELATE, await VnVideoModel.getVideosByIdsQuery(videoIds, limitRelated));
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
module.exports.actionRelatedVideoBox = actionRelatedVideoBox;

actionGetDetail = async function(req, res)
{
    let auth = initUser.auth(req, res);
    let userId = false;
    let msisdn = false;
    if (auth.responseCode === response.SUCCESS) {
        userId = auth.data.userId;
        msisdn = auth.data.msisdn;
    }


    const body = req.body;
    let id = body.id;
    let playlistId = Utils.isset(body.playlist_id) ? body.playlist_id : false;
    let playlistType = Utils.isset(body.playlist_type) ? body.playlist_type : 'ADMIN';
    let isShowPopup = Utils.isset(body.popup) ? body.popup : 0;
    let networkDeviceId = Utils.isset(body.network_device_id) ? body.network_device_id : '';
    let deviceType= Utils.isset(body.device_type) ? body.device_type : '';
    let appId= Utils.isset(body.app_id) ? body.app_id : '';


    let currentTime = 0;

    // let profileId = false;
    // if (!profileId) {
    let profileId= Utils.isset(body.profile_id) ? body.profile_id : config.streaming_vodProfileId;
    let acceptLossData= Utils.isset(body.accept_loss_data) ? body.accept_loss_data : 0;
    // }

    // if (!isset($acceptLossData)) {
    //     $acceptLossData = Yii::$app->request->get("accept_loss_data", 0);
    // }

    let videoOfPlaylist = null;
    let playlist;
    if (!Utils.isEmpty(playlistId)) {

        let [errPlaylist, playlist] = await to(VnUserPlaylistModel.getDetail(playlistId));
        if(errPlaylist) return ReE(res, errPlaylist, 422);

        if (Utils.isEmpty(playlist)) {
            res.json({
                responseCode: ResponseCode.NOT_FOUND,
                message: "Playlist không tồn tại."
            });
        }

        if (Utils.isEmpty(id)) {
            let [errPlaylistItem, items] = await to(VnUserPlaylistItemModel.getItemsByPlaylistId(playlistId));
            if(errPlaylistItem) return ReE(res, errPlaylistItem, 422);
            id = items.id;
        }

        let videoOfPlaylist;
        if (playlistType == 'USER') {
            videoOfPlaylist = VideoObj.serialize(
                Obj.VIDEO_OF_PLAYLIST . playlistId, VnUserPlaylistItemModel.getItemsByPlaylistIdQuery(playlistId), false, playlist.name
            );
            videoOfPlaylist.description = playlist.description;
            videoOfPlaylist.fullUserName = Utils.isEmpty(playlist.full_name) ? playlist.full_name : playlist.msisdn;
        }
    }


    let video = await VnVideoModel.getDetail(id);

    if (Utils.isEmpty(video)) {
        res.json({
            responseCode: ResponseCode.NOT_FOUND,
            message: 'Video không tồn tại.',
        });
    }

    if (video.status === vnVideoEnum.STATUS_DRAFT || video.status === vnVideoEnum::STATUS_DELETE) {
        return {
            responseCode: ResponseCode.NOT_FOUND,
            message: 'Video chưa được phê duyệt. Quý khách vui lòng thử lại sau',
        };
    }

    let detailObj = {};
    detailObj.id = video.id;
    detailObj.name = video.name;
    detailObj.description = video.description;
    let videotype;
    // Neu du lieu la phim cu: migrate
    if (video.old_playlist_id && !playlistId) {
        playlistId = video.old_playlist_id;
        detailObj.type = 'FILM';
        videotype = 'FILM';
    }

    if (!Utils.isEmpty(playlistId) && video.type !== 'FILM') {
        detailObj.type = 'PLAYLIST';
    } else {
        detailObj.type = video.type;
    }

    detailObj.coverImage = VnHelper.getThumbUrl(video.bucket, video.path, Obj.SIZE_COVER);
    detailObj.likeCount = video.like_count;
    detailObj.dislikeCount = video.dislike_count;
    detailObj.play_times = Utils.number_format(video.play_times, 0, ',', '.');
    detailObj.suggest_package_id = video.suggest_package_id;
    detailObj.tag = video.tag;
    detailObj.duration = Utils.durationToStr(video.duration);
    detailObj.publishedTime = Utils.time_elapsed_string(video.published_time);
    detailObj.durationSecond = video.duration;
    if (appId === 'app-api') {
        detailObj.show_times = Utils.dateDiff(video.show_times);
    } else {
        detailObj.show_times = video.show_times;
    }
    detailObj.isFavourite = 0;
    detailObj.watchTime = 0;

    detailObj.tagline = (video.is_recommend) ? 1 : ((video.is_hot) ? 2 : 0);
    detailObj.drm_content_id = video.drm_content_id;
    
    detailObj.previewImage = VnHelper.getThumbUrl(video.file_bucket, video.file_path, false, true); //str_replace( basename($video.file_path']), "P001.png",  VtHelper::getThumbUrl($video.file_bucket'], $video.file_path'], false, true));


    if (userId) {
        [errFavourite, objFavourite] = await to(VnFavouriteVideoModel.checkIsFavourite(userId, id));
        detailObj.isFavourite = (objFavourite) ? objFavourite.status : 0;
        historyView = VnHistoryViewModel.getByItemId(userId, msisdn, 'VOD', id);
        if (!Utils.isEmpty(historyView)) {
            detailObj.watchTime = historyView.time;
        }
    }

    // TODO hardcode
    detailObj.link = ''; //Yii::$app->params.cdn.site'] . "/video/" . $id . "/" . $video.slug'] . "?utm_source=APPSHARE";


    // them truong du lieu neu la WAP
    if (appId === 'app-wap' || appId === 'app-web') {
        detailObj.slug = video.slug;
    }

    // TODO hardcode
    // Lay thong tin thue bao
    let [errUser, objUser] = await to(VnUserModel.getById(video.created_by));
    if(errUser) return ReE(res, errUser, 422);
    
    detailObj.owner.id = objUser.id;
    detailObj.owner.name = (objUser.full_name) ? objUser.full_name : ((objUser.msisdn) ? objUser.msisdn.substr(0, -3) + "xxx" : "");
    detailObj.owner.avatarImage = VnHelper.getThumbUrl(objUser.bucket, objUser.path, Obj.SIZE_AVATAR);
    detailObj.owner.followCount = objUser.follow_count;

    if (userId) {
        let userFollow = await VnUserFollowModel.getFollow(userId, video.created_by);
        detailObj.owner.isFollow = userFollow ? 1 : 0;
        detailObj.owner.notification_type = userFollow ? userFollow.notification_type : 0;
    } else {
        detailObj.owner.isFollow = 0;
        detailObj.owner.notification_type = 0;
    }
    // Lay thong tin chuyen muc

    let objCate = await VnGroupCategoryModel.getById(video.category_id);
    detailObj.cate.id = objCate.id;
    detailObj.cate.name = objCate.name;
    detailObj.cate.parent_id = objCate.parent_id;

    let streamingObj = VnFlow.viewVideo(msisdn, video, playlistId, profileId, userId, authJson, supportType, acceptLossData, null, distributionId, networkDeviceId,deviceType);

    //An noi dung tinh phi khi duyet APP iOS
    if (needHiddenFreemiumContent) {
        if (Utils.isset(streamingObj.popup)) {
            streamingObj.popup = [];
        }
    }
    //Neu noi dung truyen thong GA thi related lay 30 ban ghi
    let limitRelated;
    if (isShowPopup) {
        limitRelated = config.app_googleadwords_relate_limit;
    } else {
        limitRelated = config.app_video_relate_limit;
    }

    let relateds = null;
    let deviceId = null;
    if (!Utils.isEmpty(deviceId)) {
    // if (!Utils.isEmpty(deviceId) && Yii::$app->params.recommendation'].enable']) {

    let videoIds = RecommendationService.getVideoIds(RecommendationService.BOX_RELATED, deviceId, id,
        {
        channel_id: video.created_by,
        channel_name: objUser.full_name,
        video_name: video.name,
        tag_name: video.tag
        }, 1, limitRelated);

    
    if (!empty($videoIds)) {
        $relateds = VideoObj::serialize(
            Obj::VIDEO_RECOMMEND_RELATE, VtVideoBase::getVideosByIdsQuery($videoIds, Yii::$app->params.app.search.page.limit'])
    ->orderBy([new Expression('FIELD (v.id, ' . implode(',', array_filter($videoIds)) . ')')])
    );
    }

}

    if (!isset($relateds.content']) || count($relateds.content']) == 0) {
        $relateds = VideoObj::serialize(
            Obj::VIDEO_RELATE, VtVideoBase::getVideoRelatedQuery($video.id'], $video.category_id'], $video.created_by'], $limitRelated, 0, $video.published_time']), false
        );
    }

    //$limitRelated


    if ($this->userId || $this->msisdn) {
    $history = VtHistoryViewBase::getByItemId($this->userId, $this->msisdn, $video.type'], $id);

    $currentTime = 0;
    if($video.duration'] > 0 && ($history.time']/$video.duration'] <= 0.8)){
        $currentTime = ($history) ? intval($history.time']) : 0;
    }

}

    // Kiem tra xem loai playlist can lay
    if ($playlistType == 'ADMIN') {

        // Lay danh sach cac item thuoc playlist
        $items = VtPlaylistItemBase::getItemsByPlaylistId($playlistId);
        $parts = array();
        $cc = 0;
        $firstItemId = 0;
        $prevVideoId = 0;
        $nextVideoId = 0;

        $isVideoInPlaylist = false;

        foreach ($items as $item) {
            if ($firstItemId == 0) {
                $firstItemId = $item.id'];
            }
            if ($id == $item.id']) {
                $isVideoInPlaylist = true;
                if ($cc > 0) {
                    $prevVideoId = $items[$cc - 1].id'];
                }
                if ($cc < count($items) - 1) {
                    $nextVideoId = $items[$cc + 1].id'];
                }
            }
            $prefixAlias = Yii::$app->params.alias.prefix'];
            $parts[$cc].id'] = $item.id'];
            $parts[$cc].alias'] = $prefixAlias . (($item.alias']) ? $item.alias'] : ($cc + 1));
            $parts[$cc].name'] = $item.name'];
            $parts[$cc].slug'] = $item.slug'];
            $cc++;
        }

        if (!$nextVideoId) {
            if (isset($relateds.content']) && count($relateds.content']) > 0) {
                $nextVideoId = $relateds.content'][0].id'];
            }
        }
    }

    // Tim vi tri next , prev Video

    //Kiem tra xem the loai co thuoc the loai worlcup khong

    if (strpos(VtConfigBase::getConfig('category.worldcup') . ",", $video.category_id'] . ",") !== false) {
    $detailObj.cate'].is_world_cup_category'] = 1;
}


    return [
        'responseCode' => ResponseCode::SUCCESS,
    'message' => ResponseCode::getMessage(ResponseCode::SUCCESS),
    'data' => [
    'detail' => $detailObj,
    'previousId' => $prevVideoId,
    'nextId' => $nextVideoId,
    'profile' => [],
    'streams' => $streamingObj,
    'relateds' => $relateds,
    'parts' => $parts,
    'currentTime' => $currentTime,
    'videoOfPlaylist' => $videoOfPlaylist,
]
];
}
module.exports.actionGetDetail = actionGetDetail;


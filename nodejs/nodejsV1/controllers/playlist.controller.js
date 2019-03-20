const params = require('../config/params');
const config = params.configStr;
const VnHelper = require('../lib/VnHelper');
const obj = require('../lib/Obj');
const db = require('../models');
const Sequelize = db.Sequelize;
const Playlist = require('../models/models_mxhvd/vn_playlist')(db.sequelize, db.Sequelize);
const User = require('../models/models_mxhvd/vn_user')(db.sequelize, db.Sequelize);
const Video = require('../models/models_mxhvd/vn_video')(db.sequelize, db.Sequelize);
const UserFollow = require('../models/models_mxhvd/vn_user_follow')(db.sequelize, db.Sequelize);

const { to, ReE, ReS }      = require('../services/util.service');
const { validationResult } = require('express-validator/check');

const common = require('../common/common');

const PlaylistModel = require('../models/playlist.model');
const PlaylistItemModel = require('../models/vnPlaylistItem.model');
const UserPlaylistModel = require('../models/vnUserPlaylist.model');
const FavouritePlaylistModel = require('../models/vnFavouritePlaylist.model');

const STATUS_APPROVE = 2;
const STATUS_DELETE = 3;

//const for userplaylist
const STATUS_ADD = 1;
const STATUS_REMOVE = 0;

const TYPE_USER = 'USER';
const TYPE_FILM = 'FILM';

const ACTIVE = 1;

//const for obj
const FILM_RELATE = 'film_relate';

function getUserLogin(){
  return {user_id:'1',user_phone:'84354926551'};
}

exports.getDetail = async (req, res) => {
  let id = req.body.id;
  let supportType = 'VODCDN';
  let acceptLossData = req.body.accept_loss_data;
  let profileId = req.body.profile_id;
  let videoId = req.body.video_id;

  //lay thong tin playlist theo id truyen vao
  let [errFind, curPlaylist] = await to(PlaylistModel.getDetail(id));
  console.log(curPlaylist);
  if(errFind) return ReE(res, errFind, 422);
  if(!curPlaylist) return ReE(res, 'Đối tượng không tồn tại', 404);
  let playlistInfo = curPlaylist.dataValues;

  let detailObj = {
    'id': playlistInfo.id,
    'name': playlistInfo.name,
    'description': playlistInfo.description,
    'type': playlistInfo.type,
    'likeCount': playlistInfo.like_count,
    'link': `${config.cdn_site}/phim/${id}/${playlistInfo.slug}?utm_source=APPSHARE`,
    'slug': playlistInfo.slug,
    'play_times': playlistInfo.play_times,
    'suggest_package_id': playlistInfo.suggest_package_id,
  };

  // Neu type = Film thi lay anh doc
  if (playlistInfo.type === TYPE_FILM) {
    detailObj.coverImage = VnHelper.getThumbUrl(playlistInfo.bucket, playlistInfo.path, obj.SIZE_FILM);
  } else {
    detailObj.coverImage = VnHelper.getThumbUrl(playlistInfo.bucket, playlistInfo.path, obj.SIZE_COVER);
  }

  let {user_id} = getUserLogin();
  if(user_id){
    let [errCheckLike, isLikePlaylist] = await to(FavouritePlaylistModel.checkIsFavourite(id, user_id));
    if(errCheckLike) detailObj.isFavourite = 0;
    else{
      detailObj.isFavourite = isLikePlaylist ? 1 : 0;
    }
  }else{
    detailObj.isFavourite = 0;
  }

  //lay thong tin thue bao tao playlist
  let [errUser, userCreate] = await to(User.findOne({
    where: {id: playlistInfo.created_by}
  }));
  if(errUser) return ReE(res, errUser, 422);
  if(userCreate){
    let userCreatePlaylist = userCreate.dataValues;
    detailObj.owner = {
      id: userCreatePlaylist.id,
      name: userCreatePlaylist.full_name ? userCreatePlaylist.full_name : userCreatePlaylist.msisdn,
      avatarImage: VnHelper.getThumbUrl(userCreatePlaylist.bucket, userCreatePlaylist.path, obj.SIZE_AVATAR),
      followCount: userCreatePlaylist.followCount,
    };

    if(user_id){
      let [errCheckFollow, isFollow] = await to(UserFollow.findOne({
        where: {follow_id: userCreatePlaylist.id, user_id: user_id}
      }));
      if(errCheckFollow) detailObj.owner.isFollow = 0;
      else{
        detailObj.owner.isFollow = isFollow ? 1 : 0;
      }
    }else{
      detailObj.owner.isFollow = 0;
    }

    //lay danh sach playlist cua nguoi tao
    let [errPlaylistUserFollow, playlistUserFollow] = await to(PlaylistModel.getPlaylistByUserId(playlistInfo.created_by, playlistInfo.type, config.film_relate_limit));
    if(errPlaylistUserFollow) return ReE(res, errPlaylistUserFollow, 422);
    if(playlistUserFollow){
      detailObj.owner.films = playlistUserFollow.map((elem) => {
        let filmInfo = elem.dataValues;
        return {
          id: filmInfo.id,
          name: filmInfo.name,
          coverImage: VnHelper.getThumbUrl(filmInfo.bucket, filmInfo.path, obj.SIZE_FILM),
          slug: filmInfo.slug
        };
      });
    }
  }

  // Lay danh sach cac item thuoc playlist
  let part = [];
  let isVideoInPlaylist = false;
  let [errPlaylistItem, listItemInPlaylist] = await to(PlaylistItemModel.getItemsByPlaylistId(id));
  if(errPlaylistItem) return ReE(res, errPlaylistItem, 422);
  if(listItemInPlaylist.length){

    let videoInfo = {};
    let firstItemId = 0;
    let temp = "1";

    part = listItemInPlaylist.map( (elem) => {
      let itemInfo = elem.dataValues;
      if (firstItemId === 0) {
        firstItemId = itemInfo.item_id;
        videoInfo = itemInfo.vn_videos[0]
      }

      if (parseInt(videoId) === itemInfo.item_id) {
        isVideoInPlaylist = true;
        videoInfo = itemInfo.vn_videos[0]
      }

      let itemAlias = itemInfo.alias ? itemInfo.alias : temp;
      return {
        id: itemInfo.item_id,
        alias: `${config.alias_prefix} ${itemAlias}`,
        name: itemInfo.vn_videos[0].name
      };
    });

    if (!videoId) {
      //neu khong truyen video id len se lay video dau tien
      videoId = firstItemId;
      isVideoInPlaylist = true;
    }

    if (user_id) {
      // $history = VtHistoryViewBase::getByItemId($this->userId, $this->msisdn, $videoId);
      // $currentTime = ($history) ? intval($history->time) : 0;
    }

    //Thay doi goi cuoc suggestion theo goi cua playlist
    videoInfo.suggest_package_id = playlistInfo.suggest_package_id;

    // Thay anh cover la anh video
    detailObj.coverImage = VnHelper.getThumbUrl(videoInfo.bucket, videoInfo.path, obj.SIZE_COVER);

    // $streams = VtFlow::viewVideo($this->msisdn, $video, $id, $profileId, $this->userId, $this->authJson, $supportType, $acceptLossData);
    //
    // //An noi dung tinh phi khi duyet APP iOS
    // if ($this->needHiddenFreemiumContent) {
    //   if (isset($streams['popup'])) {
    //     $streams['popup'] = [];
    //   }
    // }
  }

  if (!isVideoInPlaylist) return ReE(res, 'Đối tượng không tồn tại', 404);

  detailObj.currentVideoId = videoId;

  //lay danh sach playlist lien quan
  let [errSerialize, relatedObj] = await to(playlistSerialize(TYPE_FILM, FILM_RELATE, Playlist, PlaylistModel.getNewestPlaylistByTypeQuery(TYPE_FILM, config.film_relate_limit)));

  let responseObj = {
    responseCode: 200,
    message: "success",
    data: {
      detail: detailObj,
      part: part,
      relateds: relatedObj,
      profile: []
    }
  };

  return ReS(res, responseObj, 200);
};

exports.create = async (req, res) => {
  let {name, description} = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let validatorResult = errors.array();
    return ReE(res, validatorResult[0].msg, 201);
  }

  //todo: fake doi ham lay thong tin user dang nhap
  let msisdn = '84354926551';
  let userId = 1;

  let dataCreate = {
    msisdn: msisdn,
    user_id: userId,
    type: TYPE_USER,
    name: name,
    description: description,
    is_active: ACTIVE,
    status: STATUS_APPROVE,
  };

  let [err, playlist] = await to(UserPlaylistModel.insertItem(dataCreate));
  if(err) return ReE(req, err, 422);
  let playlistInfo = playlist.dataValues;
  let responseObj = {
    responseCode: 200,
    message: "Thành công",
    data: {
      playlist: {
        id: playlistInfo.id,
        name: playlistInfo.name,
        description: playlistInfo.description,
        num_video: playlistInfo.num_video,
        coverImage: VnHelper.getThumbUrl(playlistInfo.bucket, playlistInfo.path, obj.SIZE_VIDEO),
        type: "USER_PLAYLIST"
      }
    }
  };
  return ReS(res, responseObj);
};

exports.update = async (req, res) => {
  let {id, name, description} = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let validatorResult = errors.array();
    return ReE(res, validatorResult[0].msg, 201);
  }

  //todo: fake doi ham lay thong tin user dang nhap
  let loginUserId = 1;
  let loginMsisdn = '84354926551';

  //lay thong tin playlist theo id truyen vao
  let [errFind, curPlaylist] = await to(UserPlaylistModel.getDetail(id));
  if(errFind) return ReE(res, errFind, 422);

  if(!curPlaylist) return ReE(res, 'Đối tượng không tồn tại', 404);

  //kiem tra user co quyen cap nhat playlist khong
  let curPlaylistInfo = curPlaylist.dataValues;
  if(curPlaylistInfo.user_id !== loginUserId  && curPlaylistInfo.msisdn !== loginMsisdn ){
    return ReE(res, 'Đối tượng không thuộc sở hữu', 405);
  }

  let updateData = {description: description};
  if(name){
    updateData.name = name;
  }
  let [err, playlist] = await to( UserPlaylistModel.updatePlaylist(updateData, id) );
  if(err) return ReE(res, err, 422);

  let responseObj = {
    responseCode: 200,
    message: "Thành công",
  };
  return ReS(res, responseObj);
};

exports.delete = async (req, res) => {
  let id = req.body.id;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let validatorResult = errors.array();
    return ReE(res, validatorResult[0].msg, 201);
  }

  //todo: fake doi ham lay thong tin user dang nhap
  let loginUserId = 1;
  let loginMsisdn = '84354926551';

  //lay thong tin playlist theo id truyen vao
  let [errFind, curPlaylist] = await to(UserPlaylistModel.getDetail(id));
  if(errFind) return ReE(res, errFind, 422);

  if(!curPlaylist) return ReE(res, 'Đối tượng không tồn tại', 404);

  //kiem tra user co quyen xoa playlist khong
  let curPlaylistInfo = curPlaylist.dataValues;
  if(curPlaylistInfo.user_id !== loginUserId  && curPlaylistInfo.msisdn !== loginMsisdn ){
    return ReE(res, 'Đối tượng không thuộc sở hữu', 405);
  }

  let [err] = await to( UserPlaylistModel.updatePlaylist({status: STATUS_DELETE}, id) );
  if(err) return ReE(res, err, 422);

  let responseObj = {
    responseCode: 200,
    message: "Thành công",
  };
  return ReS(res, responseObj);
};

exports.toggleAddVideo = async (req, res) => {
  let {id, video_id, status} = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let validatorResult = errors.array();
    return ReE(res, validatorResult[0].msg, 201);
  }

  //todo: fake doi ham lay thong tin user dang nhap
  let loginUserId = 1;
  let loginMsisdn = '84354926551';

  //lay thong tin playlist theo id truyen vao
  let [errFind, curPlaylist] = await to(UserPlaylistModel.getDetail(id));
  if(errFind) return ReE(res, errFind, 422);
  if(!curPlaylist) return ReE(res, 'Đối tượng không tồn tại', 404);

  //kiem tra user co quyen tac dong playlist khong
  let curPlaylistInfo = curPlaylist.dataValues;
  if(curPlaylistInfo.user_id !== loginUserId  && curPlaylistInfo.msisdn !== loginMsisdn ){
    return ReE(res, 'Đối tượng không thuộc sở hữu', 405);
  }

  //lay thong tin video theo id truyen vao
  let [errFindVideo, video] = await to(Video.findOne({
    where: {id: id, is_active: ACTIVE, is_no_copyright: 0}
  }));
  if(errFindVideo) return ReE(res, errFind, 422);
  if(!video) return ReE(res, 'Video không tồn tại', 404);

  let isAdd = status.toString() === STATUS_ADD.toString();

  let [errFindPlaylistItem, playlistItem] = await to(PlaylistItemModel.getByPlayListAndItemId(id, video_id));
  if(errFindPlaylistItem) return ReE(res, errFindPlaylistItem, 422);

  if(status.toString() === STATUS_ADD.toString() && !playlistItem) {

    //Them video vao playlist
    let [errAddVideo] = await to(PlaylistItemModel.insertItem(id, video_id));
    if(errAddVideo) return ReE(res, errAddVideo, 422);

    //tang so luong video trong user_playlist
    let userPlaylistUpdateData = {num_video: Sequelize.literal('num_video + 1') };
    if(curPlaylistInfo.num_video === 0){
      //truong hop day la video dau tien se cap nhat truong bucket va path cua playlist theo video moi them
      userPlaylistUpdateData.bucket = video.dataValues.bucket;
      userPlaylistUpdateData.path = video.dataValues.path;
    }

    await to( UserPlaylistModel.updatePlaylist(userPlaylistUpdateData, id) );

  }else if(status.toString() === STATUS_REMOVE.toString() && playlistItem){
    //xoa video neu video ton tai trong playlist
    let [errDelVideo] = await to(playlistItem.destroy({ force: true }));
    if(errDelVideo) return ReE(res, errDelVideo, 422);

    //giam so luong video trong user_playlist
    await to( UserPlaylistModel.updatePlaylist({num_video: Sequelize.literal('num_video - 1') }, id) );
  }

  let responseObj = {
    responseCode: 200,
    message: "Thành công",
    data: {
      isAdd: isAdd
    }
  };
  return ReS(res, responseObj);
};

exports.toggleLikePlaylist = async (req, res) => {
  let id = req.body.id;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let validatorResult = errors.array();
    return ReE(res, validatorResult[0].msg, 201);
  }

  //todo: fake doi ham lay thong tin user dang nhap
  let loginUserId = 1;
  let loginMsisdn = '84354926551';

  //lay thong tin playlist theo id truyen vao
  let [errFind, curPlaylist] = await to(PlaylistModel.getDetail(id));
  if(errFind) return ReE(res, errFind, 422);
  if(!curPlaylist) return ReE(res, 'Đối tượng không tồn tại', 404);

  //lay thong tin trang thai hien tai cua user doi voi playlist hien tai
  let [errCheckFav, curStatus] = await to(FavouritePlaylistModel.getFavourite(loginUserId, id));
  if(errCheckFav) return ReE(res, errCheckFav, 422);

  let numLikeQuery, isLike;
  if(!curStatus) {//truong hop user chua like --> thuc hien like

    isLike = true;

    //luu thong tin user like playlist vao bang favorite_playlist
    let [errLikePlaylist] = await to(FavouritePlaylistModel.createFavourite(id, loginUserId));
    if(errLikePlaylist) return ReE(res, errLikePlaylist, 422);

    //tang so luot like
    numLikeQuery = {like_count: Sequelize.literal('like_count + 1') };

  }else{//truong hop user da like --> huy like

    isLike = false;

    let [errRemoveLike] = await to(curStatus.destroy({ force: true }));
    if(errRemoveLike) return ReE(res, errRemoveLike, 422);

    //giam so luot like
    numLikeQuery = {like_count: Sequelize.literal('like_count - 1') };
  }

  //cap nhat lai so luong like
  await to( PlaylistModel.updatePlaylist(numLikeQuery, id) );

  let responseObj = {
    responseCode: 200,
    message: "Thành công",
    data: {
      isLike: isLike
    }
  };
  return ReS(res, responseObj);
};

async function playlistSerialize(type,id,model,query,cache = false, name = null) {
  let result = [];
  let [err, queryResult] = await to(model.findAll(query));
  if(err) console.log(err);
  if(queryResult.length){
    result = queryResult.map((elem) => {
      let value = elem.dataValues;
      return {
        id: value.id,
        name: value.name,
        description: value.description,
        coverImage: VnHelper.getThumbUrl(value.bucket, value.path, obj.SIZE_FILM),
        slug: value.slug,
        play_times: common.convertPlayTimes(value.play_times),
        type: value.type
      };
    });
  }

  return {
    id: id,
    name: name ? name : obj.getName(id),
    type: type,
    content: result
  };
}
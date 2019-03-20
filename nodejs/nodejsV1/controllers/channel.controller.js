const params = require('../config/params');
const config = params.configStr;
const VnHelper = require('../lib/VnHelper');
const obj = require('../lib/Obj');

const db = require('../models');
const Op = db.Sequelize.Op;
const User = require('../models/models_mxhvd/vn_user')(db.sequelize, db.Sequelize);
const UserFollow = require('../models/models_mxhvd/vn_user_follow')(db.sequelize, db.Sequelize);
const UserChangeInfo = require('../models/models_mxhvd/vn_user_change_info')(db.sequelize, db.Sequelize);

const ChannelRelatedModel = require('../models/vnChannelRelated.model');

const { to, ReE, ReS }      = require('../services/util.service');
const { validationResult } = require('express-validator/check');

const common = require('../common/common');

const ACTIVE = 1;

const CHANNEL_HOT = 'channel_hot';
const CHANNEL_RELATED = 'channel_related_';

const NOTIFICATION_TYPE_NEVER = 0;

const WAIT_APPROVE = 0;

User.belongsTo(UserFollow, {foreignKey: 'id', targetKey: 'follow_id' });
UserFollow.hasMany(User, {foreignKey: 'id', sourceKey: 'follow_id' });


function getUserLogin(){
  return {user_id:'1',user_phone:'84354926551'};
}

exports.addChannelRelated = async (req, res) => {
  let id = req.body.channel_related_id;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let validatorResult = errors.array();
    return ReE(res, validatorResult[0].msg, 201);
  }

  //todo: fake doi ham lay thong tin user dang nhap
  let {user_id} = getUserLogin();

  //lay thong tin user relate
  let [errUserRelate, userRelate] = await to(User.findOne({
    where: {id: id, status: ACTIVE}
  }));
  if(errUserRelate) return ReE(res, errUserRelate, 422);
  if(!userRelate || id === user_id) return ReE(res, 'Kênh thêm không hợp lệ', 404);

  //kiem tra so kenh da them co lon hon so kenh toi da duoc phep them khong
  let [errTotalChannelRelate, totalChannelRelate] = await to(ChannelRelatedModel.getTotalChannelRelated(id));
  if(errTotalChannelRelate) return ReE(res, errTotalChannelRelate, 422);
  if(totalChannelRelate >= config.max_channel_relate){
    return ReE(res, `Số kênh đã đạt tối đa: ${config.max_channel_relate}`, 201);
  }

  //Them kenh
  let [errAdd, result] = await to(ChannelRelatedModel.findOrCreateChannelRelated(user_id, id));
  if(errAdd) return ReE(res, 'Thêm kênh thất bại', 422);
  let [newChannel, isAddNew] = result;
  if(!isAddNew){
    return ReE(res, 'Kênh đã thêm', 201);
  }

  let responseObj = {
    responseCode: 200,
    message: "Thành công"
  };
  return ReS(res, responseObj, 200);
};

exports.removeChannelRelated = async (req, res) => {
  let id = req.body.channel_related_id;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let validatorResult = errors.array();
    return ReE(res, validatorResult[0].msg, 201);
  }

  //todo: fake doi ham lay thong tin user dang nhap
  let {user_id} = getUserLogin();

  let [err, channelRelate] = await to(ChannelRelatedModel.getChannelRelated(user_id, id));
  if(err) return ReE(res, 'Xoá kênh thất bại', 422);
  if(!channelRelate) return ReE(res, 'Kênh không tồn tại', 201);

  //Xoa kenh
  let [errRemove] = await to(channelRelate.destroy({ force: true }));
  if(errRemove) return ReE(res, 'Xoá kênh thất bại', 422);

  let responseObj = {
    responseCode: 200,
    message: "Thành công"
  };
  return ReS(res, responseObj, 200);
};

exports.getChannelRelated = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let validatorResult = errors.array();
    return ReE(res, validatorResult[0].msg, 201);
  }

  let channelId = req.body.channel_id;

  let [err, userObj] = await to(User.findOne({
    where: {id: channelId, status: ACTIVE}
  }));
  if(err) return ReE(res, 'Có lỗi xảy ra', 422);
  if(!userObj) return ReE(res, 'Kênh không hợp lệ', 201);

  //lay danh sach cac kenh lien quan
  let [errRelated, channelRelated] = await to(ChannelRelatedModel.getAllChannelRelated(channelId));
  if(errRelated) return ReE(res, 'Có lỗi xảy ra', 422);

  let query = null;
  if(channelRelated.length){
    let relatedIds = channelRelated.map(elem => {
      return elem.dataValues.channel_related_id;
    });

    query = {
      where: {
        status: ACTIVE,
        id: {
          [Op.in]:relatedIds
        }
      },
      order: [['follow_count', 'DESC']],
      limit: config.video_channel_limit
    };

    let {user_id} = getUserLogin();
    if (user_id) {
      query.include = [{
        model: UserFollow,
        where: {user_id: user_id},
        required:false
      }]
    }
  }

  let [errSerialize, channelObj] = await to(channelSerialize(CHANNEL_RELATED, User, query,false,false,false));
  let responseObj = {
    responseCode: 200,
    message: 'Thành công',
    data: channelObj
  };
  return ReS(res, responseObj, 200);
};

exports.getChannelRecommend = async (req, res) => {
  let {user_id} = getUserLogin();

  let [err, listFollow] = await to(UserFollow.findAll({
    include: [{
      model: User,
      where: {status: ACTIVE}
    }],
    where: {user_id: user_id}
  }));
  if(err) return ReE(res, 'Có lỗi xảy ra', 422);
  if(!listFollow) return ReE(res, 'Không có dữ liệu', 201);

  let followIds = listFollow.map(elem => {
    return elem.dataValues.follow_id
  });

  let query = {
    where: {
      is_hot: 1,
      status: ACTIVE,
      id: {
        [Op.notIn]:followIds
      }
    },
    limit: config.video_channel_limit
  };
  let [errSerialize, channelObj] = await to(channelSerialize(CHANNEL_HOT,User,query,false,false,false,config.video_channel_limit));
  let responseObj = {
    responseCode: 200,
    message: 'Thành công',
    data: channelObj
  };
  return ReS(res, responseObj, 200);
};

exports.getDetail = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let validatorResult = errors.array();
    return ReE(res, validatorResult[0].msg, 201);
  }

  let id = req.body.id;

  let [err, channel] = await to(User.findOne({
    where: {id: id, status: ACTIVE}
  }));
  if(err) return ReE(res, 'Có lỗi xảy ra', 422);
  if(!channel) return ReE(res, 'Kênh không hợp lệ', 201);
  let channelInfo = channel.dataValues;

  let detailObj = {
    id: id,
    name: "", //Utils::truncateWords(($channel['full_name']) ? $channel['full_name'] : Utils::hideMsisdn($channel['msisdn']), 80);
    description: channelInfo.description,
    num_follow: channelInfo.follow_count,
    num_video: channelInfo.video_count,
    totalViews: channelInfo.view_count,
    created_at: channelInfo.created_at,
    type: 'CHANNEL',
    isFollow: false,
    notification_type: NOTIFICATION_TYPE_NEVER,
  };

  if (!channelInfo.bucket) {
    let avatarImages = config.random_avatar_channel;
    let randImage = avatarImages[common.getRandomInt(0, (avatarImages.length - 1))];
    channelInfo.bucket = randImage.bucket;
    channelInfo.path = randImage.path;
  }

  if (!channelInfo.channel_bucket) {
    let avatarChannels = config.random_banner_channel;
    let randImage = avatarChannels[common.getRandomInt(0, (avatarChannels.length - 1))];
    channelInfo.channel_bucket = randImage.bucket;
    channelInfo.channel_path = randImage.path;
  }

  detailObj.avatarImage = VnHelper.getThumbUrl(channelInfo.bucket, channelInfo.path, obj.SIZE_AVATAR);
  detailObj.coverImage = VnHelper.getThumbUrl(channelInfo.channel_bucket, channelInfo.channel_path, obj.SIZE_CHANNEL3);
  detailObj.coverImageWeb = VnHelper.getThumbUrl(channelInfo.channel_bucket, channelInfo.channel_path, obj.SIZE_CHANNEL2);

  let {user_id} = getUserLogin();
  if(user_id){
    let [err, followInfo] = await to(UserFollow.findOne({
      where: {user_id: user_id, follow_id: id}, raw: true
    }));

    if(followInfo){
      detailObj.isFollow = true;
      detailObj.notification_type = followInfo.notification_type;
    }
  }

  let mostViewVideos = []; //VideoObj::serialize(Obj::VIDEO_MOST_VIEW_OF_CHANNEL . $id, VtVideoBase::getVideosByChannel($id, Yii::$app->params['app.video.channel.limit'], 0, 'MOSTVIEW'), false, Obj::getName(Obj::VIDEO_MOST_VIEW_OF_CHANNEL));
  let newestVideos = []; //VideoObj::serialize(Obj::VIDEO_NEWEST_CHANNEL . $id, VtVideoBase::getVideosByChannel($id, Yii::$app->params['app.video.channel.limit'], 0, 'NEW'), false, Obj::getName(Obj::VIDEO_NEWEST_CHANNEL));

  let responseObj = {
    responseCode: 200,
    message: 'Thành công',
    data:{
      detail: detailObj,
      most_view_video: mostViewVideos,
      newest_video: newestVideos
    }
  };
  return ReS(res, responseObj, 200);
};

exports.update = async (req, res) => {
  let {name, description} = req.body;

  //todo: fake doi ham lay thong tin user dang nhap
  let {user_id} = getUserLogin();

  let [errFind, objChannel] = await to(UserChangeInfo.findOne({
    where: {user_id: user_id}, raw: true
  }));
  if(errFind) return ReE(res, errFind, 422);
  if(!objChannel) return ReE(res, 'Đối tượng không tồn tại', 404);

  let dataUpdate = {
    full_name: name,
    description: description,
    status: WAIT_APPROVE
  };

  let avatarObj = req.files.file_avatar[0] !== undefined ? req.files.file_avatar[0] : null;
  if(avatarObj && avatarObj.size > 0){
    dataUpdate.bucket = config.static_bucket;
    dataUpdate.path = avatarObj.path;
  }

  let bannerObj = req.files.file_banner[0] !== undefined ? req.files.file_banner[0] : null;
  if(bannerObj && bannerObj.size > 0){
    dataUpdate.channel_bucket = config.static_bucket;
    dataUpdate.channel_path = avatarObj.path;
  }

  let [err, updateInfo] = await to( UserChangeInfo.update(dataUpdate, {
    where: { user_id: user_id }
  }));
  if(err) return ReE(res, "Cập nhật thông tin thất bại", 422);
  let responseObj = {
    responseCode: 200,
    message: "Thành công",
    data:{
      channel: {
        id: objChannel.id,
        name: name,
        description: description,
        status: WAIT_APPROVE,
        avatarImage: VnHelper.getThumbUrl(dataUpdate.bucket, dataUpdate.path, obj.SIZE_AVATAR),
        coverImage: VnHelper.getThumbUrl(dataUpdate.channel_bucket, dataUpdate.channel_path, obj.SIZE_CHANNEL3),
        coverImageWeb: VnHelper.getThumbUrl(dataUpdate.channel_bucket, dataUpdate.channel_path, obj.SIZE_CHANNEL2),
      }
    }
  };
  return ReS(res, responseObj, 200);
};

async function channelSerialize(id,model,query,cache,name,appendHotContent,limit) {
  let result = [];

  if(query) {
    //Lay danh sach kenh hot, loai tru nhung kenh da follow
    let [err, response] = await to(model.findAll(query));

    let totalChannel = response.length;

    if (totalChannel < limit && appendHotContent) {

      let [errHotChannel, hotChannel] = await to(User.findAll({
        where: {
          is_hot: 1,
          status: ACTIVE
        },
        limit: limit,
        order: [['priority', 'DESC']]
      }));

      if (hotChannel.length) {
        let errMerge;
        [errMerge, response] = await to(common.mergeById(response, hotChannel, 'id', limit));
      }

    }

    if (response.length) {
      result = response.map(elem => {
        let responseInfo = elem.dataValues;
        let item = {
          channel_id: responseInfo.id,
          channel_name: responseInfo.full_name ? responseInfo.full_name : responseInfo.msisdn,
          channel_name_mini: responseInfo.full_name ? responseInfo.full_name : responseInfo.msisdn,
          avatarImageH: VnHelper.getThumbUrl(responseInfo.bucket, responseInfo.path, obj.SIZE_CHANNEL_LOGO_DETAIL),
          avatarImageHX: VnHelper.getThumbUrl(responseInfo.bucket, responseInfo.path, obj.SIZE_AVATAR),
          coverImage: VnHelper.getThumbUrl(responseInfo.bucket, responseInfo.path, obj.SIZE_COVER),
          num_follow: responseInfo.follow_count,
          num_video: responseInfo.video_count,
          description: responseInfo.description,
          avatarImage: VnHelper.getThumbUrl(responseInfo.bucket, responseInfo.path, obj.SIZE_AVATAR)
        };

        if (responseInfo.isFollow !== undefined) item.isFollow = true;
        if (responseInfo.follow_id > 0) item.isFollow = true;

        if (!responseInfo.bucket) {
          let avatarImages = config.random_avatar_channel;
          let randImage = avatarImages[common.getRandomInt(0, (avatarImages.length - 1))];
          item.bucket = randImage.bucket;
          item.path = randImage.path;
        }

        if (!responseInfo.channel_bucket) {
          let avatarChannels = config.random_banner_channel;
          let randImage = avatarChannels[common.getRandomInt(0, (avatarChannels.length - 1))];
          item.channel_bucket = randImage.bucket;
          item.channel_path = randImage.path;
        }

        return item;
      })

    }
  }

  return {
    id: id,
    name: (name) ? name : obj.getName(id),
    content: result,
    type: 'CHANNEL'
  }
}

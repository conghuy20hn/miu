const db = require('../models');
const ChannelRelated = require('../models/models_mxhvd/vn_channel_related')(db.sequelize, db.Sequelize);

function getTotalChannelRelated(id) {
  return ChannelRelated.count({
    where: {channel_id: id}, raw: true
  })
}

function findOrCreateChannelRelated(channelId, channelRelatedId){
  return ChannelRelated.findOrCreate({
    where: {channel_id: channelId, channel_related_id: channelRelatedId}, raw: true
  })
}

function getChannelRelated(channelId, relatedId){
  return ChannelRelated.findOne({
    where: {channel_id: channelId, channel_related_id: relatedId}
  })
}

function getAllChannelRelated(channelId){
  return ChannelRelated.findAll({
    where: {channel_id: channelId}
  })
}

module.exports = {
  getTotalChannelRelated,
  findOrCreateChannelRelated,
  getChannelRelated,
  getAllChannelRelated
};
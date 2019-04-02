const db = require('../models');
const Playlist = require('../models/models_mxhvd/vn_playlist')(db.sequelize, db.Sequelize);

const STATUS_APPROVE = 2;
const ACTIVE = 1;

function getDetail(id) {
  return Playlist.findOne({
    where: {id: id, is_active: ACTIVE, status: STATUS_APPROVE}
  })
}

function getPlaylistByUserId(userId, type, limit){
  return Playlist.findAll({
    where: {created_by: userId, type: type, status: STATUS_APPROVE, is_active: ACTIVE},
    order: [['id', 'DESC']],
    limit: limit
  })
}

function getNewestPlaylistByTypeQuery(type, limit){
  return {
    where: {type: type, status: STATUS_APPROVE, is_active: ACTIVE},
    order: [['updated_at', 'DESC']],
    limit: limit
  };
}

function updatePlaylist(updateData, id){
  return Playlist.update(updateData, { where: { id: id } } )
}

module.exports = {
  getDetail,
  getPlaylistByUserId,
  getNewestPlaylistByTypeQuery,
  updatePlaylist
};
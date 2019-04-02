const db = require('../models');
const PlaylistItem = require('../models/models_mxhvd/vn_playlist_item')(db.sequelize, db.Sequelize);
const Video = require('../models/models_mxhvd/vn_video')(db.sequelize, db.Sequelize);

Video.belongsTo(PlaylistItem, {foreignKey: 'id', targetKey: 'item_id' });
PlaylistItem.hasMany(Video, {foreignKey: 'id', sourceKey: 'item_id' });

const ACTIVE = 1;
const STATUS_APPROVE = 2;

function getByPlayListAndItemId(playlistId, itemId) {
  return PlaylistItem.findOne({
    where: {playlist_id: playlistId, item_id: itemId}
  })
}

function getItemsByPlaylistId(id){
  return PlaylistItem.findAll({
    include: [{
      model: Video,
      where: {is_active: ACTIVE, status: STATUS_APPROVE}
    }],
    where: {playlist_id: id},
    order: [['alias'], [db.Sequelize.fn('length', 'vn_video.name')], [Video, 'name']]
  })
}

function insertItem(playlistId, itemId){
  return PlaylistItem.create({
    playlist_id: playlistId,
    item_id: itemId,
  })
}

module.exports = {
  getByPlayListAndItemId,
  getItemsByPlaylistId,
  insertItem
};
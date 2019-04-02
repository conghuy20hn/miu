const db = require('../models');
const UserPlaylist = require('../models/models_mxhvd/vn_user_playlist')(db.sequelize, db.Sequelize);

const ACTIVE = 1;
const INACTIVE = 0;
const STATUS_APPROVE = 2;

function getDetail(id) {
  return UserPlaylist.findOne({
    where: {id: id, is_active: ACTIVE, status: STATUS_APPROVE}
  })
}

function updatePlaylist(updateData, id){
  return UserPlaylist.update(updateData, { where: { id: id } } )
}

function insertItem(data){
  return UserPlaylist.create(data)
}

module.exports = {
  getDetail,
  updatePlaylist,
  insertItem
};
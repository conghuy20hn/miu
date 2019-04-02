const db = require('../models');
const FavoritePlaylist = require('../models/models_mxhvd/vn_favourite_playlist')(db.sequelize, db.Sequelize);

function getFavourite(userId, id) {
  return FavoritePlaylist.findOne({
    where: {playlist_id: id, user_id: userId}
  })
}

function createFavourite(id, userId){
  return FavoritePlaylist.create({
    playlist_id: id,
    user_id: userId,
  })
}

function checkIsFavourite(id, user_id){
  return FavoritePlaylist.findOne({
    where: {playlist_id: id, user_id: user_id}
  })
}

module.exports = {
  getFavourite,
  createFavourite,
  checkIsFavourite
};
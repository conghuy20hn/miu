const db = require('../models');
const VnUserPlaylistItemBase = require('../models/models_mxhvd/vn_user_playlist')(db.sequelize, db.Sequelize);
const vnVideoEnum = require('../services/lib/vnVideoEnum');

const VnVideo = require('./models_mxhvd/vn_video')(db.sequelize, db.Sequelize);
const VnUser = require('./models_mxhvd/vn_user')(db.sequelize, db.Sequelize);


VnUserPlaylistItemBase.belongsTo(VnVideo, { foreignKey: 'item_id', as: 'v' });
VnVideo.belongsTo(VnUser, { foreignKey: 'created_by', as: 'u' });
const Op = db.sequelize.Op;

exports.getPlaylistByUserQuery = function (userId, limit = null, offset = null) {

    let where = {
        status: vnVideoEnum.STATUS_APPROVE,
        is_active: vnVideoEnum.ACTIVE,
        user_id: userId

    };
    let query = {
        where: where,
        limit: limit, offset: offset
    }
    return query;
}


exports.getPlaylistFindAllQuery = function (query, func = "getPlaylistFindAllQuery") {
    return new Promise(async function (resolve, reject) {
        query.raw = true;
        VnUserPlaylistItemBase.findAll(query).then(function (users) {
            resolve(users);
        }).catch(function (err) {
            console.log(func, err);
            resolve(false);
        });
    })
}

getItemsByPlaylistIdQuery = function(playlistId){
    return {
        where: {
            playlist_id: playlistId,
            include: {
                model: VnVideo, as: 'v',
                include: {
                    model: VnUser, as: 'u',
                    attributes: ['id', 'bucket', 'path', 'full_name', 'msisdn'],
                },
                // attributes: ['id', 'bucket', 'path', 'full_name', 'msisdn'],
                where:{
                    is_active:vnVideoEnum.ACTIVE,
                    status:vnVideoEnum.STATUS_APPROVE,
                    is_no_copyright:0,
                    published_time: {
                        [Op.lt]: Utils.currentCacheTime() // date('Y-m-d H:i:s')
                    }
                },order: [
                    ['published_time', 'DESC']
                ]
            },

        }
    }
}

getItemsByPlaylistId = function(playlistId){
    return self::getItemsByPlaylistIdQuery(playlistId);
}
exports.getItemsByPlaylistId = getItemsByPlaylistId;
exports.getItemsByPlaylistIdQuery = getItemsByPlaylistIdQuery;
const db = require('../models');
const VnUserPlaylistItemBase = require('../models/models_mxhvd/vn_user_playlist')(db.sequelize, db.Sequelize);
const vnVideoEnum = require('../services/lib/vnVideoEnum');
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


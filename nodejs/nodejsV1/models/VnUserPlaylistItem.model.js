const db = require('../models');
const VnUserPlaylistItemBase = require('../models/models_mxhvd/vn_user_playlist')(db.sequelize, db.Sequelize);
const vnVideoEnum = require('../services/lib/vnVideoEnum');
exports.getPlaylistByUserQuery = function (userId, limit = null, offset = null) {
    return new Promise(async function (resolve, reject) {
        let where = {
            status: vnVideoEnum.STATUS_APPROVE,
            is_active: vnVideoEnum.ACTIVE,
            user_id: userId

        };
        VnUserPlaylistItemBase.findAll({
            where: where,
            limit: limit, offset: offset
        }).then(function (users) {
            resolve(users);
        }).catch(function (err) {
            console.log(err);
            resolve(false);
        });
    })
}
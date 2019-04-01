const db = require('.');
const VnVideoHotBase = require('./models_mxhvd/vn_video_hot');
const Utils = require('../lib/Utils');
const VnVideoHot = VnVideoHotBase(db.sequelize, db.DataTypes);

exports.getByCategoryIds = function (categoryIds, limit = 10, offset = null) {
    let query = {
        where: {
            category_id: categoryIds,
            is_active: 1
        },
        limit: limit,
        offset: offset,
        order: [
            ['created_at', 'DESC'],
        ],
        attributes: ['video_id']

    }
    return this.getFindAllQuery(query, "getByCategoryIds");

}


exports.getFindAllQuery = function (query, func = "getFindAllQuery") {
    return new Promise(async function (resolve, reject) {
        query.raw = true;
        VnVideo.findAll(query).then(function (vnVideo) {
            resolve(vnVideo);
        }).catch(function (err) {
            console.log(func, err);
            resolve(null);
        });
    })
}
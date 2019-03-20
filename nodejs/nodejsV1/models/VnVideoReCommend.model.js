const db = require('.');
const VnVideoRecommnendBase = require('./models_mxhvd/vn_video_recommend');
const VnVideoRecommnend = VnVideoRecommnendBase(db.sequelize, db.DataTypes);
const vnVideoEnum = require('../services/lib/vnVideoEnum');
const VnVideoBase = require('./models_mxhvd/vn_video');
const VnVideo = VnVideoBase(db.sequelize, db.DataTypes);
const Op = db.sequelize.Op;

VnVideo.hasMany(VnVideoRecommnend, { foreignKey: 'id', as: 'v' });
VnVideoRecommnend.belongsTo(VnVideo, { foreignKey: 'video_id', as: 'u' });

exports.VnVideoRecommnendBase = VnVideoRecommnend;
exports.getByActiveQuery = async function (limit = 10, offset = null) {
    return new Promise(function (resolve, reject) {
        let where = {
            is_active: vnVideoEnum.ACTIVE
        };
        VnVideoRecommnend.findAll({
            where: where,
            attributes: ['vn_video_recommend.video_id'],
            include: {
                model: VnVideo, as: 'u',
                where: {
                    type: vnVideoEnum.TYPE_VOD,
                    status: vnVideoEnum.STATUS_APPROVE,
                    is_active: vnVideoEnum.ACTIVE,
                    is_no_copyright: 0,
                    published_time: {
                        [Op.lte]: new Date()
                    }
                }
            },
            order: [['created_at', 'DESC']],
            limit: limit,
            offset: offset
        }).then(function (videos) {
            console.log(videos);
            if (videos != null) {
                // console.log(videos);
                resolve(videos);
            } else {
                resolve(null);
            }
        }).catch(function (err) {
            console.log(err);
            resolve(null);
        });
    });
}
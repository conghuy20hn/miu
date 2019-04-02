const db = require('../models');
const VnPlaylist = require('../models/models_mxhvd/vn_playlist')(db.sequelize, db.DataTypes);
const VnPlaylistItem = require('../models/models_mxhvd/vn_playlist_item')(db.sequelize, db.DataTypes);

VnPlaylist.belongsTo(VnPlaylistItem, { foreignKey: 'id', as: 'p' });
VnPlaylistItem.hasMany(VnPlaylist, { foreignKey: 'playlist_id', as: 'pi' });

exports.VnPlaylist = VnPlaylist;
exports.VnPlaylistItem = VnPlaylistItem;
const Op = db.sequelize.Op;

const STATUS_TEMP = 0;
const STATUS_DRAFT = 1;
const STATUS_APPROVE = 2;
const STATUS_DELETE = 3;

const TYPE_FILM = 'FILM';
const TYPE_VOD = 'VOD';

const ACTIVE = 1;
const INACTIVE = 0;

checkVideoInPlaylist = function (videoId, playlistId) {
    return new Promise(function (resolve, reject) {
        VnPlaylist.findOne({
            where: {
                status: STATUS_APPROVE,
                is_active: ACTIVE
            },
            include: {
                mode: VnPlaylistItem, as: 'pi',
                where: {
                    item_id: videoId,
                    playlist_id: playlistId
                }
            }
        }).then(function (playlist) {
            // console.log(playlist.dataValues);
            resolve(playlist);
        }).catch(function (e) {
            console.log(e);
            resolve(false);
        })
    })
}

exports.checkVideoInPlaylist = checkVideoInPlaylist;
exports.getDetail = async function (id) {
    return new Promise(function (resolve, reject) {
        let where = {
            id: id,
            status: STATUS_APPROVE,
            is_active: ACTIVE
        };
        VnPlaylist.findOne({
            where: where,
        }).then(function (obj) {
            if (obj != null) {
                resolve(obj);
            } else {
                resolve(null);
            }
        }).catch(function (err) {
            console.log(err);
            resolve(null);
        });
    });

}
const db = require('.');
const VnUserBase = require('./models_mxhvd/vn_user');
const VnUser = VnUserBase(db.sequelize, db.DataTypes);

const ACTIVE = 1;
const INACTIVE = 0;
const BANNED = 2;
const NEED_CHANGE_PASWORD = 0;
const DONT_NEED_CHANGE_PASWORD = 1;
const HOT = 1;
const NOTIFICATION_READ = 1;
const NOTIFICATION_NOT_READ = 0;
exports.VnUserBase = VnUser;
exports.getUserById = async function (id) {
    return new Promise(function (resolve, reject) {

        let where = {
            id: id
        };
        let query = VnUser.findOne({
            where: where,
        }).then(function (obj) {
            if (obj != null) {
                resolve(obj.dataValues);
            } else {
                resolve(null);
            }

        }).catch(function (err) {
            console.log(err);
            resolve(null);
        });
    });

}

exports.getHotUserQuery = async function (limit = 10, offset = null, distinctIds = []) {
    return new Promise(function (resolve, reject) {

        let where = {
            is_hot: HOT,
            status: status
        };
        if (distinctIds) {
            where.id = {
                $notIn: distinctIds
            }
        }
        let query = VnUser.findAll({
            where: where,
            order: [
                ['priority', 'DESC'],
            ],
            limit: limit,
            offset: offset
        }).then(function (obj) {
            if (obj != null) {
                resolve(obj.dataValues);
            } else {
                resolve(null);
            }

        }).catch(function (err) {
            console.log(err);
            resolve(null);
        });
    });

}

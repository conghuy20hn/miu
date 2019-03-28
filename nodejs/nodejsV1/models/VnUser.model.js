/**
 * dungld
 */
const db = require('.');
const VnUserBase = require('./models_mxhvd/vn_user');
const VnUser = VnUserBase(db.sequelize, db.DataTypes);
const SHA = require('../lib/helper/SHA');
const Utils = require('../lib/Utils');
const ACTIVE = 1;
const INACTIVE = 0;
const BANNED = 2;
const NEED_CHANGE_PASWORD = 0;
const DONT_NEED_CHANGE_PASWORD = 1;
const HOT = 1;
const NOTIFICATION_READ = 1;
const NOTIFICATION_NOT_READ = 0;
exports.VnUserBase = VnUser;
const Op = db.sequelize.Op;
exports.getUserById = async function (id) {
    let where = {
        id: id
    };
    return await this.getUserByQueryOne(where, "getActiveUserById");

}
exports.getActiveUserById = async function (id) {
    let where = {
        id: id,
        status: ACTIVE
    };
    return await this.getUserByQueryOne(where, "getActiveUserById");

}
exports.getUserByQueryOne = async function (query, func = "getUserByQueryOne") {
    return new Promise(function (resolve, reject) {

        VnUser.findOne({
            where: query,
            raw: true,
        }).then(function (obj) {
            if (!Utils.isEmpty(obj)) {
                resolve(obj);
            } else {
                resolve(null);
            }

        }).catch(function (err) {
            console.log(func + ":" + err);
            resolve(null);
        });
    })
};
exports.getHotUser = async function (limit = 10, offset = null) {
    let query = this.getHotUserQuery(limit, offset);
    return await this.getUserByQueryOne(query, "getHotUser");
}
exports.getHotUserQuery = async function (limit = 10, offset = null, distinctIds = []) {


    let where = {
        is_hot: HOT,
        status: status
    };
    if (distinctIds) {
        where.id = {
            $notIn: distinctIds
        }
    }
    let query = {
        where: where,
        order: [
            ['priority', 'DESC'],
        ],
        limit: limit,
        offset: offset
    };

}
exports.getByIdsQuery = async function (ids, limit = 10, offset = null) {
    return new Promise(function (resolve, reject) {

        let where = {
            id: ids,
            status: ACTIVE
        };
        let query = VnUser.findAll({
            where: where,
            order: Sequelize.literal("FIELD(vn_user.id," + ids.toString() + ")"),
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
exports.getByMsisdn = async function (msisdn) {
    return new Promise(function (resolve, reject) {
        let where = {
            msisdn: msisdn
        };
        VnUser.findOne({
            where: where,
            raw: true
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
exports.getByMsisdnOrEmail = async function (msisdn, username) {
    let where = {
        [Op.or]: [{ msisdn: msisdn }, { email: username }]
    };
    return this.getUserByQueryOne(where, "getByMsisdnOrEmail");
}

exports.checkPassword = async function (user, password) {
    if (user != null) {
        let hash = SHA.getSecurePassword(password, user.salt, "SHA-512");
        if (hash == user.password) {
            return true;
        }
    }

    return false;
}
exports.saveUser = async function (vnUser) {
    return new Promise(function (resolve, reject) {
        VnUser.create(
            {
                vnUser
            }
        ).then(function (user) {
            if (!Utils.isEmpty(user)) {
                resolve(user.dataValues);
            } else {
                resolve(false);
            }
        }).catch(function (err) {
            console.log('saveUser', err);
            resolve(false);
        });
    });
}
exports.saveUser = async function (vnUser) {
    return new Promise(function (resolve, reject) {
        VnUser.create(
            {
                vnUser
            }
        ).then(function (user) {
            if (!Utils.isEmpty(user)) {
                resolve(user.dataValues);
            } else {
                resolve(false);
            }
        }).catch(function (err) {
            console.log('saveUser', err);
            resolve(false);
        });
    });
}
exports.update = function (update, where) {
    return new Promise(function (resolve, reject) {
        VnUser.update(
            update,
            {
                where: where,
                raw: true
            }
        ).then(function (video) {
            // console.log('getConfig',configs);
            if (Utils.isEmpty(video)) {
                resolve(video);
            } else {
                resolve(false);
            }
        }).catch(function (err) {
            console.log('update', err);
            resolve(false);
        });
    });
}
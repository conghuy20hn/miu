'use strict';
const db = require('.');
const bcrypt = require('bcrypt');
const bcrypt_p = require('bcrypt-promise');
const jwt = require('jsonwebtoken');
const { TE, to } = require('../services/util.service');
const CONFIG = require('../config/config');
const VnUserBase = require('./models_mxhvd/vn_user');
const VnUser = VnUserBase(db.sequelize, db.DataTypes);
exports.VnUserBase= VnUser;
module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('User', {
        first: DataTypes.STRING,
        last: DataTypes.STRING,
        email: { type: DataTypes.STRING, allowNull: true, unique: true, validate: { isEmail: { msg: "Phone number invalid." } } },
        phone: { type: DataTypes.STRING, allowNull: true, unique: true, validate: { len: { args: [7, 20], msg: "Phone number invalid, too short." }, isNumeric: { msg: "not a valid phone number." } } },
        password: DataTypes.STRING,
    });

    Model.beforeSave(async (user, options) => {
        let err;
        if (user.changed('password')) {
            let salt, hash
            [err, salt] = await to(bcrypt.genSalt(10));
            if (err) TE(err.message, true);

            [err, hash] = await to(bcrypt.hash(user.password, salt));
            if (err) TE(err.message, true);

            user.password = hash;
        }
    });

    Model.prototype.comparePassword = async function (pw) {
        let err, pass
        if (!this.password) TE('password not set');

        [err, pass] = await to(bcrypt_p.compare(pw, this.password));
        if (err) TE(err);

        if (!pass) TE('invalid password');

        return this;
    }

    Model.prototype.getJWT = function () {
        let expiration_time = parseInt(CONFIG.jwt_expiration);
        return "Bearer " + jwt.sign({ user_id: this.id }, CONFIG.jwt_encryption, { expiresIn: expiration_time });
    };

    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};
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
const db = require('.');

const vnCommentBadWordBase = require('./models_mxhvd/vn_comment_bad_word');
const vnBadWord = vnCommentBadWordBase(db.sequelize, db.DataTypes);
const Utils = require('../lib/Utils');
exports.vnCommentBadWordBase = vnBadWord;


exports.getAllBadWord = function () {
    return new Promise(function (resolve, reject) {
        let query = vnBadWord.findAll({
            attributes: ['content'],
        }).then(function (obj) {
            if (!Utils.isEmpty(obj)) {
                let values = [];
                obj.dataValues.forEach(element => {
                    values.push(Utils.removeSignOnly(element));
                });
                resolve(values);
            } else {
                resolve(null);
            }

        }).catch(function (err) {
            console.log(err);
            resolve(null);
        });
    });

}
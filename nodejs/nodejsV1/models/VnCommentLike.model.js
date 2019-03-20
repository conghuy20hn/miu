const db = require('.');

const vnCommentLikeBase = require('./models_mxhvd/vn_comment_like');
const VncommentLike = vnCommentLikeBase(db.sequelize, db.DataTypes);
const Utils = require('../lib/Utils');


exports.vnCommentLikeBase = VncommentLike;
exports.getDetailLike = async function (userId, commentId) {
    return new Promise(function (resolve, reject) {

        let where = {
            user_id: userId,
            comment_id: commentId
        };
        let query = VncommentLike.findOne({
            where: where,
        }).then(function (objLike) {
            if (objLike != null) {
                resolve(objLike.dataValues);
            } else {
                resolve(null);
            }

        }).catch(function (err) {
            console.log(err);
            resolve(null);
        });
    });

}

exports.deleteLike = async function (id) {
    return new Promise(function (resolve, reject) {
        VncommentLike.destroy({
            where: {
                id: id
            }
        }).then(function (like) {
            // console.log('getConfig',configs);
            if (like != null) {
                resolve(true);
            } else {
                resolve(false);
            }
        }).catch(function (err) {
            console.log('deleteLike comment', err);
            resolve(false);
        });
    });
}

exports.creatCommentLike = async function (userId, commentId, contentId, type) {
    return new Promise(function (resolve, reject) {
        VncommentLike.create(
            {
                user_id: userId,
                comment_id: commentId,
                type: type,
                content_id: contentId,
                updated_at: new Date(),
                created_at: new Date()
            }
        ).then(function (comment) {
            if (comment != null) {
                resolve(comment);
            } else {
                resolve(false);
            }
        }).catch(function (err) {
            console.log('creatCommentLike', err);
            resolve(false);
        });
    });
}
exports.getLikeIdWithUserId = async function (userId, contentId) {
    return new Promise(function (resolve, reject) {

        let where = {
            user_id: userId,
            content_id: contentId,
        };
        let likes = [];
        VncommentLike.findAll(
            {
                where: where,
                attributes: ['comment_id']
            }
        ).then(function (comment) {
           
            if (!Utils.isEmpty(comment)) {
                comment.forEach(element => {

                    likes.push(element.dataValues.comment_id);
                });
                resolve(likes);
            } else {
                resolve(false);
            }
        }).catch(function (err) {
            console.log('getByContentId', err);
            resolve(false);
        });
    });

}



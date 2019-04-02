const db = require('.');
const VnUserBase = require('../models/models_mxhvd/vn_user');
const VnUser = VnUserBase(db.sequelize, db.DataTypes);
const vnCommentBase = require('./models_mxhvd/vn_comment');
const VnComment = vnCommentBase(db.sequelize, db.DataTypes);
const VnCommentBadWordBase = require('../models/VnCommentBadWord.model');
const Utils = require('../lib/Utils');
const validator = require('validator');
VnUser.hasMany(VnComment, { foreignKey: 'id', as: 'v' });
VnComment.belongsTo(VnUser, { foreignKey: 'user_id', as: 'u' });
const Op = db.sequelize.Op;
const WAIT_APPROVE = 0;
const ACTIVE = 1;
const DISAPPROVE = 2;
const DELETED = 3;
exports.vnCommentBase = VnComment;


exports.updateLikeCount = async function (id, up) {
    return new Promise(function (resolve, reject) {
        let i = (up) ? 1 : -1;
        VnComment.update({ like_count: db.sequelize.literal('like_count + ' + i), }, { where: { id: id } }
        ).then(function (objCom) {
            if (objCom != null) {
                resolve(objCom);
            } else {
                resolve(false);
            }
        }).catch(function (err) {
            console.log('updateLikeCount', err);
            resolve(false);
        });
    });
}

exports.creatComment = async function (userId, commentId, comment, type, content, parentId) {
    return new Promise(function (resolve, reject) {
        let badwords = setBadWordFilterComment(comment);
        VnComment.create(
            {
                user_id: userId,
                comment_id: commentId,
                type: type,
                comment: comment,
                content: content,
                parent_id: parentId,
                status: 0,
                updated_at: new Date(),
                created_at: new Date(),
                bad_word_filter: badwords
            }
        ).then(function (comment) {
            if (!Utils.isEmpty(comment)) {
                resolve(comment.dataValues);
            } else {
                resolve(false);
            }
        }).catch(function (err) {
            console.log('creatCommentLike', err);
            resolve(false);
        });
    });
}
setBadWordFilterComment = function (comment) {
    let cmt = Utils.removeSignOnly(comment);

    let badWords = VnCommentBadWordBase.getAllBadWord();

    let matchFound = Utils.isEmpty(badWords) ? false : cmt.match("/\b(" + badWords.split("|") + ")\b/i");
    let isBadContent = 0;
    if (matchFound) {
        isBadContent = 1;
    }
    return isBadContent;
}
exports.getByContentId = async function (userId, type, contentId, limit = null, offset = null, parentIds = []) {
    return new Promise(function (resolve, reject) {

        let where = {
            type: type,
            content_id: contentId,
        };
        if (!Utils.isEmpty(userId)) {
            where = {
                type: type,
                content_id: contentId,
                [Op.or]: [{ status: WAIT_APPROVE, user_id: userId },
                { status: ACTIVE }]
            };
        } else {
            where.status = ACTIVE;
        }
        if (!Utils.isEmpty(parentIds)) {
            if (Utils.is_array(parentIds)) {
                where.parent_id = parentIds;
            } else {
                where.parent_id = {
                    [Op.or]: [parentIds, null]
                };
            }

        } else {
            where.parent_id = {
                [Op.or]: [0, null]
            };
        }
        VnComment.findAll(
            {
                where: where,
                attributes: ['id', 'type', 'comment', 'parent_id', 'created_at', 'like_count'],
                include: {
                    model: VnUser, as: 'u',
                    attributes: ['id', 'bucket', 'path', 'full_name', 'msisdn', 'channel_bucket', 'channel_path'],
                },
                limit: limit,
                offset: offset
            }
        ).then(function (comment) {
            if (!Utils.isEmpty(comment)) {
                resolve(comment);
            } else {
                resolve(null);
            }
        }).catch(function (err) {
            console.log('getByContentId', err);
            resolve(null);
        });
    });

}
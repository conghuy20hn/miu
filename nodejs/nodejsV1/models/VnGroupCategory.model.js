/**
 * dungld
 */
const db = require('../models');

const vnGroupCategory = require('./models_mxhvd/vn_group_category');
const cate = vnGroupCategory(db.sequelize, db.DataTypes);
const Sequelize = require('sequelize');

// const sq = db.sequelize;
const ACTIVE = 1;
const DEACTIVE = 0;
const TYPE_FILM = 'FILM';
const TYPE_VOD = 'VOD';

const HOT = 1;
const NO_HOT = 0;

exports.vnGroupCategory = cate;
getAllActiveCategory = async function (type = null) {
    return new Promise(function (resolve, reject) {

        let where = {
            is_active: ACTIVE,
        };
        if (type != null) {
            where = {
                is_active: ACTIVE,
                type: type
            };
        }
        let query = cate.findAll({
            where: where,
            order: [
                ['id', 'ASC'],
            ],
            attributes: ["id", "name", "type", [Sequelize.fn('concat', Sequelize.col("name"), '_', Sequelize.col("type")), "name_detail"]]
        }).then(function (objCate) {
            resolve(objCate);

        }).catch(function (err) {
            console.log(err);
            resolve(null);
        });
    });

}
exports.getAllActiveCategory = getAllActiveCategory;

exports.getParents = async function (offset = null, limit = null, isHot = false) {
    let where = {
        is_active: ACTIVE,
        parent_id: null
    };
    if (isHot) {
        where.is_hot = 1
    }
    let oft = null;
    if (offset != null) {
        oft = offset;
    }
    let lim = null;
    if (limit != null) {
        lim = limit;
    }
    let query = {
        where: where,
        offset: oft,
        limit: lim
    }
    return query;
    // return this.getFindAllQuery(query, "getParents");
}
exports.getAllHotCategories = async function (limit = null, ignoreIds = []) {
    let where = {
        is_active: ACTIVE,
        is_hot: 1,
        id: {
            $notIn: ignoreIds
        }
    };
    let query = {
        where: where,
        limit: limit,
        order: [
            ['positions', 'DESC'],
        ]
    }
    return this.getFindAllQuery(query, "getAllHotCategories");
}
exports.getFindAllQuery = function (query, func = "getFindAllQuery") {
    query.raw = true;//  return raw
    return new Promise(async function (resolve, reject) {
        cate.findAll(query)
            .then(function (vnCate) {
                // console.log(vnCate);
                resolve(vnCate);
            }).catch(function (err) {
                console.log(func, err);
                resolve(null);
            });
    });
}

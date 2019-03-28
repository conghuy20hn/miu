/**
*@author: dungld
*@createdAt: 2019-03-10 21:44:33
*/

const db = require('.');
const VnPackage = require('./models_mxhvd/vn_package');
const obj = VnPackage(db.sequelize, db.DataTypes);
const Op = db.sequelize.Op;
const ACTIVE = 1;
const IN_ACTIVE = 0;

exports.VnPackage = obj;

getListPackage = async function (distributionId = null) {

    let where = {
        is_active: ACTIVE,
    };
    if (distributionId != null) {
        where = {
            is_active: ACTIVE,
            distribution_id: distributionId
        }
    }
    let query = {
        where: where,
        order: [
            ['group_type', 'ASC'],
            ['priority', 'ASC'],
        ]

    }

    return await this.getFindAllQuery(query, "getListPackage");
}
exports.getListPackage = getListPackage;

getSuggestPackage = function (packageId = null) {

    let where = {
        is_active: ACTIVE,
        is_display_frontend: ACTIVE
    }
    if (packageId != null) {
        where.id = packageId;
    }
    let query = {
        where: where,
        order: [
            ['priority', 'ASC'],
        ]
    };
    return this.getFindOneQuery(query, "getSuggestPackage");

}

exports.getSuggestPackage = getSuggestPackage;

getDistributionPackage = function (distributionId) {
    let where = {
        is_active: ACTIVE,
        is_display_frontend: ACTIVE,
        distribution_id: distributionId
    }
    let query = {
        where: where,
        order: [
            ['priority', 'ASC'],
        ]
    };
    return this.getFindOneQuery(query, "getDistributionPackage");

}

exports.getDistributionPackage = getDistributionPackage;

getFindOneQuery = function (query, func = "getFindOneQuery") {
    return new Promise(function (resolve, reject) {
        query.raw = true;
        obj.findOne(query).then(function (package) {
            //console.log(package.dataValues);
            resolve(package);
        }).catch(function (e) {
            console.log(func, e);
            resolve(null);
        })
    })
}
exports.getFindOneQuery = getFindOneQuery;
getFindAllQuery = function (query, func = "getFindAllQuery") {
    return new Promise(function (resolve, reject) {
        query.raw = true;
        obj.findAll(query).then(function (package) {
            console.log(package);
            resolve(package);
        }).catch(function (e) {
            console.log(func, e);
            resolve(null);
        })
    })
}
exports.getFindAllQuery = getFindAllQuery;
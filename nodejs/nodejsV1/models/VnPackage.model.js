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
    return new Promise(function (resolve, reject) {
        let where = {
            is_active: ACTIVE,
        };
        if (distributionId != null) {
            where = {
                is_active: ACTIVE,
                distribution_id: distributionId
            }
        }
        let query = obj.findAll({
            where: where,
            order: [
                ['group_type', 'ASC'],
                ['priority', 'ASC'],
            ]
        }).then(function (packages) {
            if (packages != null) {
                resolve(packages);
            } else {
                resolve(null);
            }
        }).catch(function (err) {
            console.log(err);
            resolve(null);
        });
    });
}
exports.getListPackage = getListPackage;

getSuggestPackage = function(packageId = null){
    return new Promise(function(resolve, reject){
        let where = {
            is_active: ACTIVE,
            is_display_frontend: ACTIVE
        }
        if(packageId != null){
            where.id=packageId;
        }

        obj.findOne({
            where: where,
            order: [
                ['priority', 'ASC'],
            ]
        }).then(function(package){
            //console.log(package.dataValues);
            resolve(package);
        }).catch(function(e){
            console.log(e);
            resolve(false);
        })
    })
}

exports.getSuggestPackage = getSuggestPackage;

getDistributionPackage = function(distributionId){
    return new Promise(function(resolve, reject){
        let where = {
            is_active: ACTIVE,
            is_display_frontend: ACTIVE,
            distribution_id: distributionId
        }
        obj.findOne({
            where: where,
            order: [
                ['priority', 'ASC'],
            ]
        }).then(function(package){
            //console.log(package.dataValues);
            resolve(package);
        }).catch(function(e){
            console.log(e);
            resolve(false);
        })
    })
}

exports.getDistributionPackage = getDistributionPackage;
/**
 * Created by HUYNC2 on 3/11/2019.
 */
const db = require('../models');
const VnUserDrm = require('../models/models_mxhvd/vn_user_drm')(db.sequelize, db.DataTypes);
// const VnPackage = require('../models/models_mxhvd/vn_package');

//VnPlaylist.belongsTo(VnPlaylistItem, {foreignKey: 'id', as: 'p'});
//VnPlaylistItem.hasMany(VnPlaylist, {foreignKey : 'playlist_id', as : 'pi'});

exports.VnUserDrm = VnUserDrm;
//exports.VnPlaylistItem = VnPlaylistItem;
const Op = db.sequelize.Op;


getByMsisdnAndUserId = function(msisdn, userId){
    return new Promise(function(resolve, reject){
        let where = {
            1: 1,
        };
        if(msisdn){
            where.msisdn = msisdn;
        }
        if(userId){
            where.user_id = userId;
        }
        VnUserDrm.findAll({
            where: where,
        }).then(function(vnUsers){
            // console.log(playlist.dataValues);
            resolve(vnUsers);
        }).catch(function(e){
            console.log(e);
            resolve(false);
        })
    })
}

exports.getByMsisdnAndUserId = getByMsisdnAndUserId;

insertUserDrm = function(msisdn, userId, deviceId, networkDeviceId, entitlementId, deviceType, smsPackageId)
{
    return new Promise(function(resolve, reject){
        VnUserDrm.create(
            {
                msisdn: msisdn,
                user_id: userId,
                device_id: deviceId,
                network_device_id: networkDeviceId,
                entitlement_id: entitlementId,
                device_type: deviceType,
                sms_package_id: smsPackageId,
            }).then(function(vnUser) {
                resolve(vnUser);
            }).catch(function(e){
                console.log(e);
                resolve(false);
            })
    });
}
exports.insertUserDrm = insertUserDrm;
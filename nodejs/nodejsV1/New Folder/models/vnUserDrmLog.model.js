/**
 * Created by HUYNC2 on 3/12/2019.
 */
const db = require('../models');
const VnUserDrmLog = require('../models/models_mxhvd/vn_user_drm_log')(db.sequelize, db.DataTypes);
// const VnPackage = require('../models/models_mxhvd/vn_package');

//VnPlaylist.belongsTo(VnPlaylistItem, {foreignKey: 'id', as: 'p'});
//VnPlaylistItem.hasMany(VnPlaylist, {foreignKey : 'playlist_id', as : 'pi'});

exports.VnUserDrmLog = VnUserDrmLog;
//exports.VnPlaylistItem = VnPlaylistItem;
const Op = db.sequelize.Op;

insertLog = function(msisdn, userId, deviceId, networkDeviceId, entitlementId, deviceType, action, errorCode, smsPackageId)
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
                action: action,
                error_code: errorCode,
                sms_package_id: smsPackageId
            }).then(function(vnUser) {
                resolve(vnUser);
            }).catch(function(e){
                console.log(e);
                resolve(false);
            })
    });


}
exports.insertLog = insertLog;
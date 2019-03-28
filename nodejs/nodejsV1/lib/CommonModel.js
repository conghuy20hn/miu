
const VnConfigBase = require('../models/config.model');
const Utils = require('../lib/Utils');

exports.getInfoUpdate = async function (osType, osVersionCode) {
    let isForceUpdateAPP = 0;
    let isUpdateAPP = 0;

    if (!Utils.isEmpty(osType) && !Utils.isEmpty(osVersionCode)) {
        let arrForceUpdateAPP = await VnConfigBase.getConfigKey("FORCE_UPDATE_APP_" + osType.toUpperCase(), 0);
        isForceUpdateAPP = (Utils.in_array(osVersionCode, arrForceUpdateAPP.split(","))) ? 1 : 0;

        isUpdateAPP = (Utils.version_compare(await VnConfigBase.getConfigKey("VERSION_APP_" + osType.toUpperCase(), 0), osVersionCode) > 0) ? 1 : 0;
    }

    let res = {
        isForceUpdateAPP: isForceUpdateAPP,
        isUpdateAPP: isUpdateAPP
    }
    return res;
}
exports.checkHiddenContent = async function (osType, osVersionCode) {
    let hiddenPackage = false;
    if (osVersionCode && osType) {
        osType = osType.toUpperCase();
        if (osType == 'IOS' && Utils.version_compare(osVersionCode, await config.getConfigKey("VERSION_APP_" + osType, 0), 0) > 0) {
            hiddenPackage = true;
        }

    }
    return hiddenPackage;
}
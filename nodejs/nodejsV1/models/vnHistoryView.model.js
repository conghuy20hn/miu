const db = require('../models');
const VnHistoryView = require('../models/models_mxhvd/vn_history_view')(db.sequelize, db.DataTypes);
const dbredis = require('../config/redis');
const redis = dbredis.constant;
const redisService = require('../services/redis.service');

const Utils = require('../lib/Utils');
// VnPlaylist.belongsTo(VnPlaylistItem, {foreignKey: 'id', as: 'p'});
// VnPlaylistItem.hasMany(VnPlaylist, {foreignKey : 'playlist_id', as : 'pi'});

exports.VnHistoryView = VnHistoryView;

// exports.VnPlaylistItem = VnPlaylistItem;
const Op = db.sequelize.Op;


const TYPE_VOD = 'VOD';
const TYPE_LIVETV = 'LIVETV';
const TYPE_FILM = 'FILM';
const HISTORY_VIEW = 'HISTORY';
const WATCH_CONTINUE = 'CONTINUE';
const EXPIRED_LIST = 1296000; // 31 ngay
const EXPIRED_ITEM = 1296000;
exports.TYPE_VOD = TYPE_VOD;
insertContinue = function (userId = 0, msisdn, video, time, parentId = 0) {
    let keyHistoryContinue = generaKey(msisdn, userId, video.type, null, WATCH_CONTINUE);
    insertStr(msisdn, userId, video['type'], keyHistoryContinue, video.id, EXPIRED_LIST);
}

generaKey = function (msisdn, userId, type, itemId = 0, prefix = HISTORY_VIEW) {
    let key = "";
    if (itemId > 0) {
        key = msisdn + '_' + userId + '_' + type + '_' + itemId;
    } else {
        key = msisdn + '_' + userId + '_' + type;
    }
    if ((prefix)) {
        key = prefix + '_' + key;
    }
    return key;
};

insertStr = function (msisdn, userId, type, key, itemId, lifetime = 0) {
    let history = ''; //self::getConnectCache($key);
    let space = "";
    let result = "";
    let value = space + itemId + space;
    if (history) {
        result = formatStr(history, value);

        //    let arrStr = count_chars(result, 1);
        //    let dem = array_key_exists(44, $arrStr) ? $arrStr[44] * 2 - 1 : 0;
        //    if ($dem >= \Yii::$app->params['historyView.limit']) {
        //        $firstItem = strchr($result, ",", true);
        //        $result = str_replace($firstItem . ',', "", $result);
        //        $keyItem = self::generaKey($msisdn, $userId, $type, trim($firstItem));
        //        self::deleteCache($keyItem);
        //    }
        //    if ($dem == 0) {
        //        $result = $value;
        //    }
        //} else {
        //    $result = $value;
        //}
        //self::updateCache($key, $result, $lifetime);
    }
}

formatStr = function (str, value) {
    let search = str.replace(value, ""); // str_replace($value, ",", $str);
    let result = search.replace(",,", ""); // str_replace(",,", "", $search);
    result = result.replace("null", ""); // str_replace("null", "", $result);

    result = result + "," + value; // Loai bo ,,

    if (result.charAt(0) === ',')
        result = result.substr(1);
    if (result.charAt(result.length) === ',')
        result = result.slice(0, -1);
    return result;
}
    // exports.getByUser = function getByUser(userId, msisdn, limit = null, offset = 0, type = null) {

    //     result = [];
    //     if (!Utils.isEmpty(type)) {

    //         let key = this.generaKey(msisdn, userId, type, 0, WATCH_CONTINUE);

    //         let history = redisService.getKey(key, redis.dbCache);
    //         if (Utils.isEmpty(history)) {
    //             let content = Utils.str_replace(" ", "", history);
    //             let result = content.split(",");
    //             if (result.length == 0) {
    //                 result = array($content);
    //             }
    //         }
    //     } else {
    //         $result = array_merge(
    //             self:: buildItem($result, $msisdn, $userId, self:: TYPE_VOD), self:: buildItem($result, $msisdn, $userId, self:: TYPE_FILM)
    //         );
    //     }


    //     if (!empty($limit)) {
    //         array_slice($result, $offset, $limit);
    //     }
    //     $items = $result;
    //     return array_reverse($items);
    // }
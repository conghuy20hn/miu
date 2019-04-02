var redis = require('redis');
var client = redis.createClient(9500, 'localhost');
let constant = {};
constant.dbCache = 0;
constant.dbSession = 1;

constant.CACHE_10MINUTE = 600;
constant.CACHE_15MINUTE = 900;
constant.CACHE_30MINUTE = 1800;
constant.CACHE_1DAY = 172800;

const listDb = { config: 0 };
const listKey = {
    video_list_watch_later: "video_list_watch_later_[userId]",
}

exports.client = client;
exports.listDb = listDb;
exports.listKey = listKey;
module.exports = {
    constant,
    client,
    listDb,
    listKey
}


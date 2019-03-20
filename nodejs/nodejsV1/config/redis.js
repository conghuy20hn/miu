var redis = require('redis');
var client = redis.createClient(8379, 'localhost');
const dbCache = 0;
const dbSession =1;

const CACHE_10MINUTE = 600;
const CACHE_30MINUTE = 1800;
const listDb = { config: 0 };
const listKey = {
    video_list_watch_later: "video_list_watch_later_[userId]",
}

exports.conRedis = client;
exports.listDb = listDb;
exports.listKey = listKey;


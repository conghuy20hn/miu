/**
 * Created by conghuyvn8x on 12/25/2018.
 */
//var redis = require('redis');
//
const port = 8479;
//const host = 'localhost';
// 0- config, 1: db turn, 2: db history, 3: db report, 4: db share
// core_minigame:turn_daily:<programCode>:<YYYYMMDD>:<msisdn>
// core_minigame:login_times:<YYYYMMDD>:<Số thuê bao có 84>
var dateFormat = require('dateformat');
let now = new Date();
//// Basic usage
//let dateNow= dateFormat(now, "yyyymmdd HHMMss");
let dateNow= dateFormat(now, "yyyymmdd");
let keyTurnDaily='core_minigame:turn_daily:<programCode>:<YYYYMMDD>:<msisdn>'.replace('<YYYYMMDD>',dateNow);
let keyLoginTime='core_minigame:login_times:<YYYYMMDD>:<msisdn>'.replace('<YYYYMMDD>',dateNow);

const listDb = {config:0,dbTurn:1,dbHistory:2,dbReport:3,dbShare:4,dbPack:9, dbLogLogin:10};
const listKey = {
    keyAuth:"core_minigame:service_account:<serviceId>:<username>",
    keyTurnTotal:"core_minigame:turn_total:<programCode>:<msisdn>",
    //keyTurnDaily:keyTurnDaily,
    keyTurnDaily:"core_minigame:turn_daily:<programCode>:<YYYYMMDD>:<msisdn>",
    keyMemberHis:"core_minigame:member_his:<programCode>:<msisdn>",
    keyLogAll:"core_minigame:log_all:<programCode>",
    keyGiftCode:"core_minigame:gift_received:<programCode>:<giftCode>:<msisdn>",
    keyVioBlacklist:"core_minigame:violate_blacklist:<programCode>:<msisdn>",
    keyGoldTable:"core_minigame:gold_table:<programCode>",
    keySpecialGift:"core_minigame:special_gift_received:<programCode>:<msisdn>",
    keyShareFb:"core_minigame:share_log:<programCode>:<msisdn>",
    keyGiftList:"core_minigame:member_his:<programCode>:<msisdn>",
    keyCheckGiftReward:"core_minigame:special_gift_recieved:<programCode>:<msisdn>",
    //keyLoginTime:keyLoginTime,
    keyLoginTime:'core_minigame:login_times:<YYYYMMDD>:<msisdn>',
    keyNewYearBlacklistSet:'newyear_blacklist_set:<programCode>'
};

const dbGameVT = 13;

const password = 'redis';
//var client = redis.createClient(port, host);
//exports.conRedis = client;
//exports.dbGameVT = dbGameVT;


var sentinel = require('redis-sentinel');

// List the sentinel endpoints
//var endpoints = [
//    {host: '10.240.134.200', port: port},
//    {host: '10.240.134.201', port: port}
//];

var endpoints = [
    {host: '10.60.155.108', port: 6379},
    {host: '10.60.155.108', port: 6380},
    {host: '10.60.155.108', port: 6381}
];

var opts = {}; // Standard node_redis client options
var masterName = 'mymaster';

// masterName and opts are optional - masterName defaults to 'mymaster'
var client = sentinel.createClient(endpoints, masterName, opts);
client.auth(password);

// Check if redis is running
let redisIsReady = false;
client.on('error', function(err) {
    redisIsReady = false;
    console.log('redis is not running');
    console.log(err);
});
client.on('ready', function() {
    redisIsReady = true;
    console.log('redis is running');
});



exports.conRedis = client;
exports.dbGameVT = dbGameVT;
exports.listDb = listDb;
exports.listKey = listKey;
exports.redisIsReady = redisIsReady;


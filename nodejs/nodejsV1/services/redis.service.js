
var redis = require('../config/redis').conRedis;
var listDb = require('../config/redis').listDb;
var listKey = require('../config/redis').listKey;

exports.getKey = function(keyRedis, db){
    let val =  new Promise(function(resolve, reject) {
        try{
            redis.select(db);
            redis.get(keyRedis, function (err, data) {
                if (err) {
                    resolve(false);
                } else {
                    resolve(data);
                }
            });
        }catch(e){
            resolve(false);
        }

    });
    return val;
}


exports.setKey = async function(keyRedis,value,timeout, db){
    let val = await new Promise(function(resolve, reject) {
        try{
            redis.select(db);
            let check = redis.set(keyRedis,value);
            if(timeout!==false){
                redis.expire(keyRedis,parseInt(timeout));
            }
            if (check==true) {
                resolve(true);
            } else {
                resolve(false);
            }
        }catch(e){
            resolve(false);
        }
    });
    return val;
}
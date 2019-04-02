const db = require('../models');
const VnBuyVideo = require('../models/models_mxhvd/vn_buy_video');

const obj = VnBuyVideo(db.sequelize, db.DataTypes);
exports.VnBuyVideo = obj;
const Op = db.sequelize.Op;

checkBuyVideo = function(msisdn, video){
	return new Promise(function(resoleve, reject){
		obj.findOne({
			where:{
				msisdn: msisdn,
				video_id: video.id,				
			}
		}).then(function(video){
            //console.log('getConfig',configs.dataValues.id);
        	//if(configs.length > 0){
        		resolve(video.dataValues);
        	//}else{
            	//resolve(defaultValue);
        	//}
        }).catch(function(video){
            console.log('checkBuyVideo',err);
            resolve(false);
        });
	})
}

module.exports.checkBuyVideo = checkBuyVideo;
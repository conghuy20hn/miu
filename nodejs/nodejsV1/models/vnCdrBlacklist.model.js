const db = require('../models');
const VnCdrBlacklist = require('../models/models_mxhvd/vn_cdr_blacklist');

const obj = VnCdrBlacklist(db.sequelize, db.DataTypes);
exports.VnCdrBlacklist = obj;
const Op = db.sequelize.Op;

checkBlacklist = function(videoId, channelId, cpId){
	return new Promise(function(resoleve, reject){
		obj.findOne({
			where:{
				content_id: videoId,
				type: 'VIDEO',
				[Op.or]: [
					{content_id: channelId},
					{type: 'CHANNEL'}
				],
				[Op.or]: [
					{content_id: cpId},
					{type: 'CP'}
				],
			}
		}).then(function(cdr){
            //console.log('getConfig',configs.dataValues.id);
        	//if(configs.length > 0){
        		resolve(cdr.dataValues);
        	//}else{
            	//resolve(defaultValue);
        	//}
        }).catch(function(err){
            console.log('checkBlacklist',err);
            resolve(false);
        });
	})
}

module.exports.checkBlacklist = checkBlacklist;
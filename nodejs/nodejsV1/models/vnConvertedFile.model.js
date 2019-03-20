//const VnConvertedFile = require('../models/models_mxhvd/vn_converted_file');
const db = require('../models');
const VnConvertedFile = require('../models/models_mxhvd/vn_converted_file');

const obj = VnConvertedFile(db.sequelize, db.DataTypes);
exports.VnConvertedFile = obj;

const Op = db.sequelize.Op;

getConvertFile = function(video, profileId){
	return new Promise(async function(resolve, reject){
		let result = await getConvertFileItem(video, profileId);
		if(!result){
			result = await getConvertFileItem(video, 3);
			if(!result){
				result = await getConvertFileItem(video, 2);
			} 
		}
		resolve(result);
	})
}

getConvertFileItem = function(video, profileId){
	return new Promise(function(resolve, reject){
		obj.findOne({
			where: {
				video_id: video.id,
				profile_id: profileId,	
			},
			// order: [
			// 	['priority', 'ASC'],
			// ]
		}).then(function(fileItem){
			//console.log(package.dataValues);
			if(fileItem != null){
				resolve(fileItem.dataValues);
			}else{
				resolve(false);
			}
		}).catch(function(e){
			console.log(e);
			resolve(false);
		})
	})
}

exports.getConvertFile = getConvertFile;
exports.getConvertFileItem = getConvertFileItem;
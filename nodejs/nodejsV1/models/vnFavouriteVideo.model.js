const db = require('../models');
const VnFavouriteVideo = require('../models/models_mxhvd/vn_favourite_video');

const obj = VnFavouriteVideo(db.sequelize, db.DataTypes);
exports.VnFavouriteVideo = obj;

getFavourite = function(userId, id){
	return new Promise(function(resolve, reject){
        let where = {
            user_id: userId,      
            video_id: id      
        };        

        let query = obj.findOne({
            where: where
        }).then(function(video){
            // console.log('getConfig',configs);
        	if(video != null){
        		resolve(video.dataValues);
        	}else{
            	resolve(false);
        	}
        }).catch(function(err){
            console.log('getFavourite',err);
            resolve(false);
        });
    })
}

exports.getFavourite = getFavourite;

deleteById = function(id){
    return new Promise(function(resolve, reject){
        obj.destroy({
            where: {
                id: id
            }
        }).then(function(video){
            // console.log('getConfig',configs);
            if(video != null){
                resolve(true);
            }else{
                resolve(false);
            }
        }).catch(function(err){
            console.log('deleteById',err);
            resolve(false);
        });
    });
}

exports.deleteById = deleteById;


updateItem = function(update, where){
    return new Promise(function(resolve, reject){
        obj.update(
            update,
            {
                where: where
            }
        ).then(function(video){
            // console.log('getConfig',configs);
            if(video != null){
                resolve(video);
            }else{
                resolve(false);
            }
        }).catch(function(err){
            console.log('updateItem',err);
            resolve(false);
        });
    });
}

exports.updateItem = updateItem;
exports.checkIsFavourite = function (userId, video_id) {
    return obj.findOne({
        where: {
            user_id: userId,
            video_id: video_id,
        }
    });
};


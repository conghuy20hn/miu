const db = require('../models');
const VnUserFollow = require('../models/models_mxhvd/vn_user_follow')(db.sequelize, db.DataTypes);
const VnUser = require('../models/models_mxhvd/vn_user')(db.sequelize, db.DataTypes);

//exports.VnVideo = VnVideo(db.sequelize, db.DataTypes);

VnUserFollow.belongsTo(VnUser, {foreignKey: 'user_id', as: 'u'});
VnUser.hasMany(VnUserFollow, {foreignKey : 'id', as : 'uf'})

exports.VnUserFollow = VnUserFollow;
exports.VnUser = VnUser;

const ACTIVE =1;

getFollowUser = function(userId, limit = 10, offset = 0){

	return new Promise(function(resolve, reject){
		let where = {};
		VnUserFollow.findAll({
    		where: {
				user_id: userId
    		},
			attributes: ['follow_id'],
    		include:{
    			model: VnUser, as: 'u',
    			where: {
					status: ACTIVE
    			},
           		required:false,
				attributes: ['full_name','bucket','id','path','msisdn'],
    		},
    		limit: limit,
    		offset: offset
    	}).then(function(users){
			if(users.length>0){
				resolve(users);
			}else{
				resolve({});
			}
    	}).catch(function(err){
    		console.log(err);
            resolve(false);
        });
    })
}
exports.getFollowUser = getFollowUser;
getChannelFollowQuery = function(userId, limit = 10, offset = 0){

	return new Promise(function(resolve, reject){
		let where = {};
		VnUserFollow.findAll({
    		where: {
				user_id: userId
    		},
			attributes: ['follow_id',['1','is_follow']],
    		include:{
    			model: VnUser, as: 'u',
    			where: {
					status: 1
    			},
           		required:false,
				attributes: ['u.*'],
			},
			order: [
                ['id', 'DESC'],
            ],
    		limit: limit,
    		offset: offset
    	}).then(function(users){
			if(users.length>0){
				resolve(users);
			}else{
				resolve({});
			}
    	}).catch(function(err){
    		console.log(err);
            resolve(false);
        });
    })
}
exports.getChannelFollowQuery = getChannelFollowQuery;
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
				user_id: parseInt(userId)
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
getChannelFollowQuery = function (userId, limit = 10, offset = 0) {

	let query = {
		where: {
			user_id: userId
		},
		attributes: ['follow_id',
			[Sequelize.literal(1), 'is_follow'],
			[Sequelize.col('u.full_name'), 'full_name'],
			[Sequelize.col('u.bucket'), 'bucket'],
			[Sequelize.col('u.path'), 'path'],
			[Sequelize.col('u.msisdn'), 'msisdn'],
			[Sequelize.col('u.id'), 'id'],  // alias on includes
		],
		include: {
			model: VnUser, as: 'u',
			where: {
				status: 1
			},
			required: true,
			attributes: [],
		},
		order: [
			['id', 'DESC'],
		],
		limit: limit,
		offset: offset
	}
	return query;
}
exports.getChannelFollowQuery = getChannelFollowQuery;

exports.getFollow = function (userId, followId) {
	return new Promise(function(resolve, reject){
		VnUserFollow.findOne({
			where:{
				user_id: userId,
				follow_id: followId,
			}
		}).then(function(users){
			if(users != null){
				resolve(users.dataValues);
			}else{
				resolve(false);
			}
		}).catch(function(err){
			console.log(err);
			resolve(false);
		});
	})
}
exports.getFindAllQuery = function (query, func = "getFindAllQuery") {
	return new Promise(function (resolve, reject) {
		query.raw = true;
		VnUserFollow.findAll(query).then(function (users) {
			if (users.length > 0) {
				resolve(users);
			} else {
				resolve({});
			}
		}).catch(function (err) {
			console.log(func, err);
			resolve({});
		});
	})
}
const db = require('../models');
const VnUserFollow = require('../models/models_mxhvd/vn_user_follow')(db.sequelize, db.DataTypes);


const ACTIVE =1;

function getFollowUserV2(userId, limit = 10, offset = 0){
	return VnUserFollow.findAll({
		where:{id:1}
	});
}
function getDetail() {
	return VnUserFollow.findOne({
		where: {id: "1"}
	})
}
module.exports = {
	getFollowUserV2,
	getDetail
};
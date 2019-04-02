const db = require('../models');
const VnBuyPlaylist = require('../models/models_mxhvd/vn_buy_playlist');
const VnPlaylistItem = require('../models/models_mxhvd/vn_playlist_item')(db.sequelize, db.DataTypes);
const obj = VnBuyPlaylist(db.sequelize, db.DataTypes);

VnBuyPlaylist.belongsTo(VnPlaylistItem, {foreignKey: 'playlist_id', as: 'bp'});
VnPlaylistItem.hasMany(VnBuyPlaylist, {foreignKey : 'playlist_id', as : 'pi'});

exports.VnBuyPlaylist = obj;
const Op = db.sequelize.Op;

checkBuyPlaylist = function(msisdn, video){
	return new Promise(function(resoleve, reject){
		VnBuyPlaylist.findOne({
			where:{
				msisdn: msisdn,		
			},
            include: {
                model: VnPlaylistItem, as: 'pi',
                where: {
                    item_id: video.id
                }
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

module.exports.checkBuyPlaylist = checkBuyPlaylist;
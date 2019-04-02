const db = require('../models');
const VnConfig = require('../models/models_mxhvd/vn_config');

const obj = VnConfig(db.sequelize, db.DataTypes);
exports.VnConfig = obj;

getConfig = function(key, defaultValue = ''){
	return new Promise(function(resolve, reject){
        let where = {
            config_key: key,            
        };        

        let query = obj.findOne({
            where: where
        }).then(function(configs){
            console.log('getConfig',configs);
        	if(configs != null){
        		resolve(configs.dataValues.config_value);
        	}else{
            	resolve(defaultValue);
        	}
        }).catch(function(err){
            console.log('getConfig',err);
            resolve(defaultValue);
        });
    })
}

exports.getConfig = getConfig;

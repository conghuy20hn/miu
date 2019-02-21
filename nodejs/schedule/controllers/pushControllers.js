/**
 * Created by HUYNC2 on 1/19/2019.
 */
const logger = require('../config/log4j').access;

exports.getListDataPush = function(req, res){
    let arrReturn={
        errCode:0,
        data:null
    };
    logger.info(arrReturn);
    res.json(arrReturn);
};
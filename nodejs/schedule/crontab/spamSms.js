const logger = require('../config/log4j').crontab;
var schedule = require('node-schedule');
const db=require('../config/db');

exports.spamSMSAction = function(){
	console.log('start spamSMSAction');
	var j = schedule.scheduleJob('*/1 * * * *', function(){
	  logger.info('This job was supposed to run actually ran at ' + new Date());
	});
}

// thuc hien import msisdn: lay danh sach status =0 => cap nhap status = 1 => import xong cap nhap status = 2

// thuc hien ban sms
exports.sendSMSAction = async function(){
	// kiem tra ct dang ban
	let sqlStatus = "select * from `dl_spam_sms` where status = ? order by `start_time` desc LIMIT 1;";
	let checkStatus6 = await db.select(sqlStatus6, [6]);
	if(checkCurentSend.errCode === 1){	// ko co CT dang ban
		// lay danh sach ct
		let checkStatus5 = await db.select(sqlStatus6, [5]);
		if(checkStatus5.errCode === 0){
			// cap nhap trang thai dang spam staus = 6
			let sqlUpdate = "update dl_spam_sms set status = 2 where id=?;";

		}
	}

}
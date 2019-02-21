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
	let checkStatus6 = await db.select(sqlStatus, [6]);
	if(checkStatus6.errCode === 0 && checkStatus6.data.length === 0){	// ko co CT dang ban
		// lay danh sach ct
		let checkStatus5 = await db.select(sqlStatus, [5]);
		if(checkStatus5.errCode === 0 && checkStatus5.data.length > 0){
			//console.log('checkStatus5 1', checkStatus5.data[0].id);
			let processId = checkStatus5.data[0].id;
			 //cap nhap trang thai dang spam staus = 6
			let sqlUpdate = "update dl_spam_sms set status = 2 where id=?;";
			let updateStatus6 = await db.select(sqlUpdate, [processId]);
			if(updateStatus6.errCode === 0){
				// thuc hien ban spam sms
				// lay tong so ban ghi
				let sqlTotalSMS = "select count(*) as total from `dl_spam_sms_msisdn` where `spam_sms_id`=?;";
				let totalSMS = await db.select(sqlTotalSMS, [processId]);
				if(totalSMS.errCode === 0 && totalSMS.data.length > 0){
                    let limit = 1000;
                    let totalRecord = totalSMS.data[0].total;
					let totalPage= totalRecord/limit;
				}
			}
		}
	}

}
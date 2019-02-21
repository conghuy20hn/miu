/**
 * Created by conghuyvn8x on 8/5/2018.
 */
const log4js = require('log4js');

log4js.configure({
    appenders: {
        all: {type: 'dateFile', filename: './logs/all.log',"pattern": "-yyyy-MM-dd", "backups": 3},
        crontab: {type: 'dateFile', filename: './logs/crontab.log',"pattern": "-yyyy-MM-dd", "backups": 3}
    },
    categories: {
        default: {appenders: ['all'], level: 'all'},
        crontab: {appenders: ['crontab'], level: 'all'}
    }
});

// var access = log4js.getLogger('all'); 
// var crontab = log4js.getLogger('crontab'); 

// exports.access = access;
// exports.crontab = crontab;
module.exports = {
    access: log4js.getLogger('all'),
    crontab: log4js.getLogger('crontab')
};
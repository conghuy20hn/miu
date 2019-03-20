const log4js = require('log4js');
log4js.configure({
    "appenders": [{
      "category": "view",
      "type": "dateFile",
      "filename": "./logs/view.log",
      "pattern": "-yyyy-MM-dd",
      "backups": 3,
      "compress": true,
    },
    {
      "category": "system",
      "type": "dateFile",
      "filename": "./logs/system.log",
      "pattern": "-yyyy-MM-dd",
      "backups": 3,
      "compress": true,
    },
    {
      "category": "error",
      "type": "dateFile",
      "filename": "./logs/error.log",
      "pattern": "-yyyy-MM-dd",
      "backups": 3,
      "compress": true,
    },
    {
      "type": "console"
    }],
    "levels": {
      "view": "ALL",
      "system": "ALL",
      "error": "ERROR"
    }
});


module.exports = { 
  access: log4js.getLogger('access'),
  system: log4js.getLogger('system'),
  error: log4js.getLogger('error'),
  express: log4js.connectLogger(log4js.getLogger('access'), {level: log4js.levels.INFO}),
  isDebug: function(category) {
    return (log4js.levels.DEBUG.level >= category.level.level);
  }
};

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const pe = require('parse-error');
const cors = require('cors');

const v1 = require('./routes/v1');
const app = express();
var fs = require('fs')
const CONFIG = require('./config/config');
var rfs = require('rotating-file-stream');
const moment = require('moment-timezone');
var path = require('path');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));


morgan.token('date', (req, res, tz) => {
  return moment().tz(tz).format();
})

morgan.token('response-time', function (req, res) {
  if (!res._header || !req._startAt) return '';
  var diff = process.hrtime(req._startAt);
  var ms = diff[0] * 1e3 + diff[1] * 1e-6;
  ms = ms.toFixed(3);
  //var timeLength = 8; // length of final string
  // format result:
  var arrMs = ms.split('.');
  return arrMs[0];
})

// create a rotating write stream
var accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'logs')
});
var log_format = ':remote-addr :remote-user [:date[Asia/Ho_Chi_Minh]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms';
app.use(morgan(log_format, { stream: accessLogStream }));

//Passport
app.use(passport.initialize());

//Log Env
console.log("Environment:", CONFIG.app)
//DATABASE
const models = require("./models");
models.sequelize.authenticate().then(() => {
  console.log('Connected to SQL database:', CONFIG.db_name);
})
  .catch(err => {
    console.error('Unable to connect to SQL database:', CONFIG.db_name, err);
  });

if (CONFIG.app === 'dev') {
  // models.sequelize.sync();//creates table if they do not already exist
  // models.sequelize.sync({ force: true });//deletes all tables then recreates them useful for testing and development purposes
}
// CORS
// app.use(cors());

app.use('/v1', v1);

app.use('/', function (req, res) {
  res.statusCode = 200;//send the appropriate status code
  res.json({ status: "success", message: "Parcel Pending API", data: {} })
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// // error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message
  });
});
console.log("The server is now running on port:", CONFIG.port);
module.exports = app;

//This is here to handle all the uncaught promise rejections
process.on('unhandledRejection', error => {
  console.error('Uncaught Error', pe(error));
});
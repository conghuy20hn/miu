/**
 * Created by conghuyvn8x on 12/25/2018.
 */
// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
// config access log
var morgan  = require('morgan');
var path = require('path');
var rfs = require('rotating-file-stream');
const moment = require('moment-timezone');
morgan.token('date', (req, res, tz) => {
    return moment().tz(tz).format();
})
// create a rotating write stream
var accessLogStream = rfs('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'logs')
});
var log_format = ':remote-addr :remote-user [:date[Asia/Ho_Chi_Minh]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms';
app.use(morgan(log_format, { stream: accessLogStream }));
// end config access log

// configure app to use bodyParser()
// this will let us get the data from a POST
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
// Response type for SOAP
//body parser middleware are supported (optional)
app.use(bodyParser.raw({type: function(){return true;}, limit: '5mb'}));
app.use(bodyParser.json());
app.use(bodyParser.text());

var port = process.env.PORT || 9082;        // set our port

// ROUTES FOR OUR API
// =============================================================================

var routes = require('./routes/routes'); //importing route
routes(app); //register the route

console.log('GameVT API on port ' + port);

// ========== start crontab ==========
var spamSMS = require('./crontab/spamSms');
spamSMS.spamSMSAction();

// var schedule = require('node-schedule');
// var jobName = 'checkjob';
// schedule.scheduleJob(jobName, '*/1 * * * *', function(){
//   console.log(jobName,'This job was supposed to run actually ran at ' + new Date());
// });
// ========== end crontab ==========

app.listen(port, function() {
    //Note: /gameTet route will be handled by soap module
    //and all other routes & middleware will continue to work
    //soap.listen(app, '/gameTet', service, xml);
});
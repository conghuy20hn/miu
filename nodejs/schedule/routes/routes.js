/**
 * Created by conghuyvn8x on 8/4/2018.
 */
module.exports = function (app) {
    var pushControllers = require('../controllers/pushControllers');
    //var mw = require('../controllers/auth');
    //app.use(mw([]));

    // vtImageControl Routes
    app.route('/getListDataPush').get(pushControllers.getListDataPush);
};
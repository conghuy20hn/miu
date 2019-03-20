const { User }          = require('../models');
const authService       = require('../services/auth.service');
const { to, ReE, ReS }  = require('../services/util.service');

module.exports = {
    get: (req, res) => {
        let sql = 'SELECT * FROM vt_video'
        db.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    }
}
const express = require('express')
const router = express.Router()
const jwt = require('jwt-simple')
const auth = require('../auth/authentication.js')
const studentenhuis = require('../routes/studentenhuis.js')
const db = require('../datasource/dbConnection');

//
// Login with {"username":"<username>", "password":"<password>"}
//
router.route('/login').post( function(req, res) {

    //
    // Get body params or ''
    //
    var username = req.body.username || '';
    var password = req.body.password || '';

    //
    // Check in datasource for user & password combo.
    //
    //
    db.query('SELECT email, password FROM user WHERE email = ?', [username], function (error, rows, fields) {
        if (error) {
            res.status(500).json(error)
        }

        console.log(rows)

        if (username == rows[0].email && password == rows[0].password) {
            var token = auth.encodeToken(username);
            res.status(200).json({
                "token": token,
                "status": 200,
                "parameters": res.body
            });
        } else {
            res.status(401).json({
                "msg": "The credentials you entered are wrong",
                "status": 401,
                "parameters": res.body
            })
        }
    })
});

router.use('/studentenhuis', studentenhuis)

module.exports = router;
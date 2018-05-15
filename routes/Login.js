
const express = require('express');
const router = express.Router();
const auth =  require('../auth/authentication');
const users = require('../datasource/logins');
const db = require('../datasource/dbConnection');


router.route('/login')
    .post( function(req, res) {
        let email = req.body.email || '';
        let password = req.body.password || '';

        if (email === '' || password === '') {
            res.status(412).json({"error": "Niet alle informatie is ingevuld"});
        } else {
            db.query('SELECT email, password FROM user WHERE email = ?', [email], function (err, rows, fields) {
                if (err) {
                    res.status(500).json(err);
                }

                if (rows.length < 1) {
                    res.status(404).json(err);
                }

                if (email === rows[0].email && password === rows[0].password) {
                    let token = auth.encodeToken(email);
                    res.status(200).json({
                        "token": token,
                        "status": 200,
                        "parameters": res.body
                    });
                } else {
                    res.status(401).json(err);
                }
            })
        }
    });

module.exports = router;
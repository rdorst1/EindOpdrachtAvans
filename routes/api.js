const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');
const auth = require('../auth/authentication.js');
const studentenhuis = require('./studentenhuis.js');
const db = require('../datasource/dbConnection');
const error = require('../errorsHandler/Errors');
let regex = require('regex-email');

// Login met format:  {"email":"<email>", "password":"<password>"}

router.route('/login').post( function(req, res) {
    let email = req.body.email || '';
    let password = req.body.password || '';

    if(regex.test(email) === true){
        //Haal email & wachtwoord op
        db.query('SELECT email, password FROM user WHERE email = ?', [email], function (err, rows, fields) {
            if (err) {
                res.status(500).json(err);
                return;
            }

            if(rows.length < 1){
                error.notFound(res);
                return;
            }
            // Vergelijk input met database
            if (email == rows[0].email && password == rows[0].password) {
                var token = auth.encodeToken(email);
                res.status(200).json({
                    "token": 'Bearer ' + token,
                    "status": 200,
                    "parameters": res.body
                });
            } else {
                error.noAuth(res);
                return;
            }
        })
    }else{
        error.emailIncorrect(res);
        return;
    }
});


// Register met format: {"firstname":"<firstname>", "lastname":"<lastname>", "email":"<email>", "password":"<password>"
router.route('/register').post( function(req, res){
    let firstname = req.body.firstname || '';
    let lastname = req.body.lastname || '';
    let email = req.body.email || '';
    let password = req.body.password || '';

    if (firstname !== '' && lastname !== '' && email !== '' && password !== '') {
        //Check lengte van firstname en lastname
        if(firstname.length < 2 || lastname.length < 2){
            error.missingProperties(res);
            return;
        }

        if (regex.test(email) === true) {
            //Check of email al is geregistreerd
            db.query("SELECT Email FROM user WHERE Email = ?", [email], function(err, result) {
                if(result.length > 0){
                    error.emailExists(res);
                    return;
                }else{
                    db.query("INSERT INTO `user` (Voornaam, Achternaam, Email, Password) VALUES (?, ?, ?, ?)" ,[firstname, lastname, email, password], function(err, result) {
                        db.query("SELECT Voornaam, Achternaam, Email FROM user WHERE Email = ?",[email], function(err, result) {
                            if (err) throw err;
                        })
                    });
                    let token = auth.encodeToken(email);
                    res.json({
                        token: token
                    });
                    return;
                }
            })
        }
        else{
            error.emailIncorrect(res);
            return;
        }
    }
    else{
        error.missingProperties(res);
        return;
    }
});

router.use('/studentenhuis', studentenhuis);

module.exports = router;
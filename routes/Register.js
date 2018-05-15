const express = require('express');
const router = express.Router();
const users = require('../datasource/logins');
const db = require('../datasource/dbConnection');



router.route('/')
    .post( function(req, res) {

        var email = req.body.email || '';
        var password = req.body.password || '';
        var firstname = req.body.firstname || '';
        var lastname = req.body.lastname || '';

        result = users.filter(function (user) {
            if( user.email === email && user.password === password) {
                return ( user );
            }
        });

        let newUser = {
            firstname : firstname,
            lastname : lastname,
            email : email,
            password : password
        };
        users.push(newUser);
        console.log(users);

        // Generate JWT
        if( result[0] ) {
            res.status(401).json({"error":"Deze gebruiker bestaat al!"});
        } else {

            db.query("INSERT INTO `user` (Voornaam, Achternaam, Email, Password) VALUES (?, ?, ?, ?)" ,[firstname, lastname, email, password], function(err, result) {
                db.query("SELECT Voornaam, Achternaam, Email FROM user WHERE Email = ?",[email], function(err, result) {
                    if (err) throw err;
                })
            });
            res.status(200).json({"email" : email, "msg" : "account aangemaakt!"});
        }

    });

module.exports = router;
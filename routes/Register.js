const express = require('express');
const router = express.Router();
const users = require('../datasource/users');



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


            res.status(200).json({"email" : email, "berichtje" : "account aangemaakt!"});
        }

    });

module.exports = router;
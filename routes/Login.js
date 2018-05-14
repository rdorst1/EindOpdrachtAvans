
const express = require('express');
const router = express.Router();
const auth =  require('../auth/authentication');
const users = require('../datasource/users');

// router.all( new RegExp("[^(\/login)]"), function (req, res, next) {
//
//     //
//     console.log("VALIDATE TOKEN")
//
//     var token = (req.header('X-Access-Token')) || '';
//
//     auth.decodeToken(token, (err, payload) => {
//         if (err) {
//             console.log('Error handler: ' + err.message);
//             res.status((err.status || 401 )).json({error: new Error("Not authorised").message});
//         } else {
//             next();
//         }
//     });
// });


router.route('/login')
    .post( function(req, res) {

        //
        // Get body params or ''
        //
        var email = req.body.email || '';
        var password = req.body.password || '';

        //
        // Check in datasource for user & password combo.
        //
        //
        result = users.filter(function (user) {
            if( user.email === email && user.password === password) {
                return ( user );
            }
        });

        // Debug
        console.log("result: " +  JSON.stringify(result[0]));

        // Generate JWT
        if( result[0] ) {
            res.status(200).json({"token" : auth.encodeToken(email), "email" : email});
        } else {
            res.status(401).json({"error":"Invalid credentials, bye"})
        }

    });


module.exports = router;
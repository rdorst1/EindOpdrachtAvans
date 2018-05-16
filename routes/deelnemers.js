const express = require('express');
const router = express.Router({mergeParams: true});
const db = require('../datasource/dbConnection');
const error = require('../errorsHandler/Errors');
const auth = require('../auth/authentication');


router.post('/', (req, res) => {
    let maaltijdId = req.params.maaltijdId || '';
    let huisId = req.params.huisId || '';
    let token = req.get('Authorization');
    token = token.substring(7);
    let email = auth.decodeToken(token);
    email = email.sub;

    db.query("SELECT ID FROM user WHERE email = ?;", [email], function (err, rows, fields) {
        let userId = rows[0].ID;
        console.log(userId);
        console.log(huisId);
        console.log(maaltijdId);

        db.query("SELECT * FROM deelnemers WHERE UserID = ? AND StudentenhuisID = ? AND MaaltijdID = ?;", [userId, huisId, maaltijdId], function (err, result) {
            if (result.length > 0) {
                error.alreadySignedIn(res)
            }
            else {
                db.query("INSERT INTO `deelnemers` (UserID, StudentenhuisID, MaaltijdID) VALUES ('" + userId + "', '" + huisId + "', '"+ maaltijdId + "');", function (err, result) {
                    console.log(result);
                    console.log("insert");
                    db.query("SELECT Voornaam, Achternaam, Email FROM user WHERE ID = ?;", [userId], function (err, result) {
                        if (err) throw err;
                        res.json(result)
                    })
                });
            }
        })
    })
});


router.get('/:deelnemers?', function(req, res)  {
    const maaltijdId = req.params.maaltijdId || '';
    const huisId = req.params.huisId || '';

    db.query("SELECT * FROM maaltijd WHERE ID = ?", [maaltijdId], function(err, result) {
        if (result.length > 0) {
            db.query("SELECT * FROM studentenhuis WHERE ID = ?", [huisId], function (err, result) {
                if (result.length > 0) {
                    db.query("SELECT * FROM deelnemers WHERE StudentenhuisID = ? AND MaaltijdID = ?", [huisId, maaltijdId], function (err, result) {
                        if (err) throw err;
                        res.json(result)
                    })
                }
                else{
                    error.notFound(res)
                }
            })

        }else{
            error.notFound(res)
        }
    })

});




function checkId(houseId, res) {
    db.query("SELECT * FROM studentenhuis WHERE ID = ?", [houseId], function (err, result) {
        if (result.length > 0) {
            console.log("houseId exists");
            return res;
        } else {
            error.notFound(res);
            return res;
        }

    })
}
function checkId2(maaltijdId, res) {
    db.query("SELECT * FROM maaltijd WHERE ID = ?", [maaltijdId], function(err, result)  {
        if (result.length > 0) {
            console.log("maaltijdId exists");
            return res;
        } else {
            error.notFound(res);
            return res;
        }

    })

}

module.exports = router;
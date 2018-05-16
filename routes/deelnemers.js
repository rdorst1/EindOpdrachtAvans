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
                error.userExists(res)
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



router.delete('/', (req , res)=> {
    let maaltijdId = req.params.maaltijdId || '';
    let huisId = req.params.huisId || '';
    let token = req.get('Authorization');
    token = token.substring(7);
    let email = auth.decodeToken(token);
    email = email.sub;

    checkId(huisId,res);
    checkId2(maaltijdId, res);


    db.query("SELECT ID FROM user WHERE email = ?;", [email], function (err, rows, fields) {
        let userId = rows[0].ID;


        db.query("SELECT UserID FROM deelnemers WHERE UserID = ?", [userId], function (err, resu) {
            if (resu.length > 0) {
                db.query("DELETE FROM deelnemers WHERE UserId = ?", userId, function (err, rows) {
                    res.status(200).json({
                        "msg": "deelnemer succesvol verwijderd",
                        "status": "200",
                        "datetime": new Date().format("d-M-Y H:m:s")
                    })
                })
            }
            else{
                error.incorrectRights(res)
            }


        })
    })
});

function checkId(houseId, res) {
    db.query("SELECT * FROM studentenhuis WHERE ID = ?", [houseId], (err, result) => {
        if (result.length > 0) {
            console.log("selectId")
        } else {
            error.notFound(res)
        }
    })
}

function checkId2(maaltijdId, res) {
    db.query("SELECT * FROM maaltijd WHERE ID = ?", [maaltijdId], (err, result) => {
        if (result.length > 0) {
            console.log("selectId")
        } else {
            error.notFound(res)
        }
    })
}

module.exports = router;
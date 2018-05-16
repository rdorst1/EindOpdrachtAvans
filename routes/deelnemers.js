const express = require('express');
const router = express.Router({mergeParams: true});
const db = require('../datasource/dbConnection');
const error = require('../errorsHandler/Errors');
const auth = require('../auth/authentication');

// POST Deelnemer
router.post('/', (req, res) => {
    let maaltijdId = req.params.maaltijdId || '';
    let huisId = req.params.huisId || '';
    let token = req.get('Authorization');
    token = token.substring(7);
    let email = auth.decodeToken(token);
    email = email.sub;

    // Vragende gebruiker's ID wordt opgehaald
    db.query("SELECT ID FROM user WHERE email = ?;", [email], function (err, rows, fields) {
        let userId = rows[0].ID;
        console.log(userId);
        console.log(huisId);
        console.log(maaltijdId);
        // Check of gebruiker niet al ingeschreven staat en geeft een error mee als dat het geval is.
        db.query("SELECT * FROM deelnemers WHERE UserID = ? AND StudentenhuisID = ? AND MaaltijdID = ?;", [userId, huisId, maaltijdId], function (err, result) {
            if (result.length > 0) {
                error.userExists(res)
            }
            else {
                // Voeg gebruiker toe aan de deelnemers en wordt opgeslagen in de database.
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

//GET Deelnemers met huisId en maaltijdId
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
                } else{
                    error.notFound(res)//Error voor als het gevraagde niet kan worden gevonden
                }
            })

        }else{
            error.notFound(res)
        }
    })

});


//DELETE Deelnemer
router.delete('/', (req , res)=> {
    let maaltijdId = req.params.maaltijdId || '';
    let huisId = req.params.huisId || '';
    let token = req.get('Authorization');
    token = token.substring(7);
    let email = auth.decodeToken(token);
    email = email.sub;

    //Check of huisId en maaltijdId bestaan
    checkId(huisId,res);
    checkId2(maaltijdId, res);

// Haal ID op van vragende gebruiker
    db.query("SELECT ID FROM user WHERE email = ?;", [email], function (err, rows, fields) {
        let userId = rows[0].ID;

        // Check of userId in deelnemers staat en verwijder.
        db.query("SELECT UserID FROM deelnemers WHERE UserID = ?", [userId], function (err, resu) {
            if (resu.length > 0) {
                db.query("DELETE FROM deelnemers WHERE UserId = ?", userId, function (err, rows) {
                    res.status(200).json({
                        "msg": "deelnemer succesvol verwijderd",
                        "status": "200",
                        "datetime": new Date().format("d-M-Y H:m:s")
                        //Als de deelnemer succesvol is verwijderd wordt dat weergegeven met daarbij de datum en tijd.
                    })
                })
            } else{
                error.incorrectRights(res)//Error als de gebruiker niet de correcte rechten heeft.
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
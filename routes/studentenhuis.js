const express = require('express');
const router = express.Router();
const maaltijd = require('./maaltijd');
const db = require('../datasource/dbConnection');
const format = require('node.date-time');
const error = require('../errorsHandler/Errors');
const auth = require('../auth/authentication');


// POST Studentenhuis in de vorm: { "name:<name>", "address":"<address>" }
router.post('/', (req, res) => {
    let name = req.body.name || '';
    let address = req.body.address || '';

    // Authorisatie
    let token = req.get('Authorization');
    token = token.substring(7);
    let email = auth.decodeToken(token);
    email = email.sub;

    if (name !== '' && address !== '') {
        db.query("SELECT ID FROM user WHERE email = ?", [email], function (err, rows, fields) {
            if (err) throw err;
            let userId = rows[0].ID;

            db.query("INSERT INTO `studentenhuis` (Naam, Adres, UserID) VALUES (?, ?, ?)", [name, address, userId], function (err, rows, fields) {
                if (err) throw err;
                let row = rows.insertId;
                selectId(row, res)
            });
        })
    } else {
        error.missingProperties(res)
    }
});
// GET ALL Studentenhuis
router.get('/', (req, res) => {
    db.query("SELECT * FROM studentenhuis", (err, result) => {
        if (err) throw err;
        res.json(result)
    });
});
// GET Studentenhuis met houseId
router.get('/:houseId?', (req, res) => {
    const houseId = req.params.houseId || '';
    if (houseId) {
        selectId(houseId, res)
    }
});

//PUT Studentenhuis, overwrite een Studentenhuis
router.put('/:houseId', (req, res) => {
    let houseId = req.params.houseId || '';
    let name = req.body.name || '';
    let address = req.body.address || '';

    let token = req.get('Authorization');
    token = token.substring(7);
    let email = auth.decodeToken(token);
    email = email.sub;

    if (houseId && name !== '' && address !== '') {
        //Get vragende gebruiker
        db.query("SELECT ID FROM user WHERE Email = ?", [email], function (err, rows) {
            let currentUserId = rows[0].ID;

            //Get makende gebruiker
            checkId(houseId, res);
            db.query("SELECT UserID FROM studentenhuis WHERE ID = ?", [houseId], function (err, rows) {
                let existingUserId = rows[0].UserID;
                // Vergelijk vragende met gebruiker
                if (currentUserId == existingUserId) {
                    db.query("UPDATE studentenhuis SET naam = ?, adres = ? WHERE ID = ?", [name, address, houseId], function (err, result) {
                        selectId(houseId, res)
                    })
                }else{
                    error.incorrectRights(res)
                }
            })
        })
    } else {
        error.missingProperties(res)
    }
});

//DELETE Studentenhuis met houseId
router.delete('/:houseId', (req, res) => {
    let houseId = req.params.houseId || '';

    let token = req.get('Authorization');
    token = token.substring(7);
    let email = auth.decodeToken(token);
    email = email.sub;


    //Get vragende gebruiker
    db.query("SELECT ID FROM user WHERE Email = ?", [email], function (err, rows) {
        let currentUserId = rows[0].ID;

        //Get makende gebruiker
        checkId(houseId, res);
        db.query("SELECT UserID FROM studentenhuis WHERE ID = ?", [houseId], function (err, rows) {
            let existingUserId = rows[0].UserID;
            //Vergelijk vragende met makende gebruiker
            if (currentUserId == existingUserId) {
                db.query("DELETE FROM studentenhuis WHERE ID = ?", [houseId], function (err, result) {
                    res.status(200).json({
                        "message": "Huis succesvol verwijderd",
                        "status": "200",
                        "datetime": new Date().format("d-M-Y H:m:s")
                    })
                })
            }else{
                error.incorrectRights(res)
            }
        })
    })
});


function selectId(houseId, res) {
    db.query("SELECT * FROM studentenhuis WHERE ID = ?", [houseId], (err, result) => {
        if (result.length > 0) {
            res.json(result);
        } else {
            error.notFound(res)
        }
    })
}

function checkId(houseId,res){
    db.query("SELECT * FROM studentenhuis WHERE ID = ?", [houseId], (err, result) => {
        if (result.length > 0) {
            console.log("exists")
        } else {
            error.notFound(res)
        }
    })
}

router.use('/:huisId/maaltijd', maaltijd);

module.exports = router;
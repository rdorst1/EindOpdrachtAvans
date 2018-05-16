const express = require('express');
const router = express.Router({mergeParams: true});
const deelnemers = require('./deelnemers');
const db = require('../datasource/dbConnection');
const format = require('node.date-time');
const error = require('../errorsHandler/Errors');
const auth = require('../auth/authentication');
const studentenhuis = require('./studentenhuis');


router.post('/', (req, res) => {
    let HouseId = req.params.huisId || '';
    let Name = req.body.name || '';
    let Desc = req.body.beschrijving || '';
    let Ingredients = req.body.ingredienten || '';
    let Allergies = req.body.allergie || '';
    let Price = req.body.prijs || '';

    let token = req.get('Authorization');
    token = token.substring(7);
    let email = auth.decodeToken(token);
    email = email.sub;

    if (Name !== '' && Desc !== '' && Ingredients !== '' && Allergies !== '' && Price !== '') {
        db.query("SELECT ID FROM user WHERE email = ?", [email], function (err, rows, fields) {
            let userId = rows[0].ID;

            checkId(HouseId, res);
            db.query("INSERT INTO `maaltijd` (Naam, Beschrijving, Ingredienten, Allergie, Prijs, UserID, StudentenhuisID) VALUES (?, ?, ?, ?, ?, ?, ?)", [Name, Desc, Ingredients, Allergies, Price, userId, HouseId], function (err, rows, fields) {
                if (err) throw err;
                db.query("SELECT Naam, Beschrijving, Ingredienten, Allergie, Prijs FROM `maaltijd` WHERE Naam = ? AND StudentenhuisID = ?", [Name, HouseId], function (err, result, ){
                    if (err) throw err;
                    res.json(result)
                })
            });
        })
    } else {
        error.missingProperties(res)
    }
});

router.get('/', (req, res)=> {
    let HouseId = req.params.huisId || '';
    console.log(HouseId);
    checkId(HouseId, res);
    db.query("SELECT ID, Naam, Beschrijving, Ingredienten, Allergie, Prijs FROM maaltijd WHERE StudentenhuisID = ?", [HouseId], (err, result) => {
        if (result.length > 0) {
            console.log("selectId");
            res.json(result)
        } else {
            error.noResults(res)
        }
    })
});

router.get('/:maaltijdId?', (req, res)=> {
    let HouseId = req.params.huisId || '';
    checkId(HouseId, res);
    let maaltijdId = req.params.maaltijdId || '';
    db.query("SELECT ID, Naam, Beschrijving, Ingredienten, Allergie, Prijs FROM maaltijd WHERE ID = ? AND StudentenhuisID = ?", [maaltijdId, HouseId], (err, result) => {
        if (result.length > 0) {
            console.log("selectId");
            res.json(result)
        } else {
            error.notFound(res)
        }
    })
});

router.put('/:maaltijdId', (req, res) => {
    let maaltijdId = req.params.maaltijdId || '';
    let houseId = req.params.huisId || '';
    let Name = req.body.name || '';
    let Desc = req.body.description || '';
    let Ingredients = req.body.ingredients || '';
    let Allergies = req.body.allergies || '';
    let Price = req.body.price || '';

    let token = req.get('Authorization');
    token = token.substring(7);
    let email = auth.decodeToken(token);
    email = email.sub;

    if (Name !== '' && Desc !== '' && Ingredients !== '' && Allergies !== '' && Price !== '') {
        //Get Current user ID
        db.query("SELECT ID FROM user WHERE Email = ?", [email], function (err, rows) {
            let currentUserId = rows[0].ID;

            //Get existing user ID
            checkId(houseId, res);
            db.query("SELECT UserID FROM maaltijd WHERE ID = ?", [maaltijdId], function (err, rows) {
                let existingUserId = rows[0].UserID;

                if (currentUserId === existingUserId) {
                    db.query("UPDATE maaltijd SET Naam = ?, Beschrijving = ?, Ingredienten = ?, Allergie = ?, Prijs = ? WHERE ID = ?", [Name, Desc, Ingredients, Allergies, Price, maaltijdId], function (err, result) {
                        console.log(result);
                        db.query("SELECT ID, Naam, Beschrijving, Ingredienten, Allergie, Prijs FROM maaltijd WHERE ID = ? ", [maaltijdId], (err, result) => {
                            res.json(result)
                        })
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

router.delete('/:maaltijdId', (req, res) => {
    let maaltijdId = req.params.maaltijdId || '';
    let houseId = req.params.huisId || '';

    db.query("SELECT * FROM maaltijd WHERE ID = ?", [maaltijdId], (err, result) => {
        if (result.length > 0) {
            //Get Current user ID
            let token = req.get('Authorization');
            token = token.substring(7);
            let email = auth.decodeToken(token);
            email = email.sub;
            db.query("SELECT ID FROM user WHERE Email = ?", [email], function (err, rows) {
                let currentUserId = rows[0].ID;

                //Get existing user ID
                checkId(houseId, res);
                db.query("SELECT UserID FROM maaltijd WHERE ID = ?", [maaltijdId], function (err, rows) {
                    let existingUserId = rows[0].UserID;

                    if (currentUserId === existingUserId) {
                        db.query("DELETE FROM maaltijd WHERE ID = ?", [maaltijdId], function (err, result) {
                            res.status(200).json({
                                "msg": "maaltijd succesvol verwijderd",
                                "status": "200",
                                "datetime": new Date().format("d-M-Y H:m:s")
                            })
                        })
                    }else{
                        error.incorrectRights(res)
                    }
                })
            })

        } else {
            error.notFound(res)
        }
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



router.use('/:maaltijdId/deelnemers', deelnemers);

module.exports = router;
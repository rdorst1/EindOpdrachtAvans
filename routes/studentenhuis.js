const express = require('express');
const router = express.Router();
const db = require('../datasource/dbConnection');
const auth =  require('../auth/authentication');


router.get('/', (req, res) => {
    db.query("SELECT * FROM studentenhuis;", function (err, result) {
        if (err) throw err;
        console.log(result);
        res.status(200).json(result);
    });
});

//
// studentenhuis
//

router.route('/')
    .post((req, res) => {
        let naam = req.body.naam;
        let adres = req.body.adres;
        let userId = req.body.userId || '';

        if(naam && adres) {
            db.query("INSERT INTO studentenhuis (Naam, Adres, UserID) VALUES ('" + naam + "', '" + adres + "', " + userId + ");", function (err, result) {
                if (err) {
                    res.status(401).json({"bericht": "Het studentenhuis is niet succesvol toegevoegd"});
                    throw err;
                }
                ;
                console.log(result);
                res.status(200).json({"bericht": "Het studentenhuis is succesvol toegevoegd"});
            });
        } else {
            res.status(401).json({"bericht": "Het studentenhuis is niet succesvol toegevoegd"});
        }
    });

router.get('/:huisId', (req, res) => {
    const huisId = req.params.huisId || '';

    db.query("SELECT * FROM studentenhuis WHERE ID = " + huisId + ";", function (err, result) {
        if (err) throw err;
        console.log(result);
        res.status(200).json(result);
    });
});

router.put('/:huisId', (req, res) => {
    const huisId = req.params.huisId || '';
    let naam = req.body.naam || '';
    let adres = req.body.adres || '';
    let userId = req.body.userId || '';

    db.query("INSERT INTO studentenhuis (ID, Naam, Adres, UserID) VALUES (" + huisId + ", '" + naam + "', '" + adres + "', " + userId + ");", function (err, result) {
        if (err) {
            res.status(401).json({"bericht: ": "Het studentenhuis is niet succesvol toegevoegd"});
            throw err;
        }
        ;
        console.log(result);
        res.status(200).json({"bericht": "Het studentenhuis is succesvol toegevoegd"});
    });
});

router.delete('/:huisId', (req, res, next) => {
    const huisId = req.params.huisId || '';

    db.query("DELETE FROM studentenhuis WHERE ID = " + huisId + ";", function (err, result) {
        if (err) {
            res.status(401).json({"bericht": "Het studentenhuis is niet verwijderd"});
            throw err;
        }
        console.log(result);
        res.status(200).json({"bericht": "Het studentenhuis is succesvol verwijderd"});
    });
});

//
//maaltijden
//

router.route('/:huisId/maaltijd')
    .post((req, res) => {
        const huisId = req.params.huisId || '';
        let maaltijdId = req.body.maaltijdId || '';
        let naam = req.body.naam || '';
        let beschrijving = req.body.beschrijving || '';
        let ingredienten = req.body.ingredienten || '';
        let allergie = req.body.allergie|| '';
        let prijs = req.body.prijs || '';
        let userId = req.body.userId || '';

        db.query("INSERT INTO maaltijd (ID, Naam, Beschrijving, Ingredienten, Allergie, Prijs, UserID, StudentenhuisID) VALUES ("+ maaltijdId +", '"+ naam +"', '"+ beschrijving +"', '"+ ingredienten +"', '"+ allergie +"', "+ prijs +", "+ userId +", "+ huisId +");", function (err, result) {
            if (err) {
                res.status(401).json({"bericht: ": "De maaltijd is niet succesvol toegevoegd"});
                throw err;
            };
            console.log(result);
            res.status(200).json({"bericht": "de maaltijd is succesvol toegevoegd"});
        });
    });

router.get('/:huisId/maaltijd', (req, res) => {
    const huisId = req.params.huisId || '';

    db.query("SELECT * FROM maaltijd WHERE StudentenhuisId = " + huisId + ";", function (err, result) {
        if (err) throw err;
        console.log(result);
        res.status(200).json(result);
    });
});

router.get('/:huisId/maaltijd/:maaltijdId', (req, res) => {
    const huisId = req.params.huisId || '';
    const maaltijdId = req.params.maaltijdId || '';

    db.query("SELECT * FROM maaltijd WHERE ID = " + maaltijdId + " AND StudentenhuisId = " + huisId + ";", function (err, result) {
        if (err) throw err;
        console.log(result);
        res.status(200).json(result);
    });
});

router.put('/:huisId/maaltijd/:maaltijdId', (req, res) => {
    const huisId = req.params.huisId || '';
    const maaltijdId = req.params.maaltijdId || '';
    let naam = req.body.naam || '';
    let beschrijving = req.body.beschrijving || '';
    let ingredienten = req.body.ingredienten || '';
    let allergie = req.body.allergie|| '';
    let prijs = req.body.prijs || '';
    let userId = req.body.userId || '';

    db.query("INSERT INTO maaltijd (ID, Naam, Beschrijving, Ingredienten, Allergie, Prijs, UserID, StudentenhuisID) VALUES ("+ maaltijdId +", '"+ naam +"', '"+ beschrijving +"', '"+ ingredienten +"', '"+ allergie +"', "+ prijs +", "+ userId +", "+ huisId +");", function (err, result) {
        if (err) {
            res.status(401).json({"bericht: ": "De maaltijd is niet succesvol toegevoegd"});
            throw err;
        };
        console.log(result);
        res.status(200).json({"bericht": "de maaltijd is succesvol toegevoegd"});
    });
});

router.delete('/:huisId/maaltijd/:maaltijdId', (req, res) => {
    const huisId = req.params.huisId || '';
    const maaltijdId = req.params.maaltijdId || '';

    db.query("DELETE FROM maaltijd WHERE StudentenhuisID = " + huisId + " AND ID = " + maaltijdId + ";", function (err, result) {
        if (err) {
            res.status(401).json({"bericht": "De maaltijd is niet verwijderd"});
            throw err;
        }
        console.log(result);
        res.status(200).json({"bericht": "De maaltijd is succesvol verwijderd"});
    });
});


//
// deelnemers
//

router.route('/:huisId/maaltijd/:maaltijdId')
    .post((req, res) => {
        const huisId = req.params.huisId || '';
        const maaltijdId = req.params.maaltijdId || '';
        let userId = req.body.userId || '';

        db.query("INSERT INTO deelnemers (UserID, StudentenhuisID, MaaltijdID) VALUES ("+ userId +", "+ huisId +", "+ maaltijdId +");", function (err, result) {
            if (err) {
                res.status(401).json({"bericht": "De deelnemer is niet toegevoegd"});
                throw err;
            }
            console.log(result);
            res.status(200).json({"bericht": "De deelnemer is succesvol toegevoegd"});
        });
    });

router.get('/:huisId/maaltijd/:maaltijdId/deelnemers', (req, res) => {
    const huisId = req.params.huisId || '';
    const maaltijdId = req.params.maaltijdId || '';

    db.query("SELECT * FROM `view_deelnemers` WHERE MaaltijdID = " + maaltijdId + " AND StudentenhuisId = " + huisId + ";", function (err, result) {
        if (err) throw err;
        console.log(result);
        res.status(200).json(result);
    });
});


router.delete('/:huisId/maaltijd/:maaltijdId/deelnemers', (req, res) => {
    const huisId = req.params.huisId || '';
    const maaltijdId = req.params.maaltijdId || '';
    var token = (req.header('X-Access-Token')) || '';
    let userId = '';

    const data = auth.decodeToken(token, (err, payload) => {
        if (err) {
            console.log('Error handler: ' + err.message);
            res.status((err.status || 401 )).json({error: new Error("Not authorised").message});
        } else{
            const username = payload.sub;
            console.log(username);

            db.query("SELECT ID FROM user WHERE Email = '" + username + "';", (err, result) => {
                if (err) {
                    res.status(401).json({"bericht": "De username bestaat niet"});
                    throw err;
                }
                let string = JSON.stringify(result);
                x = JSON.parse(string);
                userId = x[0]['ID'];
                console.log(userId);

                db.query("DELETE FROM deelnemers WHERE StudentenhuisID = " + huisId + " AND MaaltijdID = " + maaltijdId + " AND UserID = " + userId + ";", function (err, result) {
                    if (err) {
                        res.status(401).json({"bericht": "De deelnemer is niet verwijderd"});
                        throw err;
                    }
                    console.log(result);
                    res.status(200).json({"bericht": "De deelnemer is succesvol verwijderd"});
                });
            });
        };
    });
});


//
// Fall back, display some info
//
router.all('*', (req, res) => {

});

module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../datasource/dbConnection');

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

router.get('/huisnummer', (req, res, next) => {

});

router.put('/:huisId', (req, res, next) => {

});

router.delete('/:huisId', (req, res, next) => {

});

//
//maaltijden
//

router.route('/:huisId/maaltijd')
    .post((req, res, next) => {

    });

router.get('/huisId/maaltijd', (req, res, next) => {

});

router.get('/huisId/maaltijd/:maaltijdId', (req, res, next) => {

});

router.put('/huisId/maaltijd/:maaltijdId', (req, res, next) => {

});

router.delete('/huisId/maaltijd/:maaltijdId', (req, res, next) => {

});


//
// deelnemers.
//

router.route('/:huisId/maaltijd/:maaltijdId')
    .post((req, res, next) => {

    });

router.get('/huisId/maaltijd/:maaltijdId/deelnemers', (req, res, next) => {

});

router.delete('/huisId/maaltijd/:maaltijdId/deelnemers', (req, res, next) => {

});


//
// Fall back, display some info.
//
router.all('*', (req, res) => {

});

module.exports = router;
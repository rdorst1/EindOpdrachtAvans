const express = require('express');
const router = express.Router();

router.get('*', (req, res) => {
    res.status(200)
    res.json({
        "description":"Studentenhuis Project 1.0.0"
    });
});

router.get('*', (req, resp) => {
   resp.json({
       'msg':'test'
   });
});

module.exports = router;
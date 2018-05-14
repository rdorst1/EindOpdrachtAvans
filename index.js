var http = require('http');
var express = require('express');

var app = express();

app.all('*', function(req, res, next) {
    console.log(req.method + " " + req.url);
    next();
});

app.post('/apiv1/studentenhuis')

app.get('/apiv1/studentenhuis', function(req, res, next) {
    res.contentType('application/json');
    res.json( {"msg":"Studentenhuis."} );
});

app.listen(9090, function() {
    console.log('The magic happens at http://localhost:9090');
});
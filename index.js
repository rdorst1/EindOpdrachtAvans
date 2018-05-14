const express = require('express');
const app = express();
const config = require('./config.json');
const bodyParser = require('body-parser');

app.set('PORT', config.webPort);
app.set('SECRET_KEY', config.secretkey);

app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

app.all('*', function(req, res, next){
    console.log( req.method + " " + req.url);
    next();
});

app.use(express.static(__dirname + '/public'));

// Routing with versions
app.use('/api', require('./routes/Login'));
app.use('/api/studentenhuis', require('./routes/studentenhuis'));
app.use('/api/register', require('./routes/Register'));

// Start the server
const port = process.env.PORT || 9090;

app.listen(port, function() {
    console.log('http://localhost:' + port);
});

module.exports = app;
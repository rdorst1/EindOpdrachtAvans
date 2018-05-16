const express = require('express');
let app = express();
const expressJWT = require('express-jwt');
const api = require('./routes/api');
const config = require('./config');
const bodyParser = require('body-parser');
const error = require('./errorsHandler/Errors');

app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());

app.use(expressJWT({
    secret: config.secretkey
}).unless({
    path: ['/api/login', '/api/register']
}));

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError'){
        error.noAuth(res);
        return;
    }
    next();
});

app.use('/api', api);
app.listen(config.webPort)
module.exports = app;
const express = require('express');
const config = require('./config');
const api = require('./routes/api');

let app = express();

app.use('/api', api);
app.listen(config.port);
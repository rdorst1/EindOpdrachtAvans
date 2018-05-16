const config = require('../config.json');
const moment = require('moment');
const jwt = require('jwt-simple');

//
// Encode (van username naar token)
//
function encodeToken(username) {
    const playload = {
        exp: moment().add(10, 'days').unix(),
        iat: moment().unix(),
        sub: username
    };
    return jwt.encode(playload, config.secretkey);
}

//
// Decode (van token naar username)
//
function decodeToken(token, cb) {

    try {
        const payload = jwt.decode(token, config.secretkey);

        // Check of de token verlopen is.
        const now = moment().unix();

        // Check of de token niet verlopen is.
        if (now > payload.exp) {
            console.log('Token has expired.');
        }
        return payload;

    } catch(err) {
        console.log(err);
    }
}

module.exports = {
    encodeToken,
    decodeToken
};
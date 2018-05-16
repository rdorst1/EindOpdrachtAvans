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

        // Check if the token has expired. To do: Trigger issue in db ..
        const now = moment().unix();

        // Check if the token has expired
        if (now > payload.exp) {
            console.log('Token has expired.');
        }

        // Return
        return payload;

    } catch(err) {
        console.log(err);
    }
}

module.exports = {
    encodeToken,
    decodeToken
};
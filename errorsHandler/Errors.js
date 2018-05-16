//Deze class bevat functies die de errors afhandelen die voor kunnen komen bij de endpoints.

const format = require('node.date-time');//Dit is een datum en tijd formatter. Hiermee kan de tijd dus correct worden meegegeven bij de error.

//Error melding voor incorrecte Authorisatie.
function noAuth(res){
    res.status(401).json({
        "msg": "Niet geautoriseerd (geen valid token).",
        "code": 401,
        "datetime": new Date().format("d/M/Y H:m:S")
    });
}

//Error melding voor als het gevraagde niet kan worden gevonden.
function notFound(res){
    res.status(404).json({
        "msg": "Niet gevonden",
        "code": 404,
        "datetime": new Date().format("d/M/Y H:m:S")
    });
}

//Error melding voor als het gevraagde resultaten niet kan worden gevonden.
function noResults(res){
    res.status(404).json({
        "msg": "Er konden geen resultaten worden gevonden",
        "code": 404,
        "datetime": new Date().format("d/M/Y H:m:S")
    });
}

//Error melding voor als het opgegeven email adres al bestaat.
function emailExists(res){
    res.status(409).json({
        "msg": "Conflict (Deze email is al in gebruik)",
        "code": 409,
        "datetime": new Date().format("d/M/Y H:m:S")
    });
}

//Error melding voor als het opgegeven email adres niet voldoet aan de regex.
function emailIncorrect(res){
    res.status(409).json({
        "msg": "Conflict (Het opgegeven email adres is incorrect)",
        "code": 409,
        "datetime": new Date().format("d/M/Y H:m:S")
    });
}

//Error melding voor als de gebruiker niet voldoende rechten heeft.
function incorrectRights(res){
    res.status(409).json({
        "msg": "Conflict (U hebt niet voldoende rechten om de actie uit te voeren)",
        "code": 409,
        "datetime": new Date().format("d/M/Y H:m:S")
    });
}

//Error melding voor als de gebruiker al ingeschreven staat.
function alreadySignedIn(res){
    res.status(409).json({
        "msg": "Conflict (U al reeds ingeschreven hiervoor)",
        "code": 409,
        "datetime": new Date().format("d/M/Y H:m:S")
    });
}

//Error melding voor als er in de request delen ontbreken
function missingProperties(res){
    res.status(412).json({
        "msg": "Een of meer properties in de request body ontbreken of zijn foutief",
        "code": 412,
        "datetime": new Date().format("d/M/Y H:m:S")
    });
}

module.exports = {
    noAuth,
    notFound,
    noResults,
    emailExists,
    emailIncorrect,
    incorrectRights,
    missingProperties,
    alreadySignedIn
};
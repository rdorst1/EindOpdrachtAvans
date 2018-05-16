//Deze class bevat functies die de errors afhandelen die voor kunnen komen bij de endpoints.

const format = require('node.date-time');//Dit is een datum en tijd formatter. Hiermee kan de tijd dus correct worden meegegeven bij de error.

//Error melding voor incorrecte Authorisatie.
function noAuth(res){
    res.status(401).json({
        "message": "Niet geautoriseerd (geen valid token).",
        "code": 401,
        "datetime": new Date().format("d/M/Y H:m:S")
    });
}

//Error melding voor als het gevraagde niet kan worden gevonden.
function notFound(res){
    res.status(404).json({
        "message": "Niet gevonden",
        "code": 404,
        "datetime": new Date().format("d/M/Y H:m:S")
    });
}

//Error melding voor als het gevraagde resultaten niet kan worden gevonden.
function noResults(res){
    res.status(404).json({
        "message": "Er konden geen resultaten worden gevonden",
        "code": 404,
        "datetime": new Date().format("d/M/Y H:m:S")
    });
}

//Error melding voor als het opgegeven email adres al bestaat.
function emailExists(res){
    res.status(409).json({
        "message": "Conflict (Deze email is al in gebruik)",
        "code": 409,
        "datetime": new Date().format("d/M/Y H:m:S")
    });
}

//Error melding voor als het opgegeven email adres niet voldoet aan de regex.
function emailIncorrect(res){
    res.status(409).json({
        "message": "Conflict (Het opgegeven email adres is incorrect)",
        "code": 409,
        "datetime": new Date().format("d/M/Y H:m:S")
    });
}

//Error melding voor als de gebruiker niet voldoende rechten heeft.
function incorrectRights(res){
    res.status(409).json({
        "message": "Conflict (U hebt niet voldoende rechten om de actie uit te voeren)",
        "code": 409,
        "datetime": new Date().format("d/M/Y H:m:S")
    });
}

//Error melding voor als er in de request delen ontbreken
function missingProperties(res){
    res.status(412).json({
        "message": "Een of meer properties in de request body ontbreken of zijn foutief",
        "code": 412,
        "datetime": new Date().format("d/M/Y H:m:S")
    });
}

//Error melding voor als de deelnemer staat ingeschreven.
function userExists(res) {
    res.status(409).json({
        "msg": "Conflict (U bent al ingeschreven)",
        "code": 409,
        "datetime": new Date().format("d-M-Y H:m:s")
    })

}

module.exports = {
    noAuth,
    notFound,
    noResults,
    emailExists,
    emailIncorrect,
    incorrectRights,
    missingProperties,
    userExists,
};
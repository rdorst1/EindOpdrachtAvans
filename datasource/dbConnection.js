var mysql = require('mysql');
var connectionString = 'mysql://${process.e'

//Connectie naar de heroku database.
var con = mysql.createConnection({
    host : "188.166.109.108",
    user : "studentenhuis_user",
    password : "secret",
    database : "studentenhuis"
});

//Hier wordt aangegeven dat de connectie naar de database is gelukt.
con.connect(function (err) {
    if (err) throw err;
    console.log("You are connected to the database!");
});

module.exports = con;
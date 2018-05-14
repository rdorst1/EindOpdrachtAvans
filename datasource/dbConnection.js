var mysql = require('mysql');

var con = mysql.createConnection({
    host : "localhost",
    user : "studentenhuis_user",
    password : "secret",
    database : "studentenhuis"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("You are connected to the database!");
});

module.exports = con;
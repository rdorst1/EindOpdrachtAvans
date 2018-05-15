var mysql = require('mysql');
var connectionString = 'mysql://${process.e'

var con = mysql.createConnection({
    host : "188.166.109.108",
    user : "studentenhuis_user",
    password : "secret",
    database : "studentenhuis"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("You are connected to the database!");
});

module.exports = con;
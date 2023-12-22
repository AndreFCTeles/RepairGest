let mysql = require('mysql');

let con = mysql.createConnection({
   host: "localhost",
   //user: "yourusername",
   password: "e2017lectrex"
});

con.connect(function (err) {
   if (err) throw err;
   console.log("Connected!");
});
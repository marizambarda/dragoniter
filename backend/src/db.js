const mysql = require('mysql2');

const con = mysql.createConnection({
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'twitter',
});

con.connect(function (err) {
  if (err) throw err;
  console.log('Connected!');
});

module.exports = con.promise();

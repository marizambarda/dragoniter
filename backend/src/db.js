const mysql = require('mysql2');
const { ConnectionString } = require('connection-string');

const obj = new ConnectionString(
  process.env.CLEARDB_DATABASE_URL || process.env.DATABASE_URL
);

const config = {
  host: obj.host,
  user: obj.user,
  password: obj.password,
  database: obj.path.toString()
};

if (process.env.DATABASE_SOCKET_PATH) {
  config.socketPath = process.env.DATABASE_SOCKET_PATH;
}

const con = mysql.createConnection(config);

con.connect(function (err) {
  if (err) throw err;
  console.log('Connected!');
});

module.exports = con.promise();

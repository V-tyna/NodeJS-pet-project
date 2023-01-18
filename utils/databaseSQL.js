const mysql = require('mysql2');
const { MYSQL_PASSWORD } = require('../configs/keys.dev');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'node-complete-schwarzmuller',
  password: MYSQL_PASSWORD
});

module.exports = pool.promise();

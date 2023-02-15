const keys = require('../configs/keys');
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'node-complete-schwarzmuller',
  password: keys.MYSQL_PASSWORD
});

module.exports = pool.promise();

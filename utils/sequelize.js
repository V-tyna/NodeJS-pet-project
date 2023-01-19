const { Sequelize } = require('sequelize');
const { MYSQL_PASSWORD } = require('../configs/keys.dev');

const sequelize = new Sequelize(
	'node-complete-schwarzmuller',
	'root',
	MYSQL_PASSWORD,
	{
		dialect: 'mysql',
		host: 'localhost',
	}
);

module.exports = sequelize;

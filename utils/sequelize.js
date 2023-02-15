const { Sequelize } = require('sequelize');

const keys = require('../configs/keys');

const sequelize = new Sequelize(
	'node-complete-schwarzmuller',
	'root',
	keys.MYSQL_PASSWORD,
	{
		dialect: 'mysql',
		host: 'localhost',
	}
);

module.exports = sequelize;

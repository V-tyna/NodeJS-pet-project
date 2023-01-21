const { DataTypes } = require('sequelize');

const sequelize = require('../../utils/sequelize');

const Order = sequelize.define('order', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true
  },
  address: {
    type: DataTypes.STRING
  }
});

module.exports = Order;

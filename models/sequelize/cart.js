const { DataTypes } = require('sequelize');

const sequelize = require('../../utils/sequelize');

const Cart = sequelize.define('cart', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true
  },
  
});

module.exports = Cart;

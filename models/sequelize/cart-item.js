const { DataTypes } = require('sequelize');

const sequelize = require('../../utils/sequelize');

const CartItem = sequelize.define('cartItem', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = CartItem;

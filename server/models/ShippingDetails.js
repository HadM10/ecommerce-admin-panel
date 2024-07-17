// models/ShippingDetail.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const Order = require('./Order');

const ShippingDetail = sequelize.define('ShippingDetail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Order,
      key: 'id',
    },
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  postalCode: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = ShippingDetail;

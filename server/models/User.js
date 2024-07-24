const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const User = sequelize.define(
  'User',
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(
        'general_admin',
        'product_manager',
        'order_manager',
        'customer_service',
        'delivery'
      ),
      allowNull: false,
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // New users are not approved by default
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpire: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = User;

const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const User = require('./User'); // Import User model

const AdminLog = sequelize.define('AdminLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  action: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = AdminLog;

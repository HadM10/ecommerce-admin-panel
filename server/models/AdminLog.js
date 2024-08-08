const { DataTypes } = require('sequelize');
const sequelize = require('./db'); // Your database connection file
const User = require('./User'); // Import the User model

const AdminLog = sequelize.define(
  'AdminLog',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    action: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    details: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    paranoid: true,
    timestamps: true,
    indexes: [
      {
        unique: false,
        fields: ['adminId'],
      },
      {
        unique: false,
        fields: ['createdAt'],
      },
      {
        unique: false,
        fields: ['deletedAt'],
      },
    ],
  }
);

module.exports = AdminLog;

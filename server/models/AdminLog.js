const { DataTypes } = require('sequelize');
const sequelize = require('./db'); // Your database connection file

const AdminLog = sequelize.define(
  'AdminLog',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Username of the admin who performed the action',
    },
    action: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Description of the action performed by the admin',
    },
    details: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Additional details about the action, such as affected records',
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'IP address from which the action was performed',
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "User agent string of the admin's browser or client",
    },
    isNotification: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Indicates whether the log entry should trigger a notification',
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
        fields: ['username'],
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
    comment:
      'Logs of all actions performed by admins, including details and metadata',
  }
);

module.exports = AdminLog;

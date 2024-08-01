const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const ClientUser = require('./ClientUser'); // Import ClientUser model

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: ClientUser, // Reference to ClientUser model
      key: 'id',
    },
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Shipped', 'Delivered', 'Archived'),
    allowNull: false,
    defaultValue: 'Pending',
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  trackingNumber: {
    type: DataTypes.STRING,
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
});

// Define associations
ClientUser.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(ClientUser, { foreignKey: 'userId' });

module.exports = Order;

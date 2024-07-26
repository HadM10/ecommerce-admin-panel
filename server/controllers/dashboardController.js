const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/ClientUser'); // Adjust if the model name is different
const Category = require('../models/Category');
const OrderItem = require('../models/OrderItem');
const AdminLog = require('../models/AdminLog');
const sequelize = require('../models/db');

// Get Dashboard Summary
exports.getDashboardSummary = async (req, res) => {
  try {
    const totalOrders = await Order.count();
    const totalProducts = await Product.count();
    const totalUsers = await User.count();
    const totalCategories = await Category.count();

    const summary = {
      totalOrders,
      totalProducts,
      totalUsers,
      totalCategories,
    };

    res.status(200).json(summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Most Sold Products
exports.getMostSoldProducts = async (req, res) => {
  try {
    const mostSoldProducts = await OrderItem.findAll({
      attributes: [
        'productId',
        [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQuantity'],
      ],
      group: ['productId'],
      order: [[sequelize.fn('SUM', sequelize.col('quantity')), 'DESC']],
      limit: 10,
      include: [{ model: Product, attributes: ['name'] }],
      raw: true,
    });

    res.status(200).json(mostSoldProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Most Sold Categories
exports.getMostSoldCategories = async (req, res) => {
  try {
    const mostSoldCategories = await OrderItem.findAll({
      attributes: [
        'productId',
        [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQuantity'],
      ],
      group: ['productId'],
      order: [[sequelize.fn('SUM', sequelize.col('quantity')), 'DESC']],
      include: [
        {
          model: Product,
          attributes: [],
          include: [{ model: Category, attributes: ['name'] }],
        },
      ],
      raw: true,
    });

    const categoryStats = mostSoldCategories.reduce((acc, item) => {
      const categoryName = item['Product.Category.name'];
      if (!acc[categoryName]) acc[categoryName] = 0;
      acc[categoryName] += parseFloat(item.totalQuantity);
      return acc;
    }, {});

    const sortedCategories = Object.entries(categoryStats).sort(
      (a, b) => b[1] - a[1]
    );

    res.status(200).json(sortedCategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Sales Overview
exports.getSalesOverview = async (req, res) => {
  try {
    const salesOverview = await OrderItem.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('price')), 'totalSales'],
        [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQuantity'],
      ],
      include: [
        {
          model: Order,
          attributes: [],
          where: { status: 'completed' },
        },
      ],
      raw: true,
    });

    res.status(200).json(salesOverview[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Recent Activity
exports.getRecentActivity = async (req, res) => {
  try {
    // Check if the AdminLog model is available
    if (!AdminLog) {
      throw new Error('AdminLog model is not defined');
    }

    // Fetch recent admin logs
    const recentLogs = await AdminLog.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10,
    });

    // Return the logs in the response
    res.status(200).json(recentLogs);
  } catch (error) {
    // Log the full error details for debugging
    console.error('Error fetching recent activity:', error.message);

    // Return a generic server error response
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

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
      include: [
        {
          model: Product,
          attributes: ['name'],
        },
      ],
      raw: true,
    });

    const result = mostSoldProducts.map((item) => ({
      productId: item.productId,
      productName: item['Product.name'],
      totalQuantity: parseFloat(item.totalQuantity), // Ensure it's a number
    }));

    res.status(200).json(result);
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

exports.getSalesOverview = async (req, res) => {
  try {
    const salesOverview = await OrderItem.findAll({
      attributes: [
        [
          sequelize.fn(
            'DATE_FORMAT',
            sequelize.col('OrderItem.createdAt'),
            '%Y-%m'
          ),
          'month',
        ],
        [sequelize.fn('SUM', sequelize.col('OrderItem.price')), 'totalSales'],
      ],
      include: [
        {
          model: Order,
          attributes: [], // No need to select any attributes from Order
          where: { status: 'Delivered' },
        },
      ],
      group: [
        sequelize.fn(
          'DATE_FORMAT',
          sequelize.col('OrderItem.createdAt'),
          '%Y-%m'
        ),
      ],
      order: [
        [
          sequelize.fn(
            'DATE_FORMAT',
            sequelize.col('OrderItem.createdAt'),
            '%Y-%m'
          ),
          'ASC',
        ],
      ],
      raw: true,
    });

    // Convert result to include numeric values for total sales
    const result = salesOverview.map((item) => ({
      month: item.month,
      totalSales: parseFloat(item.totalSales), // Convert to number if needed
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching sales overview:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to get daily sales overview
exports.getDailySalesOverview = async (req, res) => {
  try {
    const dailySalesOverview = await OrderItem.findAll({
      attributes: [
        [
          sequelize.fn(
            'DATE_FORMAT',
            sequelize.col('OrderItem.createdAt'),
            '%Y-%m-%d'
          ),
          'date',
        ],
        [sequelize.fn('SUM', sequelize.col('OrderItem.price')), 'totalSales'],
      ],
      include: [
        {
          model: Order,
          attributes: [], // No need to select any attributes from Order
          where: { status: 'Delivered' },
        },
      ],
      group: [
        sequelize.fn(
          'DATE_FORMAT',
          sequelize.col('OrderItem.createdAt'),
          '%Y-%m-%d'
        ),
      ],
      order: [
        [
          sequelize.fn(
            'DATE_FORMAT',
            sequelize.col('OrderItem.createdAt'),
            '%Y-%m-%d'
          ),
          'ASC',
        ],
      ],
      raw: true,
    });

    // Convert result to include numeric values for total sales
    const result = dailySalesOverview.map((item) => ({
      date: item.date,
      totalSales: parseFloat(item.totalSales), // Convert to number if needed
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching daily sales overview:', error);
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

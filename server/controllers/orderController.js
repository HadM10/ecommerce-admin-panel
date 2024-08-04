const { Op } = require('sequelize');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const ClientUser = require('../models/ClientUser');
const Product = require('../models/Product');

// Get all orders with associated order items and client user details
const getAllOrders = async (req, res) => {
  const { status, dateFrom, dateTo, search, sort } = req.query;
  let whereClause = {};
  let orderClause = [];

  // Filter by order status
  if (status) {
    whereClause.status = status;
  }

  // Filter by date range
  if (dateFrom && dateTo) {
    whereClause.createdAt = {
      [Op.between]: [new Date(dateFrom), new Date(dateTo)],
    };
  }

  // Search by various fields
  if (search) {
    whereClause[Op.or] = [
      { '$ClientUser.firstName$': { [Op.like]: `%${search}%` } },
      { '$ClientUser.lastName$': { [Op.like]: `%${search}%` } },
      { '$ClientUser.email$': { [Op.like]: `%${search}%` } },
      { '$ClientUser.phoneNumber$': { [Op.like]: `%${search}%` } },
      { '$ClientUser.address$': { [Op.like]: `%${search}%` } },
      { status: { [Op.like]: `%${search}%` } },
    ];
  }

  // Sorting logic
  switch (sort) {
    case 'newest':
      orderClause = [['createdAt', 'DESC']];
      break;
    case 'oldest':
      orderClause = [['createdAt', 'ASC']];
      break;
    case 'priceHighLow':
      orderClause = [['totalAmount', 'DESC']];
      break;
    case 'priceLowHigh':
      orderClause = [['totalAmount', 'ASC']];
      break;
    default:
      orderClause = [['createdAt', 'DESC']]; // Default to newest first
  }

  try {
    const orders = await Order.findAll({
      where: whereClause,
      order: orderClause,
      include: [
        {
          model: OrderItem,
          include: [Product], // Fetch associated product details within order items
        },
        {
          model: ClientUser,
          attributes: [
            'id',
            'firstName',
            'lastName',
            'email',
            'phoneNumber',
            'address',
          ],
        },
      ],
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch orders: ${error.message}` });
  }
};

// Get order by ID with associated order items and client user details
const getOrderById = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: OrderItem,
          include: [Product], // Fetch associated product details within order items
        },
        {
          model: ClientUser,
          attributes: [
            'id',
            'firstName',
            'lastName',
            'email',
            'phoneNumber',
            'address',
          ],
        },
      ],
    });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch order: ${error.message}` });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to update order status: ${error.message}` });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await order.destroy();
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: `Failed to delete order: ${error.message}` });
  }
};

// Create a new order
const createOrder = async (req, res) => {
  const { userId, status, totalAmount, trackingNumber, orderItems } = req.body;

  try {
    // Create the order
    const order = await Order.create({
      userId,
      status,
      totalAmount,
      trackingNumber,
    });

    // Create associated order items
    if (orderItems && Array.isArray(orderItems)) {
      await Promise.all(
        orderItems.map((item) =>
          OrderItem.create({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })
        )
      );
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: `Failed to create order: ${error.message}` });
  }
};

const archiveOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByPk(orderId); // Use findByPk instead of findById

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = 'Archived';
    await order.save();

    res.status(200).json({ message: 'Order archived successfully' });
  } catch (error) {
    console.error('Error archiving order:', error); // Log the full error
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  createOrder,
  archiveOrder,
};

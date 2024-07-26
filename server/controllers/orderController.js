const { Order } = require('../models/Order');

// Fetch all orders or a single order by ID
exports.getOrders = async (req, res) => {
  try {
    const orders = req.params.orderId
      ? await Order.findByPk(req.params.orderId)
      : await Order.findAll();
    if (orders) {
      res.json(orders);
    } else {
      res.status(404).json({ message: 'No orders found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create order', error });
  }
};

// Update an existing order's status
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.orderId);
    if (order) {
      await order.update(req.body);
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Failed to update order', error });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.orderId);
    if (order) {
      await order.destroy();
      res.json({ message: 'Order deleted successfully' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

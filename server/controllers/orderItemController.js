const { OrderItem } = require('../models/OrderItem');

// Fetch all order items or a single order item by ID
exports.getOrderItems = async (req, res) => {
  try {
    const orderItems = req.params.orderItemId
      ? await OrderItem.findByPk(req.params.orderItemId)
      : await OrderItem.findAll();
    if (orderItems) {
      res.json(orderItems);
    } else {
      res.status(404).json({ message: 'No order items found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new order item
exports.createOrderItem = async (req, res) => {
  try {
    const orderItem = await OrderItem.create(req.body);
    res.status(201).json(orderItem);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create order item', error });
  }
};

// Update an existing order item
exports.updateOrderItem = async (req, res) => {
  try {
    const orderItem = await OrderItem.findByPk(req.params.orderItemId);
    if (orderItem) {
      await orderItem.update(req.body);
      res.json(orderItem);
    } else {
      res.status(404).json({ message: 'Order item not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Failed to update order item', error });
  }
};

// Delete an order item
exports.deleteOrderItem = async (req, res) => {
  try {
    const orderItem = await OrderItem.findByPk(req.params.orderItemId);
    if (orderItem) {
      await orderItem.destroy();
      res.json({ message: 'Order item deleted successfully' });
    } else {
      res.status(404).json({ message: 'Order item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

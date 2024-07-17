const OrderItem = require('../models/OrderItem');

exports.getAllOrderItems = async (req, res) => {
  try {
    const orderItems = await OrderItem.findAll();
    res.json(orderItems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order items' });
  }
};

exports.getOrderItemById = async (req, res) => {
  try {
    const orderItem = await OrderItem.findByPk(req.params.id);
    if (orderItem) {
      res.json(orderItem);
    } else {
      res.status(404).json({ error: 'Order item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order item' });
  }
};

exports.createOrderItem = async (req, res) => {
  try {
    const { order_id, product_id, quantity } = req.body;
    const newOrderItem = await OrderItem.create({ order_id, product_id, quantity });
    res.status(201).json(newOrderItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order item' });
  }
};

exports.updateOrderItem = async (req, res) => {
  try {
    const { order_id, product_id, quantity } = req.body;
    const [updated] = await OrderItem.update({ order_id, product_id, quantity }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedOrderItem = await OrderItem.findByPk(req.params.id);
      res.json(updatedOrderItem);
    } else {
      res.status(404).json({ error: 'Order item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order item' });
  }
};

exports.deleteOrderItem = async (req, res) => {
  try {
    const deleted = await OrderItem.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).json({ message: 'Order item deleted' });
    } else {
      res.status(404).json({ error: 'Order item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order item' });
  }
};

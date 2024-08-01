const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// GET all orders
router.get('/', orderController.getAllOrders);

// GET order by ID
router.get('/:orderId', orderController.getOrderById);

// PUT update order status
router.put('/:orderId', orderController.updateOrderStatus);

// DELETE order
router.delete('/:orderId', orderController.deleteOrder);

// POST create a new order
router.post('/create', orderController.createOrder);

// PUT archive order
router.put('/archive/:orderId', orderController.archiveOrder);

module.exports = router;

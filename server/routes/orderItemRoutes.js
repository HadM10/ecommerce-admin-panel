const express = require('express');
const router = express.Router();
const orderItemController = require('../controllers/orderItemController');

// OrderItem routes
router.get('/:orderItemId?', orderItemController.getOrderItems);
router.post('/', orderItemController.createOrderItem);
router.put('/:orderItemId', orderItemController.updateOrderItem);
router.delete('/:orderItemId', orderItemController.deleteOrderItem);

module.exports = router;

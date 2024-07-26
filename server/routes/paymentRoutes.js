const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Payment routes
router.get('/:paymentId?', paymentController.getPayments);
router.post('/', paymentController.createPayment);
router.put('/:paymentId', paymentController.updatePayment);
router.delete('/:paymentId', paymentController.deletePayment);

module.exports = router;

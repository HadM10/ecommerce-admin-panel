const express = require('express');
const router = express.Router();
const shippingDetailController = require('../controllers/shippingDetailsController');

// ShippingDetail routes
router.get('/:shippingDetailId?', shippingDetailController.getShippingDetails);
router.post('/', shippingDetailController.createShippingDetail);
router.put('/:shippingDetailId', shippingDetailController.updateShippingDetail);
router.delete('/:shippingDetailId', shippingDetailController.deleteShippingDetail);

module.exports = router;

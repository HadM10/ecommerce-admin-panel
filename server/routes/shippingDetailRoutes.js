const express = require('express');
const shippingDetailsController = require('../controllers/shippingDetailsController');

const router = express.Router();

router.get('/', shippingDetailsController.getAllShippingDetails);
router.get('/:id', shippingDetailsController.getShippingDetailsById);
router.post('/', shippingDetailsController.createShippingDetails);
router.put('/:id', shippingDetailsController.updateShippingDetails);
router.delete('/:id', shippingDetailsController.deleteShippingDetails);

module.exports = router;

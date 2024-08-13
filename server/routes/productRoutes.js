const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Adjust path as necessary
const productController = require('../controllers/productController');

// Routes for products with authentication middleware applied
router.get('/', auth, productController.getAllProducts);
router.get('/:id', auth, productController.getProductById);
router.post('/', auth, productController.createProduct);
router.put('/:id', auth, productController.updateProduct);
router.delete('/:id', auth, productController.deleteProduct);

module.exports = router;

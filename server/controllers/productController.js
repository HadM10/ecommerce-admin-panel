const Product = require('../models/Product');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Category }],
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category }],
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stockQuantity,
      imageUrl,
      status,
      sku,
      categoryId,
    } = req.body;
    const newProduct = await Product.create({
      name,
      description,
      price,
      stockQuantity,
      imageUrl,
      status,
      sku,
      categoryId,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stockQuantity,
      imageUrl,
      status,
      sku,
      categoryId,
    } = req.body;
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await product.update({
      name,
      description,
      price,
      stockQuantity,
      imageUrl,
      status,
      sku,
      categoryId,
    });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await product.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

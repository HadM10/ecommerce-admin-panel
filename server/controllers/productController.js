const Product = require('../models/Product');
const Category = require('../models/Category');
const AdminLogController = require('./adminLogController');

// Get all products with search and filter functionality
exports.getAllProducts = async (req, res) => {
  try {
    const { search, category, priceMin, priceMax } = req.query;
    let query = {};

    if (search) {
      query.name = { [Op.iLike]: `%${search}%` }; // Case-insensitive search by product name
    }
    if (category) {
      query.categoryId = category;
    }
    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price[Op.gte] = priceMin;
      if (priceMax) query.price[Op.lte] = priceMax;
    }

    const products = await Product.findAll({
      where: query,
      include: [Category],
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [Category],
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      categoryId,
      stockQuantity,
      imageUrl,
      status,
      sku,
    } = req.body;
    const newProduct = await Product.create({
      name,
      description,
      price,
      categoryId,
      stockQuantity,
      imageUrl,
      status,
      sku,
    });
    res.status(201).json(newProduct);

    // Log the add product action
    try {
      await AdminLogController.createLog(
        req.user.username, // Use the username from the middleware
        `${req.user.username} added a new product ${name}`,
        { productName: name }, // Details
        true // Notification flag
      );
    } catch (logError) {
      console.error('Error logging action:', logError);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an existing product
exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      categoryId,
      stockQuantity,
      imageUrl,
      status,
      sku,
    } = req.body;
    const [updated] = await Product.update(
      {
        name,
        description,
        price,
        categoryId,
        stockQuantity,
        imageUrl,
        status,
        sku,
      },
      { where: { id: req.params.id } }
    );

    if (!updated) return res.status(404).json({ message: 'Product not found' });

    const updatedProduct = await Product.findByPk(req.params.id, {
      include: [Category],
    });
    res.json(updatedProduct);
    // Log the update product action
    try {
      await AdminLogController.createLog(
        req.user.username, // Use the username from the middleware
        `${req.user.username} updated product ${name}`,
        { productName: name }, // Details
        true // Notification flag
      );
    } catch (logError) {
      console.error('Error logging action:', logError);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    // Fetch the product by ID first to get the name
    const product = await Product.findOne({ where: { id: req.params.id } });

    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Delete the product
    await Product.destroy({ where: { id: req.params.id } });

    // Log the delete product action
    try {
      await AdminLogController.createLog(
        req.user.username, // Use the username from the middleware
        `${req.user.username} deleted product ${product.name}`, // Use product name here
        { productName: product.name }, // Details
        true // Notification flag
      );
    } catch (logError) {
      console.error('Error logging action:', logError);
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

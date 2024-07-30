const Product = require('../models/Product');
const Category = require('../models/Category');

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
        const { name, description, price, categoryId, stockQuantity, imageUrl, status, sku } = req.body;
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
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an existing product
exports.updateProduct = async (req, res) => {
    try {
        const { name, description, price, categoryId, stockQuantity, imageUrl, status, sku } = req.body;
        const [updated] = await Product.update(
            { name, description, price, categoryId, stockQuantity, imageUrl, status, sku },
            { where: { id: req.params.id } }
        );

        if (!updated) return res.status(404).json({ message: 'Product not found' });

        const updatedProduct = await Product.findByPk(req.params.id, {
            include: [Category],
        });
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const deleted = await Product.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

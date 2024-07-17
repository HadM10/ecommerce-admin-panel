// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const sequelize = require('./models/db');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const orderItemRoutes = require('./routes/orderItemRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartItemRoutes = require('./routes/cartItemRoutes'); // Import cartItemRoutes
const paymentRoutes = require('./routes/paymentRoutes'); // Import paymentRoutes
const shippingDetailRoutes = require('./routes/shippingDetailRoutes'); // Import shippingDetailRoutes
const adminLogRoutes = require('./routes/adminLogRoutes'); // Import adminLogRoutes

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/order-items', orderItemRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart-items', cartItemRoutes); // Add cart items routes
app.use('/api/payments', paymentRoutes); // Add payments routes
app.use('/api/shipping-details', shippingDetailRoutes); // Add shipping details routes
app.use('/api/admin-logs', adminLogRoutes); // Add admin logs routes

app.get('/', (req, res) => {
  res.send('API is running...');
});

sequelize.sync()
  .then(() => {
    console.log('Database synced');
  })
  .catch((err) => {
    console.error('Unable to sync the database:', err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

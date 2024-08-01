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
const cartItemRoutes = require('./routes/cartItemRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const shippingDetailRoutes = require('./routes/shippingDetailRoutes');
const adminLogRoutes = require('./routes/adminLogRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const ClientUserRoutes = require('./routes/clientUserRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/order-items', orderItemRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart-items', cartItemRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/shipping-details', shippingDetailRoutes);
app.use('/api/admin-logs', adminLogRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/client-users', ClientUserRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Sync Database and Start Server
sequelize
  .sync()
  .then(() => {
    console.log('Database synced');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error('Unable to sync the database:', err);
  });

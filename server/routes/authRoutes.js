const express = require('express');
const router = express.Router();
const { register, login, getUser } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Register a new user
router.post('/register', register);

// Login a user
router.post('/login', login);

// Get user info
router.get('/', auth, getUser);

module.exports = router;

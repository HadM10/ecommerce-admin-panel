const express = require('express');
const router = express.Router();
const clientUserController = require('../controllers/clientUserController');
const authMiddleware = require('../middleware/auth'); // Assumes you have a middleware for authentication

// POST register a new user
router.post('/register', clientUserController.register);

// POST sign in a user
router.post('/signin', clientUserController.signIn);

// PUT update user information
router.put('/update', authMiddleware, clientUserController.updateUser);

module.exports = router;

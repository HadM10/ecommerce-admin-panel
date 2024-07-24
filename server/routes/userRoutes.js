const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/register', userController.registerUser); // Register a new user
router.post('/login', userController.loginUser); // Login user
router.get('/', userController.getAllUsers); // Get all users
router.get('/:id', userController.getUserById); // Get user by ID
router.put('/:id', userController.updateUser); // Update user
router.delete('/:id', userController.deleteUser); // Delete user

module.exports = router;

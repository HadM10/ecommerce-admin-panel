const express = require('express');
const router = express.Router();
const clientUserController = require('../controllers/clientUserController');

// Register a new client user
router.post('/register', clientUserController.register);

// Sign in an existing client user
router.post('/signin', clientUserController.signIn);

// Update client user information (requires authentication)
router.put('/update', clientUserController.updateUser);

// Get all client users (requires authentication, typically for admin use)
router.get('/', clientUserController.getAllUsers);

// Get a specific client user by ID (requires authentication)
router.get('/:id', clientUserController.getUserById);

// Delete a client user (requires authentication)
router.delete('/:id', clientUserController.deleteUser);

// Suspend a client user (requires authentication)
router.put('/suspend/:id', clientUserController.suspendUser);

// Reactivate a suspended client user (requires authentication)
router.put('/reactivate/:id', clientUserController.reactivateUser);

module.exports = router;

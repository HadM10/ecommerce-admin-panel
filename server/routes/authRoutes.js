const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getUser,
  approveUser,
  getUnapprovedAdmins,
  blockUser,
  getAdmins,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const auth = require('../middleware/auth');

// Register a new user
router.post('/register', register);

// Login a user
router.post('/login', login);

// Forgot Password
router.post('/forgot-password', forgotPassword);

// Reset Password
router.post('/reset-password', resetPassword);

// Get user info
router.get('/', auth, getUser);

// Approve a user
router.put('/approve/:id', auth, approveUser);

// Fetch unapproved admins (requires general_admin role)
router.get('/unapproved-admins', auth, getUnapprovedAdmins);

// Block user
router.put('/block/:id', auth, blockUser);

//Get Admins
router.get('/admins', auth, getAdmins);

module.exports = router;

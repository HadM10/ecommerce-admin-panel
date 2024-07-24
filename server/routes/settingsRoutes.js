const express = require('express');
const router = express.Router();
const {
  updateAdminDetails,
  changePassword,
} = require('../controllers/settingsController');
const auth = require('../middleware/auth');

// Route to update admin details
router.put('/update-details', auth, updateAdminDetails);

// Route to change password
router.put('/change-password', auth, changePassword);

module.exports = router;

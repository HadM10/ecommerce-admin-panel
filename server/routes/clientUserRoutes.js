const express = require('express');
const router = express.Router();
const { registerClientUser, loginClientUser } = require('../controllers/clientUserController');

router.post('/register', registerClientUser);
router.post('/login', loginClientUser);

// Add other client user-related routes as needed

module.exports = router;

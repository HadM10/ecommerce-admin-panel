// routes/adminLogRoutes.js
const express = require('express');
const router = express.Router();
const adminLogController = require('../controllers/adminLogController');

// Routes for AdminLog
router.post('/', adminLogController.createLog); // Create a new log
router.get('/', adminLogController.getAllLogs); // Get all logs
router.get('/:id', adminLogController.getLogById); // Get a single log by ID
router.put('/restore/:id', adminLogController.restoreLog); // Update a log entry
router.delete('/:id', adminLogController.deleteLog); // Delete a log entry

module.exports = router;

// controllers/adminLogController.js
const AdminLog = require('../models/AdminLog');
const User = require('../models/User');

// Create a new admin log entry
exports.createLog = async (req, res) => {
  try {
    const { adminId, action, details } = req.body;
    
    // Validate adminId exists
    const admin = await User.findByPk(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const newLog = await AdminLog.create({ adminId, action, details });
    res.status(201).json(newLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all admin logs
exports.getAllLogs = async (req, res) => {
  try {
    const logs = await AdminLog.findAll();
    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single log by ID
exports.getLogById = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await AdminLog.findByPk(id);
    
    if (!log) {
      return res.status(404).json({ message: 'Log not found' });
    }
    
    res.status(200).json(log);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a log entry
exports.updateLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, details } = req.body;

    const log = await AdminLog.findByPk(id);
    if (!log) {
      return res.status(404).json({ message: 'Log not found' });
    }

    log.action = action || log.action;
    log.details = details || log.details;
    await log.save();

    res.status(200).json(log);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a log entry (soft delete)
exports.deleteLog = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await AdminLog.findByPk(id);
    
    if (!log) {
      return res.status(404).json({ message: 'Log not found' });
    }

    await log.destroy(); // Soft delete
    res.status(200).json({ message: 'Log deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const AdminLog = require('../models/AdminLog');
const User = require('../models/User');

// Create a new admin log entry
exports.createLog = async (
  username,
  action,
  details = {},
  isNotification = true
) => {
  try {
    // Validate that the admin exists
    const admin = await User.findOne({ where: { username } });
    if (!admin) {
      console.error('Admin not found');
      throw new Error('Admin not found');
    }

    // Create the log entry
    await AdminLog.create({
      username,
      action,
      details,
      isNotification,
      createdAt: new Date(), // Add timestamp
    });

    console.log('Log created successfully');
  } catch (error) {
    console.error('Error creating log:', error);
    throw error;
  }
};

// Get all admin logs with optional filtering and pagination
exports.getAllLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, username } = req.query;

    const whereClause = username ? { username } : {};
    const offset = (page - 1) * limit;

    const logs = await AdminLog.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit, 10),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      totalLogs: logs.count,
      totalPages: Math.ceil(logs.count / limit),
      currentPage: parseInt(page, 10),
      logs: logs.rows,
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
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
    console.error('Error fetching log:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Soft delete a log entry
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
    console.error('Error deleting log:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Restore a soft-deleted log entry
exports.restoreLog = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await AdminLog.findByPk(id, { paranoid: false });

    if (!log || log.deletedAt === null) {
      return res.status(404).json({ message: 'Log not found or not deleted' });
    }

    await log.restore();
    res.status(200).json({ message: 'Log restored successfully' });
  } catch (error) {
    console.error('Error restoring log:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

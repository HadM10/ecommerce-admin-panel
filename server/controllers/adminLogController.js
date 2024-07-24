const AdminLog = require('../models/AdminLog');

exports.getAllAdminLogs = async (req, res) => {
  try {
    const adminLogs = await AdminLog.findAll();
    res.json(adminLogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin logs' });
  }
};

exports.getAdminLogById = async (req, res) => {
  try {
    const adminLog = await AdminLog.findByPk(req.params.id);
    if (adminLog) {
      res.json(adminLog);
    } else {
      res.status(404).json({ error: 'Admin log not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin log' });
  }
};

exports.createAdminLog = async (req, res) => {
  try {
    const { adminId, action } = req.body;
    const newAdminLog = await AdminLog.create({ adminId, action });
    res.status(201).json(newAdminLog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create admin log' });
  }
};

exports.updateAdminLog = async (req, res) => {
  try {
    const { adminId, action } = req.body;
    const [updated] = await AdminLog.update({ adminId, action }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedAdminLog = await AdminLog.findByPk(req.params.id);
      res.json(updatedAdminLog);
    } else {
      res.status(404).json({ error: 'Admin log not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update admin log' });
  }
};

exports.deleteAdminLog = async (req, res) => {
  try {
    const deleted = await AdminLog.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).json({ message: 'Admin log deleted' });
    } else {
      res.status(404).json({ error: 'Admin log not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete admin log' });
  }
};

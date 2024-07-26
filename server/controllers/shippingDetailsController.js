const { ShippingDetail } = require('../models/ShippingDetails');

// Fetch all shipping details or a single shipping detail by ID
exports.getShippingDetails = async (req, res) => {
  try {
    const details = req.params.shippingDetailId
      ? await ShippingDetail.findByPk(req.params.shippingDetailId)
      : await ShippingDetail.findAll();
    if (details) {
      res.json(details);
    } else {
      res.status(404).json({ message: 'No shipping details found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new shipping detail
exports.createShippingDetail = async (req, res) => {
  try {
    const detail = await ShippingDetail.create(req.body);
    res.status(201).json(detail);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create shipping detail', error });
  }
};

// Update existing shipping detail
exports.updateShippingDetail = async (req, res) => {
  try {
    const detail = await ShippingDetail.findByPk(req.params.shippingDetailId);
    if (detail) {
      await detail.update(req.body);
      res.json(detail);
    } else {
      res.status(404).json({ message: 'Shipping detail not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Failed to update shipping detail', error });
  }
};

// Delete a shipping detail
exports.deleteShippingDetail = async (req, res) => {
  try {
    const detail = await ShippingDetail.findByPk(req.params.shippingDetailId);
    if (detail) {
      await detail.destroy();
      res.json({ message: 'Shipping detail deleted successfully' });
    } else {
      res.status(404).json({ message: 'Shipping detail not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

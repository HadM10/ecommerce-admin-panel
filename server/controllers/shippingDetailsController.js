const ShippingDetails = require('../models/ShippingDetails');

exports.getAllShippingDetails = async (req, res) => {
  try {
    const shippingDetails = await ShippingDetails.findAll();
    res.json(shippingDetails);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shipping details' });
  }
};

exports.getShippingDetailsById = async (req, res) => {
  try {
    const shippingDetails = await ShippingDetails.findByPk(req.params.id);
    if (shippingDetails) {
      res.json(shippingDetails);
    } else {
      res.status(404).json({ error: 'Shipping details not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shipping details' });
  }
};

exports.createShippingDetails = async (req, res) => {
  try {
    const { order_id, address, city, state, postal_code, country } = req.body;
    const newShippingDetails = await ShippingDetails.create({ order_id, address, city, state, postal_code, country });
    res.status(201).json(newShippingDetails);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create shipping details' });
  }
};

exports.updateShippingDetails = async (req, res) => {
  try {
    const { order_id, address, city, state, postal_code, country } = req.body;
    const [updated] = await ShippingDetails.update({ order_id, address, city, state, postal_code, country }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedShippingDetails = await ShippingDetails.findByPk(req.params.id);
      res.json(updatedShippingDetails);
    } else {
      res.status(404).json({ error: 'Shipping details not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update shipping details' });
  }
};

exports.deleteShippingDetails = async (req, res) => {
  try {
    const deleted = await ShippingDetails.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).json({ message: 'Shipping details deleted' });
    } else {
      res.status(404).json({ error: 'Shipping details not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete shipping details' });
  }
};

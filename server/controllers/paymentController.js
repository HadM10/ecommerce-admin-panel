const { Payment } = require('../models/Payment');

// Fetch all payments or a single payment by ID
exports.getPayments = async (req, res) => {
  try {
    const payments = req.params.paymentId
      ? await Payment.findByPk(req.params.paymentId)
      : await Payment.findAll();
    if (payments) {
      res.json(payments);
    } else {
      res.status(404).json({ message: 'No payments found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new payment
exports.createPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create payment', error });
  }
};

// Update an existing payment
exports.updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.paymentId);
    if (payment) {
      await payment.update(req.body);
      res.json(payment);
    } else {
      res.status(404).json({ message: 'Payment not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Failed to update payment', error });
  }
};

// Delete a payment
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.paymentId);
    if (payment) {
      await payment.destroy();
      res.json({ message: 'Payment deleted successfully' });
    } else {
      res.status(404).json({ message: 'Payment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

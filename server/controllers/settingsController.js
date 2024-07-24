const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.updateAdminDetails = async (req, res) => {
  try {
    const { username, email } = req.body;
    const adminId = req.user.id; // Assuming req.user is set by your auth middleware

    // Find and update the admin details
    const admin = await User.findByPk(adminId);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    admin.username = username;
    admin.email = email;
    await admin.save();

    res.json({ message: 'Details updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating details', error });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.user.id; // Assuming req.user is set by your auth middleware

    // Find the admin
    const admin = await User.findByPk(adminId);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    // Check if current password matches
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Current password is incorrect' });

    // Hash the new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error changing password', error });
  }
};

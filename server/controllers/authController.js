const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const AdminLogController = require('./adminLogController'); // Import the AdminLogController
require('dotenv').config();

exports.register = async (req, res) => {
  const { username, email, password, role, inviteCode } = req.body;

  try {
    // Check if a user with the provided email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Check if a general admin already exists if the role is general_admin
    if (role === 'general_admin') {
      const existingGeneralAdmin = await User.findOne({
        where: { role: 'general_admin' },
      });
      if (existingGeneralAdmin) {
        return res.status(400).json({ msg: 'General admin already exists' });
      }
    }

    // Check invite code if the role is admin or general_admin
    if (
      role === 'general_admin' &&
      inviteCode !== process.env.ADMIN_INVITE_CODE
    ) {
      return res.status(400).json({ msg: 'Invalid invite code' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      isApproved: role === 'general_admin', // Only general admin is approved by default
    });

    // Create and return a JWT
    const payload = {
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      }
    );
    // Log the register action
    try {
      // Assuming `createLog` does not send a response
      await AdminLogController.createLog(
        username,
        `${req.admin.username} registered as ${role}`,
        { username: username },
        true
      );
    } catch (logError) {
      console.error('Error logging action:', logError);
    }
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.approveUser = async (req, res) => {
  const { id } = req.params; // User ID to be approved

  try {
    // Find the user by ID
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if the user is already approved
    if (user.isApproved) {
      return res.status(400).json({ msg: 'User is already approved' });
    }

    // Ensure only general_admin can approve users
    if (req.user.role !== 'general_admin') {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    // Update user approval status
    user.isApproved = true;
    await user.save();

    res.json({ msg: 'User approved successfully' });
  } catch (err) {
    console.error('Approval error:', err); // Log the error for debugging
    res
      .status(500)
      .json({ error: 'An error occurred while approving the user' });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.isApproved = false;
    await user.save();

    res.json({ msg: 'User blocked successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get unapproved admins
exports.getUnapprovedAdmins = async (req, res) => {
  try {
    // Ensure only general_admin can access this endpoint
    if (req.user.role !== 'general_admin') {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    // Fetch unapproved admins
    const unapprovedAdmins = await User.findAll({
      where: { isApproved: false },
    });

    res.json(unapprovedAdmins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAdmins = async (req, res) => {
  try {
    // Fetch all users with their approval status, excluding 'general_admin'
    const users = await User.findAll({
      attributes: ['id', 'username', 'role', 'isApproved'],
      where: {
        role: {
          [Op.ne]: 'general_admin', // Exclude 'general_admin'
        },
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admins', error });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check if user is approved
    if (!user.isApproved) {
      return res.status(403).json({ message: 'Account not approved' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send the token in the response
    res.json({ token });

    // Log the login action
    try {
      // Assuming `createLog` does not send a response
      await AdminLogController.createLog(
        user.username,
        `${user.username} logged in`,
        { username: user.username },
        true
      );
    } catch (logError) {
      console.error('Error logging action:', logError);
    }
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset',
      html: `<p>You requested a password reset</p>
             <p>Click this <a href="http://localhost:3000/reset-password?token=${token}">link</a> to reset your password</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ msg: 'Email sent' });
  } catch (err) {
    console.error('Forgot Password Error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      where: { id: decoded.id, email: decoded.email },
    });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.json({ msg: 'Password reset successful' });
  } catch (err) {
    console.error('Reset Password Error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

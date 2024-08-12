const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminLogController = require('./adminLogController'); // Import the AdminLogController

// Register a new user
exports.registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  const adminId = req.admin.id; // Assuming you have a way to get the adminId

  try {
    const user = await User.findOne({ where: { email } });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    const payload = { user: { id: newUser.id } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      }
    );

    // Log the user registration
    await AdminLogController.createLog(
      adminId,
      `${req.admin.username} registered ${username} as ${role}`,
      { username, email, role },
      true
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  const adminId = req.admin.id; // Assuming you have a way to get the adminId

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );

    // Log the login action
    await AdminLogController.createLog(
      adminId,
      `${req.admin.username} logged in`,
      { username },
      true
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  const adminId = req.admin.id; // Assuming you have a way to get the adminId

  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    user.username = username;
    user.email = email;
    user.role = role;

    await user.save();

    // Log the user update
    await AdminLogController.createLog(
      adminId,
      `${req.admin.username} updated ${username}`,
      { username, email, role },
      true
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const adminId = req.admin.id; // Assuming you have a way to get the adminId

  try {
    const deleted = await User.destroy({
      where: { id: req.params.id },
    });

    if (deleted) {
      // Log the user deletion
      await AdminLogController.createLog(
        adminId,
        `${req.admin.username} deleted user with ID ${req.params.id}`,
        { userId: req.params.id },
        true
      );
      res.status(204).json({ message: 'User deleted' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

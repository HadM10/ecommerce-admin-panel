const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ClientUser = require('../models/ClientUser');

// Register a new client user
const register = async (req, res) => {
  const {
    username,
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    address,
  } = req.body;

  try {
    const existingUser = await ClientUser.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await ClientUser.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
      address,
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ token, user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
};

// Sign in an existing client user
const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await ClientUser.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sign in' });
  }
};

// Update client user information
const updateUser = async (req, res) => {
  const { id } = req.user; // Assumes user ID is in req.user after authentication
  const { firstName, lastName, phoneNumber, address, password } = req.body;

  try {
    const user = await ClientUser.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user information
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.address = address || user.address;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user information' });
  }
};

module.exports = {
  register,
  signIn,
  updateUser,
};

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ClientUser = require('../models/ClientUser');
const Order = require('../models/Order'); // Import ClientUser model
const sequelize = require('../models/db');

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

    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'User account is suspended' });
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

const getAllUsers = async (req, res) => {
  try {
    const {
      searchTerm = '',
      sortKey = 'createdAt',
      sortOrder = 'asc',
      filterStatus = 'all',
    } = req.query;

    // Build the query
    const queryOptions = {
      attributes: [
        'id',
        'username',
        'email',
        'firstName',
        'lastName',
        'status',
        'createdAt',
        [sequelize.fn('COUNT', sequelize.col('Orders.id')), 'totalOrders'],
        [
          sequelize.fn('SUM', sequelize.col('Orders.totalAmount')),
          'totalSpent',
        ],
      ],
      include: [
        {
          model: Order,
          attributes: [], // No need to return order details
          required: false, // Left join to include users with no orders
        },
      ],
      group: ['ClientUser.id'], // Group by user ID to aggregate orders
      raw: true, // Return raw results for easier aggregation
    };

    // Apply filtering by status
    if (filterStatus !== 'all') {
      queryOptions.where = { status: filterStatus };
    }

    // Apply search filter
    if (searchTerm) {
      queryOptions.where = {
        ...queryOptions.where,
        [sequelize.Op.or]: [
          { username: { [sequelize.Op.iLike]: `%${searchTerm}%` } },
          { email: { [sequelize.Op.iLike]: `%${searchTerm}%` } },
          sequelize.where(
            sequelize.fn('concat', sequelize.col('firstName'), ' ', sequelize.col('lastName')),
            { [sequelize.Op.iLike]: `%${searchTerm}%` }
          ),
        ],
      };
    }

    // Apply sorting
    if (['username', 'email', 'createdAt', 'totalOrders', 'totalSpent'].includes(sortKey)) {
      queryOptions.order = [[sortKey, sortOrder]];
    }

    // Fetch users with their order statistics
    const users = await ClientUser.findAll(queryOptions);

    res.json(users);
  } catch (error) {
    console.error('Error fetching users with stats:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get a specific client user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await ClientUser.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Delete a client user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await ClientUser.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Suspend a client user
const suspendUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await ClientUser.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.status = 'suspended';
    await user.save();

    res.status(200).json({ message: 'User suspended successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to suspend user' });
  }
};

// Reactivate a suspended client user
const reactivateUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await ClientUser.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.status = 'active';
    await user.save();

    res.status(200).json({ message: 'User reactivated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reactivate user' });
  }
};

module.exports = {
  register,
  signIn,
  updateUser,
  getAllUsers,
  getUserById,
  deleteUser,
  suspendUser,
  reactivateUser,
};

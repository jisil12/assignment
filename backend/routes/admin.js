const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { User, Store, Rating } = require('../models');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateName, validateEmail, validatePassword, validateAddress } = require('../utils/validation');

const router = express.Router();

router.use(authenticateToken);
router.use(requireRole(['system_admin']));

router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    res.json({
      totalUsers,
      totalStores,
      totalRatings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/users', async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const nameError = validateName(name);
    if (nameError) return res.status(400).json({ error: nameError });

    const emailError = validateEmail(email);
    if (emailError) return res.status(400).json({ error: emailError });

    const passwordError = validatePassword(password);
    if (passwordError) return res.status(400).json({ error: passwordError });

    const addressError = validateAddress(address);
    if (addressError) return res.status(400).json({ error: addressError });

    if (!['system_admin', 'normal_user'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/stores', async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    const nameError = validateName(name);
    if (nameError) return res.status(400).json({ error: nameError });

    const emailError = validateEmail(email);
    if (emailError) return res.status(400).json({ error: emailError });

    const passwordError = validatePassword(password);
    if (passwordError) return res.status(400).json({ error: passwordError });

    const addressError = validateAddress(address);
    if (addressError) return res.status(400).json({ error: addressError });

    const existingStore = await Store.findOne({ where: { email } });
    if (existingStore) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const store = await Store.create({
      name,
      email,
      password: hashedPassword,
      address
    });

    res.status(201).json({
      message: 'Store created successfully',
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: store.averageRating
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const { search, sortBy = 'name', sortOrder = 'ASC', page = 1, limit = 10 } = req.query;
    
    let whereClause = {};
    if (search) {
      whereClause = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { address: { [Op.iLike]: `%${search}%` } },
          { role: { [Op.iLike]: `%${search}%` } }
        ]
      };
    }

    const offset = (page - 1) * limit;
    const users = await User.findAndCountAll({
      where: whereClause,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: offset,
      attributes: { exclude: ['password'] }
    });

    res.json({
      users: users.rows,
      totalCount: users.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(users.count / limit)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/stores', async (req, res) => {
  try {
    const { search, sortBy = 'name', sortOrder = 'ASC', page = 1, limit = 10 } = req.query;
    
    let whereClause = {};
    if (search) {
      whereClause = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { address: { [Op.iLike]: `%${search}%` } }
        ]
      };
    }

    const offset = (page - 1) * limit;
    const stores = await Store.findAndCountAll({
      where: whereClause,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: offset,
      attributes: { exclude: ['password'] }
    });

    res.json({
      stores: stores.rows,
      totalCount: stores.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(stores.count / limit)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/stores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const store = await Store.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.json(store);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Store } = require('../models');
const { validateName, validateEmail, validatePassword, validateAddress } = require('../utils/validation');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', async (req, res) => {
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

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role: 'normal_user'
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, type: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    if (!email || !password || !userType) {
      return res.status(400).json({ error: 'Email, password, and user type are required' });
    }

    let user, tokenData;

    if (userType === 'user') {
      user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      tokenData = { id: user.id, email: user.email, role: user.role, type: 'user' };
    } else if (userType === 'store') {
      user = await Store.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      tokenData = { id: user.id, email: user.email, type: 'store' };
    } else {
      return res.status(400).json({ error: 'Invalid user type' });
    }

    const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'store_owner',
        userType
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) return res.status(400).json({ error: passwordError });

    const isValidPassword = await bcrypt.compare(currentPassword, req.user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid current password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (req.userType === 'user') {
      await User.update({ password: hashedPassword }, { where: { id: req.user.id } });
    } else {
      await Store.update({ password: hashedPassword }, { where: { id: req.user.id } });
    }

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
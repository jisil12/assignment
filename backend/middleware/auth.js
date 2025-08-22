const jwt = require('jsonwebtoken');
const { User, Store } = require('../models');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type === 'user') {
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(403).json({ error: 'Invalid token' });
      }
      req.user = user;
      req.userType = 'user';
    } else if (decoded.type === 'store') {
      const store = await Store.findByPk(decoded.id);
      if (!store) {
        return res.status(403).json({ error: 'Invalid token' });
      }
      req.user = store;
      req.userType = 'store';
    } else {
      return res.status(403).json({ error: 'Invalid token type' });
    }

    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (req.userType === 'user' && roles.includes(req.user.role)) {
      next();
    } else if (req.userType === 'store' && roles.includes('store_owner')) {
      next();
    } else {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
  };
};

module.exports = { authenticateToken, requireRole };
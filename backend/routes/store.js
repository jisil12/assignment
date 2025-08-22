const express = require('express');
const { User, Store, Rating } = require('../models');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);
router.use(requireRole(['store_owner']));

router.get('/dashboard', async (req, res) => {
  try {
    const storeId = req.user.id;
    
    const ratings = await Rating.findAll({
      where: { storeId },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    const averageRating = ratings.length > 0 
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
      : 0;

    res.json({
      averageRating,
      totalRatings: ratings.length,
      ratings: ratings.map(rating => ({
        id: rating.id,
        rating: rating.rating,
        createdAt: rating.createdAt,
        user: {
          id: rating.User.id,
          name: rating.User.name,
          email: rating.User.email
        }
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/ratings', async (req, res) => {
  try {
    const { sortBy = 'createdAt', sortOrder = 'DESC', page = 1, limit = 10 } = req.query;
    const storeId = req.user.id;

    const offset = (page - 1) * limit;
    const ratings = await Rating.findAndCountAll({
      where: { storeId },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: offset
    });

    res.json({
      ratings: ratings.rows.map(rating => ({
        id: rating.id,
        rating: rating.rating,
        createdAt: rating.createdAt,
        user: {
          id: rating.User.id,
          name: rating.User.name,
          email: rating.User.email
        }
      })),
      totalCount: ratings.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(ratings.count / limit)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
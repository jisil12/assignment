const express = require('express');
const { Op } = require('sequelize');
const { User, Store, Rating } = require('../models');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateRating } = require('../utils/validation');

const router = express.Router();

router.use(authenticateToken);
router.use(requireRole(['normal_user']));

router.get('/stores', async (req, res) => {
  try {
    const { search, sortBy = 'name', sortOrder = 'ASC', page = 1, limit = 10 } = req.query;
    
    let whereClause = {};
    if (search) {
      whereClause = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
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
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Rating,
          where: { userId: req.user.id },
          required: false,
          attributes: ['rating']
        }
      ]
    });

    const storesWithUserRating = stores.rows.map(store => ({
      id: store.id,
      name: store.name,
      address: store.address,
      averageRating: parseFloat(store.averageRating) || 0,
      userRating: store.Ratings && store.Ratings.length > 0 ? store.Ratings[0].rating : null
    }));

    res.json({
      stores: storesWithUserRating,
      totalCount: stores.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(stores.count / limit)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/ratings', async (req, res) => {
  try {
    const { storeId, rating } = req.body;

    if (!storeId || !rating) {
      return res.status(400).json({ error: 'Store ID and rating are required' });
    }

    const ratingError = validateRating(rating);
    if (ratingError) return res.status(400).json({ error: ratingError });

    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const existingRating = await Rating.findOne({
      where: { userId: req.user.id, storeId }
    });

    if (existingRating) {
      await existingRating.update({ rating: parseInt(rating) });
    } else {
      await Rating.create({
        userId: req.user.id,
        storeId,
        rating: parseInt(rating)
      });
    }

    const ratings = await Rating.findAll({ where: { storeId } });
    const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    
    await Store.update(
      { averageRating: averageRating.toFixed(1) },
      { where: { id: storeId } }
    );

    res.json({
      message: existingRating ? 'Rating updated successfully' : 'Rating submitted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/ratings/:storeId', async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;

    if (!rating) {
      return res.status(400).json({ error: 'Rating is required' });
    }

    const ratingError = validateRating(rating);
    if (ratingError) return res.status(400).json({ error: ratingError });

    const existingRating = await Rating.findOne({
      where: { userId: req.user.id, storeId }
    });

    if (!existingRating) {
      return res.status(404).json({ error: 'Rating not found' });
    }

    await existingRating.update({ rating: parseInt(rating) });

    const ratings = await Rating.findAll({ where: { storeId } });
    const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    
    await Store.update(
      { averageRating: averageRating.toFixed(1) },
      { where: { id: storeId } }
    );

    res.json({ message: 'Rating updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/my-ratings', async (req, res) => {
  try {
    const ratings = await Rating.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Store,
          attributes: ['id', 'name', 'address']
        }
      ]
    });

    res.json(ratings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
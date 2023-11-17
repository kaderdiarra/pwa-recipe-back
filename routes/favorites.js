const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const mongoose = require('mongoose');

const User = require('../models/user');

router.post('/add', authMiddleware, async (req, res) => {
    try {
        const { mealId } = req.body;
        const userId = req.user.userId;
        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { favoriteMeals: mealId } },
            { new: true }
        );
        res.status(200).json({
            message: 'Meal added to favorites',
            favoriteMeals: user.favoriteMeals
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
  
  // Remove a meal from favorites
  router.post('/remove', authMiddleware, async (req, res) => {
    try {
        const { mealId } = req.body;
        const userId = req.user.userId;
        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { favoriteMeals: mealId } },
            { new: true }
        );
        res.status(200).json({
            message: 'Meal removed from favorites',
            favoriteMeals: user.favoriteMeals
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user's favorite meals
router.get('/list', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Fetch the user with populated favoriteMeals
        const user = await User.findById(userId).populate('favoriteMeals');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ favoriteMeals: user.favoriteMeals });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Check if a user has added a meal to favorites
router.get('/hasAddedToFavorites', authMiddleware, async (req, res) => {
    try {
        const { mealName } = req.query;
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const hasAddedToFavorites = user.favoriteMeals.includes(mealName);
        res.json({ hasAddedToFavorites });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
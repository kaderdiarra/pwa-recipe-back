const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

const User = require('../models/user');
const Meal = require('../models/meal');

// Get meal details with comments by name
router.get('/:name', async (req, res) => {
    try {
        const mealName = req.params.name;

        // Find or create a meal by name
        const meal = await Meal.findOneAndUpdate(
            { name: mealName },
            {},
            { upsert: true, new: true }
        ).populate('comments.author', 'username');

        res.json({ meal });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
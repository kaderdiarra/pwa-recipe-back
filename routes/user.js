const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Get a user's username by ID
router.get('/username/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const username = user.username;
        res.json({ username });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
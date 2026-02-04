const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Message = require('../models/Message');

// Search Users
router.get('/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.json([]);

        // Partial match, case-insensitive
        const users = await User.find({
            username: { $regex: query, $options: 'i' }
        }).select('-password');

        res.json(users);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get Messages for a Room
router.get('/messages/:room', async (req, res) => {
    try {
        const messages = await Message.find({ room: req.params.room })
            .populate('sender', 'username') // Only get username
            .sort({ createdAt: 1 });

        res.json(messages);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Save Message (Internal use or if posted via API)
// router.post('/message', ...) 

module.exports = router;

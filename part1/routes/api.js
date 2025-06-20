const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/dogs', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT Dogs.name AS dog_name, Dogs.size, Users.username AS owner_username
            FROM Dogs JOIN Users ON Dogs.owner_id = Users.user_id
            `);
            res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'DB error', detail: err.message });
    }
});

router.get('walkrequests/open', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT WalkRequests.request_id, Dogs.name AS dog_name, WalkRequests.request_time,
                   WalkRequests.duration_minutes, WalkRequests.location, Users.username AS owner_username
            FROM WalkRequests
            JOIN Dogs ON WalkRequests.dog_id = Dogs.dog_id
            JOIN Users ON Dogs.owner_id = Users.user_id
            WHERE WalkRequests.status = 'open
            `);
            res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'DB error', detail: err.message });
    }
});

router.get('/walkers/summary', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT u.username AS walker_username,
                   COUNT(r.rating_id) AS total_ratings,
                   ROUND(AVG(r.rating), 1) AS average_rating,
                   COUNT(DISTINCT wr.request_id) AS completed_walks
            FROM Users u
            LEFT JOIN WalkRatings r ON u.user_id = r.walker_id
            LEFT JOIN WalkRequests wr ON r.request_id = wr.request_id AND wr.status = 'completed'
            WHERE u.role = 'walker'
            GROUP BY u.username
        `);
        res.json(rows);
    } catch (err) {
        console.error('error is', err.message);
        res.status(500).json({ error: 'DB error', detail: err.message });
    }
});

module.exports = router;
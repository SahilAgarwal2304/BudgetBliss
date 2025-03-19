const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Get All Expenses
router.get('/', (req, res) => {
    db.query('SELECT * FROM expenses', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Add a New Expense
router.post('/', (req, res) => {
    const { user_id, category, amount, date } = req.body;
    db.query('INSERT INTO expenses (user_id, category, amount, date) VALUES (?, ?, ?, ?)', 
        [user_id, category, amount, date], 
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Expense added successfully', id: result.insertId });
    });
});

module.exports = router;

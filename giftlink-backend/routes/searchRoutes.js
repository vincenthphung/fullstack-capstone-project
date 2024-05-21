const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');

// Search for gifts
router.get('/', async (req, res, next) => {
    try {
        // Task 1: Connect to MongoDB
        const db = await connectToDatabase();

        // Initialize the query object
        let query = {};

        // Task 2: Check if the name exists and is not empty
        if (req.query.name && req.query.name.trim() !== '') {
            query.name = { $regex: req.query.name, $options: "i" }; // Using regex for partial match, case-insensitive
        }

        // Task 3: Add other filters to the query
        if (req.query.category) {
            query.category = req.query.category;
        }

        if (req.query.condition) {
            query.condition = req.query.condition;
        }

        if (req.query.age_years) {
            query.age_years = { $lte: parseInt(req.query.age_years) };
        }

        // Task 4: Fetch filtered gifts
        const collection = db.collection('gifts');
        const gifts = await collection.find(query).toArray();

        res.json(gifts);
    } catch (e) {
        next(e);
    }
});

module.exports = router;

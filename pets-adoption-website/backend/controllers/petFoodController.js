// filepath: c:\Users\annem\OneDrive\Desktop\Minor Project\pets-adoption-website\backend\controllers\petFoodController.js
const Food = require('../models/foodModel');

// Add new pet food
exports.addFood = async (req, res) => {
    try {
        const { photo, recipeName, petType, ageRange, price, description } = req.body;
        const newFood = await Food.create({ photo, recipeName, petType, ageRange, price, description });
        res.status(201).json(newFood);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add food' });
    }
};

// Get all pet food
exports.getAllFood = async (req, res) => {
    try {
        const foodItems = await Food.findAll();
        res.status(200).json(foodItems);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch food items' });
    }
};

// Update pet food
exports.updateFood = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedFood = await Food.update(req.body, { where: { id } });
        res.status(200).json(updatedFood);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update food' });
    }
};
// filepath: c:\Users\annem\OneDrive\Desktop\Minor Project\pets-adoption-website\backend\routes\petFoodRoutes.js
const express = require('express');
const router = express.Router();
const petFoodController = require('../controllers/petFoodController');

router.post('/add', petFoodController.addFood); // Add new food
router.get('/', petFoodController.getAllFood); // Get all food
router.put('/update/:id', petFoodController.updateFood); // Update food by ID

module.exports = router;
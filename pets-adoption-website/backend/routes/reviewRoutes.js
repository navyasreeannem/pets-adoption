const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.post('/add', reviewController.addReview); // Add a new review
router.get('/', reviewController.getAllReviews); // Get all reviews

module.exports = router;
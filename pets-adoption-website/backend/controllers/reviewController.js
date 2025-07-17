const Review = require('../models/reviewModel');

// Add a new review
exports.addReview = async (req, res) => {
  try {
    const { userName, userEmail, petName, petType, reviewTitle, content } = req.body;
    const newReview = await Review.create({ userName, userEmail, petName, petType, reviewTitle, content });
    res.status(201).json(newReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add review' });
  }
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll();
    res.status(200).json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};
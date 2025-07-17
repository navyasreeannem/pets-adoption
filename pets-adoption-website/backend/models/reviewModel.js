const { DataTypes } = require('sequelize');
const db = require('./db');

const Review = db.define('Review', {
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  petName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  petType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reviewTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = Review;
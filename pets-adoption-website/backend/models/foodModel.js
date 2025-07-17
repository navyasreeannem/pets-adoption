// filepath: c:\Users\annem\OneDrive\Desktop\Minor Project\pets-adoption-website\backend\models\foodModel.js
const { DataTypes } = require('sequelize');
const db = require('./db');

const Food = db.define('Food', {
    photo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    recipeName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    petType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ageRange: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
});

module.exports = Food;
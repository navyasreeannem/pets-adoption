const { DataTypes } = require('sequelize');
const db = require('./db'); // Import the Sequelize instance

const Doctor = db.define('Doctor', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    specialization: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    photo_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Doctor;
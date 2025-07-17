const { Sequelize } = require('sequelize');
require('dotenv').config();

// Initialize Sequelize with PostgreSQL credentials from the .env file
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres', // Specify PostgreSQL as the database dialect
    port: process.env.DB_PORT,
    logging: false, // Disable logging for cleaner output (optional)
});

// Test the database connection
sequelize
    .authenticate()
    .then(() => console.log('Database connected successfully'))
    .catch((err) => console.error('Error connecting to the database:', err));

module.exports = sequelize;
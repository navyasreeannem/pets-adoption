const { Sequelize } = require('sequelize');
require('dotenv').config();

// Initialize Sequelize with DATABASE_URL from .env
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres', // PostgreSQL
  logging: false,      // optional: disable SQL logs
});

// Test the database connection
sequelize
  .authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.error('Error connecting to the database:', err));

module.exports = sequelize;

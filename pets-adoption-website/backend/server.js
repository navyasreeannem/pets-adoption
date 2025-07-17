const express = require('express');
const cors = require('cors');
const db = require('./models/db'); // Import the Sequelize instance
const authRoutes = require('./routes/authRoutes'); // Import authentication routes
const doctorRoutes = require('./routes/doctorRoutes'); // Import doctor routes
const User = require('./models/userModel'); // Import the User model
const Doctor = require('./models/doctorModel'); // Import the Doctor model
// filepath: c:\Users\annem\OneDrive\Desktop\Minor Project\pets-adoption-website\backend\server.js
const petFoodRoutes = require('./routes/petFoodRoutes'); 
const reviewRoutes = require('./routes/reviewRoutes'); // Import review routes
const adoptionRoutes = require('./routes/adoptionRoutes'); // Import adoption routes
const volunteerRoutes = require('./routes/volunteerRoutes'); // Import volunteer routes


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/doctors', doctorRoutes); // Doctor management routes
app.use('/api/petfood', petFoodRoutes); // Pet food management routes
app.use('/api/reviews', reviewRoutes); // Review routes
app.use('/api/adoptions', adoptionRoutes); // Adoption routes
app.use('/api/volunteer-requests', volunteerRoutes); // Volunteer routes

// Sync the models with the database
db.sync({ alter: true }) // Use alter: true to update the table structure if needed
    .then(() => console.log('Database synced successfully'))
    .catch((err) => console.error('Error syncing the database:', err));

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

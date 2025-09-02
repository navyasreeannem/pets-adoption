const express = require('express');
const cors = require('cors');
const path = require('path'); // ✅ For serving frontend files
const db = require('./models/db'); // Import Sequelize instance

// Import routes
const authRoutes = require('./routes/authRoutes'); 
const doctorRoutes = require('./routes/doctorRoutes'); 
const petFoodRoutes = require('./routes/petFoodRoutes'); 
const reviewRoutes = require('./routes/reviewRoutes'); 
const adoptionRoutes = require('./routes/adoptionRoutes'); 
const volunteerRoutes = require('./routes/volunteerRoutes'); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve the frontend folder (outside backend)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ✅ Default route → signup page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'user', 'signup.html'));
});

// Serve uploads (images etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/petfood', petFoodRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/adoptions', adoptionRoutes);
app.use('/api/volunteer-requests', volunteerRoutes);

// Sync DB
db.sync({ alter: true })
  .then(() => console.log('Database synced successfully'))
  .catch((err) => console.error('Error syncing the database:', err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

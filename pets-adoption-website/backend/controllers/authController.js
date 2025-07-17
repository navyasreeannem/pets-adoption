const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Signup function
const signup = async (req, res) => {
  try {
      const { name, email, password } = req.body;

      console.log('Signup Request Body:', req.body); // Log the incoming request body

      // Check if the user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
          console.log('User already exists:', email); // Log if the user already exists
          return res.status(400).json({ error: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Hashed Password:', hashedPassword); // Log the hashed password

      // Create a new user
      const newUser = await User.create({ name, email, password: hashedPassword });
      console.log('New User Created:', newUser); // Log the created user

      res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
      console.error('Error in signup:', error); // Log the error
      res.status(500).json({ error: 'Signup failed' });
  }
};

// Login function
const login = async (req, res) => {
  try {
      const { email, password } = req.body;

      console.log('Login Request Body:', req.body); // Log the incoming request body

      // Find the user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
          console.log('User not found:', email); // Log if the user is not found
          return res.status(404).json({ error: 'User not found' });
      }

      console.log('User Found:', user); // Log the user details

      // Compare the password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          console.log('Invalid credentials for email:', email); // Log if the password does not match
          return res.status(401).json({ error: 'Invalid credentials' });
      }

      console.log('Password matched for user:', email); // Log if the password matches

      // Generate a JWT token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('Generated JWT Token:', token); // Log the generated token

      res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
      console.error('Error in login:', error.message); // Log the exact error message
      res.status(500).json({ error: 'Failed to log in' });
  }
};
module.exports = { signup, login }; 
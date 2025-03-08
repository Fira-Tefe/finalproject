const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Register a new user
const register = async (req, res) => {
   const { fullName, username, email, password } = req.body; // Add fullName
   try {
      // Check if the user already exists
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
         return res.status(400).json({ message: 'Username or email already exists' });
      }

      // Create a new user
      const user = new User({ fullName, username, email, password }); // Add fullName
      await user.save();

      // Generate a JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Send the token in the response
      res.status(201).json({ token });
   } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
   }
};

// Login a user
const login = async (req, res) => {
   const { username, password } = req.body;
   try {
      // Find the user by username
      const user = await User.findOne({ username });
      if (!user) {
         return res.status(400).json({ message: 'User not found' });
      }

      if (!user || !(await user.comparePassword(password))) {
         return res.status(400).json({ message: 'Invalid credentials' });
      }
      

      // Generate a JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Send the token in the response
      res.status(200).json({ token });
   } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
   }
};

module.exports = { register, login };
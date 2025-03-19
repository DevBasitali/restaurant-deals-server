const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/userModel');

// Register a new user
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let account_status = 'approved';
    if (role === 'restaurant') {
      account_status = 'pending';
    }

    // Create a new user
    const newUser = await User.create({ name, email, password, role, account_status });


    return res.status(201).json({ message: `User created. Admin approval required for role: ${role}` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Login an existing user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user by email
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Check if password matches
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Check if the restaurant is approved by the admin
      if (user.role === 'restaurant' && user.account_status !== 'approved') {
        return res.status(403).json({ message: `Your account is ${user.account_status}. Admin approval required.` });
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      return res.status(200).json({ token, user });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  

// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controller/usersCont');
const verifyToken = require('../middleware/authMiddleware');


router.post('/signup', registerUser, (req, res) => {
    res.json({ message: 'User registered successfully' });
  });

router.post('/login',  loginUser, (req, res) => {
    res.json({ token: 'JWT token' });
  }) 


module.exports = router;

const Restaurant = require('../models/restaurantModel');
const jwt = require('jsonwebtoken');

// Create new restaurant after login
exports.createRestaurant = async (req, res) => {
  try {
    const { name, address, ownerid, subscriptionplan } = req.body;

    // Validate required fields
    if (!name || !owner_id || !address || !subscriptionplan) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Verify user authentication and extract owner_id from the JWT token
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const owner_id = decoded.id;

    // Save restaurant details
    const restaurant = await Restaurant.create({
      name,
      email,
      address,
      owner_id,
      subscription_plan
    });

    return res.status(201).json({
      message: 'Restaurant created successfully',
      restaurant
    });

  } catch (err) {
    return res.status(500).json({ message: 'Error creating restaurant', error: err.message });
  }
};

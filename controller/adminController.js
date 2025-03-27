const Restaurant = require('../models/restaurantModel');
const User = require('../models/restaurantModel');

exports.approveRestaurant = async (req, res) => {
  try {
    const { id } = req.params; // This is the user's ID (the owner)

    // Find the user by ID (owner of the restaurant)
    const user = await User.findById(id);
    if (!user || user.role !== 'restaurant_owner') {
      return res.status(404).json({ message: 'User not found or not a restaurant owner' });
    }

    // Approve the user (restaurant owner)
    user.approvalstatus = 'approved';
    await pool.query('UPDATE users SET approvalstatus = $1 WHERE id = $2', ['approved', id]);

    return res.status(200).json({
      message: 'Restaurant owner approved successfully',
      approvalstatus: user.approvalstatus,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error approving restaurant', error: err.message });
  }
};

// Reject a restaurant (updating the user approval status)
exports.rejectRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the restaurant by ID
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Find and reject the owner (user)
    const user = await User.rejectUser(restaurant.ownerid);
    if (!user) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    return res.status(200).json({
      message: 'Restaurant rejected successfully',
      restaurant,
      userApprovalStatus: user.approvalstatus // Show updated approval status
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error rejecting restaurant', error: err.message });
  }
};

// Ban a restaurant (does not affect the user approval status)
exports.banRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.banRestaurant(id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    return res.status(200).json({ message: 'Restaurant banned successfully', restaurant });
  } catch (err) {
    return res.status(500).json({ message: 'Error banning restaurant', error: err.message });
  }
};

// View all restaurant details
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll();
    return res.status(200).json({ message: 'Restaurants fetched successfully', restaurants });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching restaurants', error: err.message });
  }
};

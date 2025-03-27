const Restaurant = require('../models/restaurantModel');
const User = require('../models/userModel');

// Approve a restaurant (this will approve the user as well)
exports.approveRestaurant = async (req, res) => {
  try {
    const { id } = req.params; // Restaurant ID

    // Find the restaurant by ID
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Find the owner (user) of the restaurant
    const user = await User.findById(restaurant.ownerid);
    if (!user) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    // Approve the user (owner)
    const approvedUser = await User.approveUser(user.id);

    return res.status(200).json({
      message: 'Restaurant approved successfully',
      restaurant,
      userApprovalStatus: approvedUser.approvalstatus // Show the updated approval status
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error approving restaurant', error: err.message });
  }
};

// Reject a restaurant (this will update the user's approval status to "rejected")
exports.rejectRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the restaurant by ID
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Find the owner (user) of the restaurant
    const user = await User.findById(restaurant.ownerid);
    if (!user) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    // Reject the user (owner)
    const rejectedUser = await User.rejectUser(user.id);

    return res.status(200).json({
      message: 'Restaurant rejected successfully',
      restaurant,
      userApprovalStatus: rejectedUser.approvalstatus // Show the updated approval status
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error rejecting restaurant', error: err.message });
  }
};

// Ban a restaurant (this does not affect the user, only the restaurant's status)
exports.banRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    // Ban the restaurant
    const bannedRestaurant = await Restaurant.banRestaurant(id);
    if (!bannedRestaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    return res.status(200).json({
      message: 'Restaurant banned successfully',
      restaurant: bannedRestaurant
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error banning restaurant', error: err.message });
  }
};

// View all restaurant details
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll();
    return res.status(200).json({
      message: 'Restaurants fetched successfully',
      restaurants
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching restaurants', error: err.message });
  }
};

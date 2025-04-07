const Restaurant = require("../models/restaurantModel");

// exports.createRestaurant = async (req, res) => {
//   try {
//     const { name, description, latitude, longitude, address, subscriptionplan } = req.body;

//     // Check if user is an approved restaurant owner
//     if (req.user.role !== 'restaurant_owner' || req.user.approvalstatus !== 'approved') {
//       return res.status(403).json({ message: 'Your account must be approved to create a restaurant' });
//     }

//     // Validate latitude and longitude
//     if (!latitude || !longitude || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
//       return res.status(400).json({ message: 'Invalid or missing coordinates' });
//     }

//     // Ensure required fields are present
//     if (!name || !description || !address || !subscriptionplan || !latitude || !longitude){
//       return res.status(400).json({ message: 'Fields required required' });
//     }

//     // Create the restaurant in the database
//     const restaurant = await Restaurant.create({
//       name,
//       description, // Optional
//       address,     // Optional
//       latitude,
//       longitude,
//       ownerid: req.user.id, // From JWT token
//       subscriptionplan, // Optional
//       status: 'pending', // Default status per your module
//     });

//     return res.status(201).json({ message: 'Restaurant created successfully', restaurant });
//   } catch (err) {
//     console.error('Error creating restaurant:', err);
//     return res.status(500).json({ message: 'Error creating restaurant', error: err.message });
//   }
// };

exports.createRestaurant = async (req, res) => {
  try {
    const { name, description, latitude, longitude, address, subscriptionplan } = req.body;

    if (req.user.role !== 'restaurant_owner' || req.user.approvalstatus !== 'approved') {
      return res.status(403).json({ message: 'Your account must be approved to create a restaurant' });
    }

    if (!latitude || !longitude || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({ message: 'Invalid or missing coordinates' });
    }

    if (!name) {
      return res.status(400).json({ message: 'Restaurant name is required' });
    }

    const restaurant = await Restaurant.create({
      name,
      description,
      address,
      latitude,
      longitude,
      ownerid: req.user.id,
      subscriptionplan,
      ownerApprovalStatus: req.user.approvalstatus, // Pass user's approval status
    });

    return res.status(201).json({ message: 'Restaurant created successfully', restaurant });
  } catch (err) {
    console.error('Error creating restaurant:', err);
    return res.status(500).json({ message: 'Error creating restaurant', error: err.message });
  }
};

exports.getRestaurantDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.getRestaurantById(id, req.user.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found or not yours' });
    }

    return res.status(200).json({ message: 'Restaurant fetched successfully', restaurant });
  } catch (err) {
    console.error('Error fetching restaurant:', err);
    return res.status(500).json({ message: 'Error fetching restaurant', error: err.message });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, latitude, longitude, address, subscriptionplan } = req.body;

    if (req.user.role !== 'restaurant_owner' || req.user.approvalstatus !== 'approved') {
      return res.status(403).json({ message: 'Your account must be approved to update a restaurant' });
    }

    if ((latitude && (latitude < -90 || latitude > 90)) || (longitude && (longitude < -180 || longitude > 180))) {
      return res.status(400).json({ message: 'Invalid coordinates' });
    }

    const restaurant = await Restaurant.updateRestaurant(id, req.user.id, {
      name,
      description,
      address,
      latitude,
      longitude,
      subscriptionplan,
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found or not yours' });
    }

    return res.status(200).json({ message: 'Restaurant updated successfully', restaurant });
  } catch (err) {
    console.error('Error updating restaurant:', err);
    return res.status(500).json({ message: 'Error updating restaurant', error: err.message });
  }
};

exports.deactivateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'restaurant_owner' || req.user.approvalstatus !== 'approved') {
      return res.status(403).json({ message: 'Your account must be approved to deactivate a restaurant' });
    }

    const restaurant = await Restaurant.deactivateRestaurant(id, req.user.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Active restaurant not found or not yours' });
    }

    return res.status(200).json({ message: 'Restaurant deactivated successfully', restaurant });
  } catch (err) {
    console.error('Error deactivating restaurant:', err);
    return res.status(500).json({ message: 'Error deactivating restaurant', error: err.message });
  }
};
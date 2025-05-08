const Restaurant = require("../models/restaurantModel");

const validPlans = ['Basic', 'Pro', 'Premium'];


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

// --subscriptionplan API'

exports.subscribeRestaurant = async (req, res) => {
  const { restaurantId, newPlan } = req.body;
  const ownerId = req.user.id;

  try {
    // Validate plan
    if (!validPlans.includes(newPlan)) {
      return res.status(400).json({ message: "Invalid subscription plan selected" });
    }

    // Find restaurant by id AND ownerId (to ensure owner is updating his own restaurant)
    const restaurant = await Restaurant.findByIdAndOwner(restaurantId, ownerId);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found for this owner" });
    }

    // Update subscription_plan
    const updatedRestaurant = await Restaurant.updateSubscriptionPlan(restaurant.id, newPlan);

    res.status(200).json({
      message: "Subscription plan updated successfully",
      restaurant: updatedRestaurant,
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ message: 'Error updating subscription', error });
  }
};

exports.getCurrentSubscription = async (req, res) => {
  const { restaurantId } = req.params;
  const ownerId = req.user.id;  // from auth middleware

  try {
    // Verify restaurant exists and belongs to owner
    const restaurant = await Restaurant.findByIdAndOwner(restaurantId, ownerId);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found for this owner' });
    }

    res.status(200).json({
      restaurantId: restaurant.id,
      subscriptionPlan: restaurant.subscriptionplan,
    });

  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ message: 'Error fetching subscription', error });
  }
};



const Restaurant = require('../models/userModel');

// Approve restaurant by admin
exports.approveRestaurant = async (req, res) => {
    const { restaurantId } = req.params;
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(restaurantId, { status: "approved" });
        if (!restaurant) {
            return res.status(404).send('Restaurant not found.');
        }
        res.send('Restaurant approved successfully!');
        // Optionally send an email to the restaurant owner notifying them of approval
    } catch (error) {
        res.status(500).send('Error approving restaurant.');
    }
};

// Reject restaurant by admin
exports.rejectRestaurant = async (req, res) => {
    const { restaurantId } = req.params;
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(restaurantId, { status: "rejected" });
        if (!restaurant) {
            return res.status(404).send('Restaurant not found.');
        }
        res.send('Restaurant rejected.');
        // Optionally send an email to the restaurant owner notifying them of rejection
    } catch (error) {
        res.status(500).send('Error rejecting restaurant.');
    }
};

// Get all pending restaurants
exports.getPendingRestaurants = async (req, res) => {
    try {
        const pendingRestaurants = await Restaurant.find({ status: "pending" });
        res.status(200).json(pendingRestaurants);
    } catch (error) {
        res.status(500).send('Error fetching pending restaurants.');
    }
};

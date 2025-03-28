const Restaurant = require("../models/restaurantModel");

exports.createRestaurant = async (req, res) => {
  try {
    const { name, description, address, subscriptionplan } = req.body;
    
    // Make sure only approved restaurant owners can create restaurants
    if (req.user.role !== "restaurant_owner" || req.user.approvalstatus !== "approved") {
      return res.status(403).json({ message: "Your account must be approved to create a restaurant" });
    }

    // Create the restaurant in the database
    const restaurant = await Restaurant.create({
      name,
      description,
      address,
      ownerid: req.user.id, // This is fetched from the authenticated user
      subscriptionplan,
    });

    return res.status(201).json({ message: "Restaurant created successfully", restaurant });
  } catch (err) {
    console.error("Error creating restaurant:", err);
    return res.status(500).json({ message: "Error creating restaurant", error: err.message });
  }
};

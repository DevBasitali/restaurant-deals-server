const express = require("express");
const router = express.Router();
const restaurantController = require('../controller/restaurantController');
const { authMiddleware, approvedRestaurantMiddleware, authorizeRole } = require("../middleware/authMiddleware");

// Route for creating a restaurant (restricted to approved restaurant owners)
router.post("/add-restaurant", authMiddleware, approvedRestaurantMiddleware, restaurantController.createRestaurant);

module.exports = router;
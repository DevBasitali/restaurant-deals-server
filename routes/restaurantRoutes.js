const express = require("express");
const router = express.Router();
const restaurantController = require('../controller/restaurantController');
const { authMiddleware, approvedRestaurantMiddleware } = require("../middleware/authMiddleware");

router.post("/add-restaurant", authMiddleware, approvedRestaurantMiddleware, restaurantController.createRestaurant);

module.exports = router;
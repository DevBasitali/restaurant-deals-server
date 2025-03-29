const express = require("express");
const router = express.Router();
const restaurantController = require('../controller/restaurantController');
const { approvedRestaurantMiddleware, authMiddleware } = require("../middleware/authMiddleware");

router.post("/add-restaurant", authMiddleware, approvedRestaurantMiddleware, restaurantController.createRestaurant);

module.exports = router;
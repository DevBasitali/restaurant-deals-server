const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const adminController = require ("../controller/adminController")

router.get('/approve/:restaurantId', adminController.approveRestaurant);

// Admin rejection of restaurant
router.get('/reject/:restaurantId',  adminController.rejectRestaurant);

// Fetch all pending restaurants
router.get('/pending-restaurants', adminController.getPendingRestaurants);

module.exports = router;

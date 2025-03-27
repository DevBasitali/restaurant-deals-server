const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const verifyAdmin = require ('../middleware/adminVerify');

// Approve a restaurant
router.put('/approve-restaurant/:id', adminController.approveRestaurant);

// Reject a restaurant
router.put('/reject-restaurant/:id', adminController.rejectRestaurant);

// Ban a restaurant
router.put('/ban-restaurant/:id', adminController.banRestaurant);

// View all restaurants
router.get('/restaurants', adminController.getAllRestaurants);

module.exports = router;

const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

// Approve a restaurant
router.put('/approve-restaurant/:id', authMiddleware, adminMiddleware, adminController.approveRestaurantOwner);

// Reject a restaurant
router.put('/reject-restaurant/:id', authMiddleware, adminMiddleware, adminController.rejectRestaurantOwner);

router.post('/ban-restaurant-owner/:id', authMiddleware, adminMiddleware, adminController.banRestaurant_Owner);

router.put('/restaurant-owner/:id/unban', authMiddleware, adminMiddleware, adminController.unbanRestaurant_Owner);

router.get('/pending-restaurant-owners', authMiddleware, adminMiddleware, adminController.getPendingRestaurantOwners);

// Route to get all approved restaurant owners
router.get('/approved-restaurant-owners', authMiddleware, adminMiddleware, adminController.getApprovedRestaurantOwners);

// Route to get all rejected restaurant owners
router.get('/rejected-restaurant-owners', authMiddleware, adminMiddleware, adminController.getRejectedRestaurantOwners);


module.exports = router;

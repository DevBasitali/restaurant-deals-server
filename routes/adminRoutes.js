const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

router.put('/approve-restaurant/:id', authMiddleware, adminMiddleware, adminController.approveRestaurantOwner);

router.put('/reject-restaurant/:id', authMiddleware, adminMiddleware, adminController.rejectRestaurantOwner);

router.post('/ban-restaurant-owner/:id', authMiddleware, adminMiddleware, adminController.banRestaurant_Owner);

router.put('/restaurant-owner/:id/unban', authMiddleware, adminMiddleware, adminController.unbanRestaurant_Owner);

router.get('/pending-restaurant-owners', authMiddleware, adminMiddleware, adminController.getPendingRestaurantOwners);

router.get('/approved-restaurant-owners', authMiddleware, adminMiddleware, adminController.getApprovedRestaurantOwners);

router.get('/rejected-restaurant-owners', authMiddleware, adminMiddleware, adminController.getRejectedRestaurantOwners);


module.exports = router;

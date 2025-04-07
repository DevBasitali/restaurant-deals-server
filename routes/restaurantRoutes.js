const express = require("express");
const router = express.Router();
const restaurantController = require('../controller/restaurantController');
const { approvedRestaurantMiddleware, authMiddleware } = require("../middleware/authMiddleware");

router.post("/add-restaurant", authMiddleware, approvedRestaurantMiddleware, restaurantController.createRestaurant);
router.get('/get-restaurant/:id', authMiddleware, approvedRestaurantMiddleware, restaurantController.getRestaurantDetails);
router.put('/update-restaurant/:id', authMiddleware, approvedRestaurantMiddleware, restaurantController.updateRestaurant);
router.delete('/deactivate-restaurant/:id', authMiddleware, approvedRestaurantMiddleware, restaurantController.deactivateRestaurant);

module.exports = router;
const express = require("express");
const router = express.Router();
const restaurantController = require('../controller/restaurantController');
const { approvedRestaurantMiddleware, authMiddleware } = require("../middleware/authMiddleware");

router.post("/add-restaurant", authMiddleware, approvedRestaurantMiddleware, restaurantController.createRestaurant);
router.get('/get-restaurant/:id', authMiddleware, approvedRestaurantMiddleware, restaurantController.getRestaurantDetails);
router.put('/update-restaurant/:id', authMiddleware, approvedRestaurantMiddleware, restaurantController.updateRestaurant);
router.delete('/deactivate-restaurant/:id', authMiddleware, approvedRestaurantMiddleware, restaurantController.deactivateRestaurant);

// --subscription Plan routes
router.post('/subscribe-restaurant', authMiddleware, approvedRestaurantMiddleware, restaurantController.subscribeRestaurant);
router.get('/:restaurantId/current-subscription', authMiddleware, approvedRestaurantMiddleware, restaurantController.getCurrentSubscription);
router.get('/Available-plans', restaurantController.listAvailablePlans);
router.post('/:restaurantId/cancel-subscription', authMiddleware, approvedRestaurantMiddleware, restaurantController.cancelSubscription);



module.exports = router;
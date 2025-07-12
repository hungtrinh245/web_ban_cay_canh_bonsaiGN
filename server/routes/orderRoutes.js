const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

const { 
    addOrderItems, 
    getOrderById, 
    getMyOrders,
    updateOrderToPaid, 
    updateOrderToDelivered, 
    getAllOrders,
} = require('../controllers/orderController');

// User Routes
router.post('/', protect, addOrderItems);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Admin Only Order Routes
router.get('/', protect, authorize('admin'), getAllOrders); 
router.put('/:id/pay', protect, authorize('admin'), updateOrderToPaid); // PUT /api/orders/:id/pay
router.put('/:id/deliver', protect, authorize('admin'), updateOrderToDelivered); // PUT /api/orders/:id/deliver

module.exports = router;

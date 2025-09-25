const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

const { 
    addOrderItems, 
    getOrderById, 
    getMyOrders,
    updateOrderToPaid, 
    updateOrderToDelivered, 
    updateOrderStatus,
    updatePaymentStatus,
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
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus); // PUT /api/orders/:id/status
router.put('/:id/payment-status', protect, authorize('admin'), updatePaymentStatus); // PUT /api/orders/:id/payment-status

module.exports = router;

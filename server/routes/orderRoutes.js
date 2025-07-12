// server/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware'); // Đảm bảo import đúng

const { 
    addOrderItems, 
    getOrderById, 
    getMyOrders,
    updateOrderToPaid, 
    updateOrderToDelivered, 
    getAllOrders, // <-- ĐẢM BẢO IMPORT HÀM NÀY
} = require('../controllers/orderController');

// User Routes
router.post('/', protect, addOrderItems);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Admin Only Order Routes
router.get('/', protect, authorize('admin'), getAllOrders); // <-- Lỗi xảy ra ở đây nếu getAllOrders là undefined
router.put('/:id/pay', protect, authorize('admin'), updateOrderToPaid);
router.put('/:id/deliver', protect, authorize('admin'), updateOrderToDelivered);

module.exports = router;
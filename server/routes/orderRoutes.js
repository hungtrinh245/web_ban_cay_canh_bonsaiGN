// server/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { addOrderItems, getOrderById, getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware'); // Middleware bảo vệ route

// Route để tạo đơn hàng mới
router.post('/', protect, addOrderItems);

// Route để lấy chi tiết đơn hàng theo ID
router.get('/:id', protect, getOrderById);

// Route để lấy các đơn hàng của người dùng hiện tại
router.get('/myorders', protect, getMyOrders); 

module.exports = router;
// server/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { addOrderItems, getOrderById } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware'); // Middleware bảo vệ route

// Route để tạo đơn hàng mới
// Có thể thêm protect nếu bạn yêu cầu người dùng phải đăng nhập để đặt hàng
// Hoặc không dùng protect nếu bạn cho phép khách (guest) đặt hàng
router.post('/', protect, addOrderItems); // Đặt protect ở đây nếu muốn người dùng đã đăng nhập

// Route để lấy chi tiết đơn hàng theo ID
router.get('/:id', protect, getOrderById); // Cần protect để chỉ user hoặc admin mới xem được

module.exports = router;
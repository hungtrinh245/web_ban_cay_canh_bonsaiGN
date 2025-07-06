// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();


const { registerUser, loginUser, getMe, updateUserProfile } = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

// Định nghĩa route cho việc đăng ký
router.post('/register', registerUser);

// Định nghĩa route cho việc đăng nhập
router.post('/login', loginUser);

// Định nghĩa route để lấy thông tin cá nhân, route này được bảo vệ
router.get('/me', protect, getMe);

// Định nghĩa route để cập nhật thông tin cá nhân, route này được bảo vệ
router.put('/profile', protect, updateUserProfile); // <-- ĐẢM BẢO DÒNG NÀY VÀ import CỦA NÓ ĐÚNG

module.exports = router;
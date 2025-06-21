
const express = require('express');
const router = express.Router();

const { registerUser, loginUser, getMe } = require('../controllers/authController');


const { protect } = require('../middleware/authMiddleware');

// Định nghĩa route cho việc đăng ký
// Khi có request POST đến /api/auth/register, hàm registerUser sẽ được gọi
router.post('/register', registerUser);

// Định nghĩa route cho việc đăng nhập
router.post('/login', loginUser);

// Định nghĩa route để lấy thông tin cá nhân, route này được bảo vệ
router.get('/me', protect, getMe);

module.exports = router;
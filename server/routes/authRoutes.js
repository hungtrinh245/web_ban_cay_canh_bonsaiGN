// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware'); // Đảm bảo import đúng

const { 
    registerUser, 
    loginUser, 
    getMe, 
    updateUserProfile,
    getAllUsers, 
    getUserById, 
    updateUser, 
    deleteUser, 
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateUserProfile);

// Admin Only Routes for Users
// Lỗi "Route.get() requires a callback function but got a [object Undefined]" 
// xảy ra nếu getAllUsers ở trên là undefined.
router.get('/users', protect, authorize('admin'), getAllUsers);
router.get('/users/:id', protect, authorize('admin'), getUserById);
router.put('/users/:id', protect, authorize('admin'), updateUser);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
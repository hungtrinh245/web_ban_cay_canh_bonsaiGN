// server/routes/couponRoutes.js

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware'); 

const {
    applyCoupon, 
    getCoupons,
    createCoupon, 
    updateCoupon, 
    deleteCoupon,
    getActiveCoupons // Import hàm để lấy mã cho khách hàng
} = require('../controllers/couponController');

// --- CÁC ROUTE CÔNG KHAI (PUBLIC) ---
// Route này phải được đặt TRƯỚC các route có tham số động như /:id
router.get('/active', getActiveCoupons);
router.post('/apply', applyCoupon);

// --- CÁC ROUTE CHO QUẢN TRỊ VIÊN (ADMIN) ---
// GET /api/coupons và POST /api/coupons
router.route('/')
    .get(protect, authorize('admin'), getCoupons)
    .post(protect, authorize('admin'), createCoupon);

// PUT /api/coupons/:id và DELETE /api/coupons/:id
router.route('/:id')
    .put(protect, authorize('admin'), updateCoupon)
    .delete(protect, authorize('admin'), deleteCoupon);

module.exports = router;

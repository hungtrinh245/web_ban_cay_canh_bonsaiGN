// server/controllers/couponController.js
const Coupon = require('../models/Coupon');
const mongoose = require('mongoose'); // Import mongoose để kiểm tra ObjectId

// @desc    Apply a coupon code
// @route   POST /api/coupons/apply
// @access  Public (or Private if coupon is user-specific)
const applyCoupon = async (req, res) => {
    const { code, cartTotal } = req.body;

    if (!code || cartTotal === undefined) {
        return res.status(400).json({ message: 'Vui lòng cung cấp mã ưu đãi và tổng tiền giỏ hàng.' });
    }

    try {
        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({ message: 'Mã ưu đãi không tồn tại.' });
        }

        if (!coupon.isActive) {
            return res.status(400).json({ message: 'Mã ưu đãi không còn hoạt động.' });
        }

        if (coupon.expiresAt && new Date() > coupon.expiresAt) {
            return res.status(400).json({ message: 'Mã ưu đãi đã hết hạn.' });
        }

        // Kiểm tra usageLimit: nếu usageLimit không phải là Infinity và đã đạt/vượt quá usedCount
        if (coupon.usageLimit !== Infinity && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ message: 'Mã ưu đãi đã hết lượt sử dụng.' });
        }

        if (cartTotal < coupon.minAmount) {
            return res.status(400).json({ message: `Đơn hàng tối thiểu để áp dụng mã này là ${coupon.minAmount.toLocaleString('vi-VN')} VNĐ.` });
        }

        let discountAmount = 0;
        if (coupon.type === 'fixed') {
            discountAmount = coupon.value;
        } else if (coupon.type === 'percentage') {
            discountAmount = cartTotal * (coupon.value / 100);
            if (discountAmount > coupon.maxDiscount) { // Giới hạn giảm giá tối đa cho loại percentage
                discountAmount = coupon.maxDiscount;
            }
        }

        // Đảm bảo discountAmount không lớn hơn tổng tiền giỏ hàng
        discountAmount = Math.min(discountAmount, cartTotal);

        res.status(200).json({
            message: 'Mã ưu đãi đã được áp dụng thành công!',
            discountAmount: Math.round(discountAmount), // Làm tròn số tiền giảm giá
            couponCode: coupon.code,
            newTotal: cartTotal - discountAmount,
        });

    } catch (error) {
        console.error('Lỗi khi áp dụng mã ưu đãi:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi áp dụng mã ưu đãi.' });
    }
};

// @desc    Get all coupons (Admin Only)
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({}).sort({ createdAt: -1 }); // Lấy tất cả coupon, sắp xếp mới nhất
        res.json(coupons);
    } catch (error) {
        console.error('Lỗi khi lấy tất cả mã ưu đãi:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi lấy mã ưu đãi.' });
    }
};

// @desc    Create new coupon (Admin Only)
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res) => {
    try {
        const { code, type, value, minAmount, maxDiscount, expiresAt, usageLimit, isActive } = req.body;
        
        // Tạo coupon mới
        const newCoupon = await Coupon.create({
            code: code.toUpperCase(), // Chuyển code thành chữ hoa để tránh trùng lặp case-sensitive
            type,
            value,
            minAmount: minAmount || 0, // Mặc định 0 nếu không có
            maxDiscount: maxDiscount || Infinity, // Mặc định Infinity nếu không có
            expiresAt: expiresAt ? new Date(expiresAt) : null, // Chuyển sang Date object hoặc null
            usageLimit: usageLimit || Infinity, // Mặc định Infinity nếu không có
            isActive: isActive !== undefined ? isActive : true, // Mặc định true nếu không có
        });
        res.status(201).json(newCoupon);

    } catch (error) {
        console.error('Lỗi khi tạo mã ưu đãi:', error);
        if (error.code === 11000) { // Lỗi trùng lặp key (code đã tồn tại)
            return res.status(400).json({ message: 'Mã ưu đãi này đã tồn tại.' });
        }
        if (error.name === 'ValidationError') { // Lỗi validation từ Mongoose schema
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi tạo mã ưu đãi.' });
    }
};

// @desc    Update coupon (Admin Only)
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = async (req, res) => {
    const { code, type, value, minAmount, maxDiscount, expiresAt, usageLimit, isActive } = req.body;

    try {
        // Kiểm tra ID có hợp lệ không
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'ID mã ưu đãi không hợp lệ.' });
        }

        const coupon = await Coupon.findById(req.params.id);

        if (coupon) {
            coupon.code = code ? code.toUpperCase() : coupon.code;
            coupon.type = type || coupon.type;
            coupon.value = value || coupon.value;
            coupon.minAmount = minAmount !== undefined ? minAmount : coupon.minAmount;
            coupon.maxDiscount = maxDiscount !== undefined ? maxDiscount : coupon.maxDiscount;
            coupon.expiresAt = expiresAt ? new Date(expiresAt) : coupon.expiresAt;
            coupon.usageLimit = usageLimit !== undefined ? usageLimit : coupon.usageLimit;
            coupon.isActive = isActive !== undefined ? isActive : coupon.isActive;

            const updatedCoupon = await coupon.save();
            res.json(updatedCoupon);
        } else {
            res.status(404).json({ message: 'Không tìm thấy mã ưu đãi để cập nhật.' });
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật mã ưu đãi:', error);
        if (error.code === 11000) { // Lỗi trùng lặp key (code đã tồn tại)
            return res.status(400).json({ message: 'Mã ưu đãi này đã tồn tại.' });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi cập nhật mã ưu đãi.' });
    }
};

// @desc    Delete coupon (Admin Only)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res) => {
    try {
        // Kiểm tra ID có hợp lệ không
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'ID mã ưu đãi không hợp lệ.' });
        }
        const coupon = await Coupon.findById(req.params.id);
        if (coupon) {
            await Coupon.deleteOne({ _id: req.params.id }); // Xóa coupon
            res.json({ message: 'Mã ưu đãi đã được xóa thành công.' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy mã ưu đãi để xóa.' });
        }
    } catch (error) {
        console.error('Lỗi khi xóa mã ưu đãi:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi xóa mã ưu đãi.' });
    }
};

// EXPORTS: Đảm bảo tất cả các hàm được export ở đây
module.exports = {
    applyCoupon,
    getCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
};

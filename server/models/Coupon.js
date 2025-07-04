// server/models/Coupon.js
const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Mã ưu đãi không được để trống'],
        unique: true,
        trim: true,
        uppercase: true,
    },
    type: { // 'percentage' or 'fixed'
        type: String,
        required: [true, 'Loại giảm giá không được để trống'],
        enum: ['percentage', 'fixed'],
    },
    value: { // Giá trị giảm (10 cho 10%, hoặc 50000 cho 50k VNĐ)
        type: Number,
        required: [true, 'Giá trị giảm không được để trống'],
        min: [0, 'Giá trị giảm không thể âm'],
    },
    minAmount: { // Đơn hàng tối thiểu để áp dụng
        type: Number,
        default: 0,
        min: 0,
    },
    maxDiscount: { // Giảm tối đa nếu là % (ví dụ: giảm 10% nhưng tối đa 100k)
        type: Number,
        default: Infinity,
    },
    expiresAt: { // Ngày hết hạn
        type: Date,
        default: null,
    },
    usageLimit: { // Số lần sử dụng tối đa của mã
        type: Number,
        default: Infinity,
    },
    usedCount: { // Số lần đã dùng
        type: Number,
        default: 0,
    },
    isActive: { // Trạng thái hoạt động của mã
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;
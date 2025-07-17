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
    type: { // 'percentage' hoặc 'fixed'
        type: String,
        required: [true, 'Loại giảm giá không được để trống'],
        enum: ['percentage', 'fixed'],
    },
    value: { // Giá trị giảm (ví dụ: 10 cho 10%, hoặc 50000 cho 50k VNĐ)
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
    },
    // SỬA: Đổi tên thành 'expiryDate' cho nhất quán và đảm bảo kiểu là Date
    expiryDate: { 
        type: Date,
        required: [true, 'Ngày hết hạn không được để trống'],
    },
    usageLimit: { // Số lần sử dụng tối đa của mã
        type: Number,
        default: Infinity,
    },
    usedCount: { // Số lần đã dùng
        type: Number,
        default: 0,
    },
    // Đảm bảo kiểu dữ liệu là Boolean
    isActive: { 
        type: Boolean,
        default: true,
    },
    // XÓA: Các trường 'couponCode' và 'discount' không thuộc về model này.
    // Chúng thuộc về model Order để lưu lại mã đã áp dụng.
}, {
    timestamps: true,
});

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;

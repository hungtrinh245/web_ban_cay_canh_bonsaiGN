// server/controllers/couponController.js
const Coupon = require('../models/Coupon');

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
            if (discountAmount > coupon.maxDiscount) {
                discountAmount = coupon.maxDiscount;
            }
        }

        // Đảm bảo discountAmount không lớn hơn cartTotal
        discountAmount = Math.min(discountAmount, cartTotal);

        res.status(200).json({
            message: 'Mã ưu đãi đã được áp dụng thành công!',
            discountAmount: Math.round(discountAmount), // Làm tròn số tiền giảm giá
            couponCode: coupon.code,
            newTotal: cartTotal - discountAmount, // Gửi lại tổng tiền mới (tùy chọn)
        });

    } catch (error) {
        console.error('Lỗi khi áp dụng mã ưu đãi:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi áp dụng mã ưu đãi.' });
    }
};

module.exports = {
    applyCoupon,
};
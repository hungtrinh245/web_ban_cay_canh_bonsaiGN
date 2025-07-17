// server/controllers/couponController.js
const Coupon = require('../models/Coupon');

// @desc    Lấy tất cả mã ưu đãi (Admin)
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({}).sort({ createdAt: -1 });
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
    }
};

// @desc    Tạo mã ưu đãi mới (Admin)
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res) => {
    try {
        const { code, type, value, minAmount, maxDiscount, expiryDate, isActive } = req.body;

        if (!code || !type || !value || !expiryDate) {
            return res.status(400).json({ message: 'Vui lòng cung cấp đủ thông tin: code, type, value, expiryDate.' });
        }

        const couponExists = await Coupon.findOne({ code });
        if (couponExists) {
            return res.status(400).json({ message: 'Mã ưu đãi này đã tồn tại.' });
        }

        const coupon = new Coupon({
            code,
            type,
            value,
            minAmount,
            maxDiscount,
            // QUAN TRỌNG: Chuyển đổi chuỗi ngày thành đối tượng Date
            expiryDate: new Date(expiryDate), 
            // QUAN TRỌNG: Đảm bảo giá trị là boolean
            isActive: isActive === true || isActive === 'true', 
        });

        const createdCoupon = await coupon.save();
        res.status(201).json(createdCoupon);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo mã ưu đãi: ' + error.message });
    }
};

// @desc    Cập nhật mã ưu đãi (Admin)
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = async (req, res) => {
    try {
        const { code, type, value, minAmount, maxDiscount, expiryDate, isActive } = req.body;
        const coupon = await Coupon.findById(req.params.id);

        if (coupon) {
            coupon.code = code || coupon.code;
            coupon.type = type || coupon.type;
            coupon.value = value !== undefined ? value : coupon.value;
            coupon.minAmount = minAmount !== undefined ? minAmount : coupon.minAmount;
            coupon.maxDiscount = maxDiscount !== undefined ? maxDiscount : coupon.maxDiscount;
            
            // QUAN TRỌNG: Cập nhật và chuyển đổi kiểu dữ liệu nếu có
            if (expiryDate) {
                coupon.expiryDate = new Date(expiryDate);
            }
            if (isActive !== undefined) {
                coupon.isActive = isActive === true || isActive === 'true';
            }

            const updatedCoupon = await coupon.save();
            res.json(updatedCoupon);
        } else {
            res.status(404).json({ message: 'Không tìm thấy mã ưu đãi.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật mã ưu đãi: ' + error.message });
    }
};

// @desc    Xóa mã ưu đãi (Admin)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (coupon) {
            await coupon.deleteOne();
            res.json({ message: 'Mã ưu đãi đã được xóa.' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy mã ưu đãi.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa mã ưu đãi.' });
    }
};


// @desc    Lấy tất cả mã ưu đãi đang hoạt động (cho khách hàng)
// @route   GET /api/coupons/active
// @access  Public
const getActiveCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({
            isActive: true,
            expiryDate: { $gt: new Date() } // Chỉ lấy mã có ngày hết hạn trong tương lai
        }).sort({ createdAt: -1 });
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
    }
};

// @desc    Áp dụng mã ưu đãi
// @route   POST /api/coupons/apply
// @access  Public
const applyCoupon = async (req, res) => {
    try {
        const { code, cartTotal } = req.body;
        const coupon = await Coupon.findOne({ code });

        if (!coupon) {
            return res.status(404).json({ message: 'Mã ưu đãi không tồn tại.' });
        }
        if (!coupon.isActive) {
            return res.status(400).json({ message: 'Mã ưu đãi này đã bị vô hiệu hóa.' });
        }
        if (coupon.expiryDate < new Date()) {
            return res.status(400).json({ message: 'Mã ưu đãi đã hết hạn.' });
        }
        if (cartTotal < coupon.minAmount) {
            return res.status(400).json({ message: `Mã này chỉ áp dụng cho đơn hàng từ ${coupon.minAmount.toLocaleString('vi-VN')} VNĐ.` });
        }

        let discountAmount = 0;
        if (coupon.type === 'percentage') {
            discountAmount = (cartTotal * coupon.value) / 100;
            if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
                discountAmount = coupon.maxDiscount;
            }
        } else { // 'fixed'
            discountAmount = coupon.value;
        }

        res.json({
            message: 'Áp dụng mã thành công!',
            discountAmount,
            coupon,
        });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi áp dụng mã.' });
    }
};


module.exports = {
    getCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    getActiveCoupons,
    applyCoupon
};

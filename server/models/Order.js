// server/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { // Tham chiếu đến người dùng đặt hàng 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Tham chiếu đến model User
        required: false, //cho phép đặt hàng mà không cần đăng nhập
    },
    orderItems: [ // Mảng các sản phẩm trong đơn hàng
        {
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            image: { type: String, required: false }, // Đặt false nếu ảnh có thể không có
            price: { type: Number, required: true },
            product: { // Tham chiếu đến sản phẩm thật trong collection Bonsai
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Bonsai', // Tham chiếu đến model Bonsai
                required: true,
            },
        },
    ],
    shippingAddress: { // Thông tin địa chỉ giao hàng
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        company: { type: String }, // Optional
        country: { type: String, required: true, default: 'Việt Nam' },
        address: { type: String, required: true },
        postalCode: { type: String }, // Optional
        city: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
    },
    paymentMethod: { // Phương thức thanh toán (COD, Bank Transfer)
        type: String,
        required: true,
    },
    paymentResult: { // Thông tin chi tiết kết quả thanh toán (nếu dùng cổng thanh toán)
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String },
    },
    itemsPrice: { // Tổng giá trị các sản phẩm
        type: Number,
        required: true,
        default: 0.0,
    },
    shippingPrice: { // Phí vận chuyển
        type: Number,
        required: true,
        default: 0.0,
    },
    taxPrice: { // Thuế (nếu có, thường là 0 ở VN cho cây cảnh)
        type: Number,
        required: true,
        default: 0.0,
    },
    totalPrice: { // Tổng giá trị đơn hàng (itemsPrice + shippingPrice + taxPrice)
        type: Number,
        required: true,
        default: 0.0,
    },
    isPaid: { // Đã thanh toán chưa
        type: Boolean,
        required: true,
        default: false,
    },
    paidAt: { // Ngày thanh toán
        type: Date,
    },
    isDelivered: { // Đã giao hàng chưa
        type: Boolean,
        required: true,
        default: false,
    },
    deliveredAt: { // Ngày giao hàng
        type: Date,
    },
    
    // Trạng thái đơn hàng mới
    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'shipping', 'delivered', 'cancelled', 'returned'],
        default: 'pending'
    },
    
    // Trạng thái thanh toán mới
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    
    // Ghi chú trạng thái
    statusNote: { type: String },
    paymentNote: { type: String },
    
    // Thời gian cập nhật trạng thái
    statusUpdatedAt: { type: Date },
    paymentUpdatedAt: { type: Date },
 
    // Thông tin thêm từ form Checkout
    createAccount: { type: Boolean, default: false },
    shipToDifferentAddress: { type: Boolean, default: false }, // Cho phép địa chỉ giao hàng khác địa chỉ thanh toán (nếu triển khai)
    notes: { type: String }, // Ghi chú từ khách hàng
}, {
    timestamps: true, // Tự động thêm createdAt và updatedAt
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
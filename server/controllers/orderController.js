const Order = require('../models/Order');
const Bonsai = require('../models/bonsai'); 
const mongoose = require('mongoose'); // Import mongoose để kiểm tra ObjectId

const addOrderItems = async (req, res) => {
    const {
        orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, notes, createAccount, shipToDifferentAddress, userId, 
    } = req.body;
    if (orderItems && orderItems.length === 0) {
        res.status(400).json({ message: 'Không có sản phẩm trong đơn hàng' });
        return;
    } else {
        try {
            const orderUserId = req.user ? req.user._id : userId;
            const order = new Order({
                user: orderUserId, 
                orderItems: orderItems.map(x => ({ ...x, product: x.product, _id: undefined, })),
                shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice: taxPrice || 0, totalPrice, notes, createAccount, shipToDifferentAddress,
            });

            for (const item of order.orderItems) {
                const product = await Bonsai.findById(item.product);
                if (product) {
                    if (product.stockQuantity < item.qty) {
                        res.status(400).json({ message: `Sản phẩm "${product.name}" không đủ số lượng tồn kho. Chỉ còn ${product.stockQuantity} sản phẩm.` });
                        return;
                    }
                    product.stockQuantity -= item.qty;
                    await product.save();
                } else {
                    res.status(404).json({ message: `Không tìm thấy sản phẩm với ID: ${item.product}` });
                    return;
                }
            }
            const createdOrder = await order.save();
            res.status(201).json(createdOrder);
        } catch (error) {
            console.error('Lỗi khi tạo đơn hàng:', error);
            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map(val => val.message);
                return res.status(400).json({ message: messages.join(', ') });
            }
            res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi tạo đơn hàng.' });
        }
    }
};

const getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: 'ID đơn hàng không hợp lệ.' });
        }
        const order = await Order.findById(orderId).populate('user', 'name email');

        if (order) {
            if (order.user === null || (req.user && (order.user._id.toString() === req.user._id.toString() || req.user.role === 'admin'))) {
                res.json(order);
            } else {
                res.status(403).json({ message: 'Bạn không có quyền xem đơn hàng này.' });
            }
        } else {
            res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
        }
    } catch (error) {
        console.error('Lỗi khi lấy đơn hàng theo ID:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi lấy đơn hàng.' });
    }
};

const getMyOrders = async (req, res) => {
    try {
        if (!req.user || !req.user._id || !mongoose.Types.ObjectId.isValid(req.user._id)) { 
            return res.status(400).json({ message: 'Người dùng không xác thực hoặc ID người dùng không hợp lệ.' });
        }
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Lỗi khi lấy đơn hàng của người dùng:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi lấy đơn hàng của bạn.' });
    }
};

// @desc    Update order to paid (Admin Only)
// @route   PUT /api/orders/:id/pay
// @access  Private/Admin
const updateOrderToPaid = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: 'ID đơn hàng không hợp lệ.' });
        }
        const order = await Order.findById(orderId); // Find by ID

        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            // order.paymentResult = { ... }; // Update paymentResult if available from payment gateway

            const updatedOrder = await order.save(); // Save the updated order
            res.json(updatedOrder); // Return the updated order
        } else {
            res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái đã thanh toán:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi cập nhật trạng thái thanh toán.' });
    }
};

// @desc    Update order to delivered (Admin Only)
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: 'ID đơn hàng không hợp lệ.' });
        }
        const order = await Order.findById(orderId); // Find by ID

        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();

            const updatedOrder = await order.save(); // Save the updated order
            res.json(updatedOrder); // Return the updated order
        } else {
            res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái đã giao hàng:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi cập nhật trạng thái giao hàng.' });
    }
};

// @desc    Get all orders (Admin Only)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Lỗi khi lấy tất cả đơn hàng (Admin):', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi lấy tất cả đơn hàng.' });
    }
};

// @desc    Update order status (Admin Only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { orderStatus, note } = req.body;
        
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: 'ID đơn hàng không hợp lệ.' });
        }
        
        if (!orderStatus) {
            return res.status(400).json({ message: 'Trạng thái đơn hàng là bắt buộc.' });
        }
        
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
        }
        
        // Cập nhật trạng thái
        order.orderStatus = orderStatus;
        order.statusNote = note || '';
        order.statusUpdatedAt = Date.now();
        
        // Cập nhật các trường liên quan
        if (orderStatus === 'delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        } else if (orderStatus === 'cancelled') {
            order.isDelivered = false;
        }
        
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi cập nhật trạng thái đơn hàng.' });
    }
};

// @desc    Update payment status (Admin Only)
// @route   PUT /api/orders/:id/payment-status
// @access  Private/Admin
const updatePaymentStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { paymentStatus, note } = req.body;
        
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: 'ID đơn hàng không hợp lệ.' });
        }
        
        if (!paymentStatus) {
            return res.status(400).json({ message: 'Trạng thái thanh toán là bắt buộc.' });
        }
        
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
        }
        
        // Cập nhật trạng thái thanh toán
        order.paymentStatus = paymentStatus;
        order.paymentNote = note || '';
        order.paymentUpdatedAt = Date.now();
        
        // Cập nhật các trường liên quan
        if (paymentStatus === 'paid') {
            order.isPaid = true;
            order.paidAt = Date.now();
        } else if (paymentStatus === 'failed') {
            order.isPaid = false;
        }
        
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái thanh toán:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi cập nhật trạng thái thanh toán.' });
    }
};

module.exports = { 
    addOrderItems, 
    getOrderById, 
    getMyOrders, 
    updateOrderToPaid, 
    updateOrderToDelivered, 
    updateOrderStatus,
    updatePaymentStatus,
    getAllOrders 
};

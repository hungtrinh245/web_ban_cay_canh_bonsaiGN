// server/controllers/orderController.js
const Order = require('../models/Order');
const Bonsai = require('../models/bonsai'); //cập nhật tồn kho

const addOrderItems = async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice, // Mặc định 0
        totalPrice,
        notes,
        createAccount,
        shipToDifferentAddress,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400).json({ message: 'Không có sản phẩm trong đơn hàng' });
        return;
    } else {
        try {
            // Lấy user ID nếu người dùng đã đăng nhập (middleware protect sẽ gắn req.user)
            const userId = req.user ? req.user._id : null;

            const order = new Order({
                user: userId, // Gán user ID 
                orderItems: orderItems.map(x => ({
                    ...x,
                    product: x.product, //trường 'product' là ObjectId
                    _id: undefined, // Bỏ _id tự động tạo khi map, để Mongoose tự tạo _id cho subdocument
                })),
                shippingAddress,
                paymentMethod,
                itemsPrice,
                shippingPrice,
                taxPrice: taxPrice || 0, // Đảm bảo có giá trị
                totalPrice,
                notes,
                createAccount,
                shipToDifferentAddress,
            });

            // --- GIẢM SỐ LƯỢNG TỒN KHO CỦA SẢN PHẨM ---
            for (const item of order.orderItems) {
                const product = await Bonsai.findById(item.product);
                if (product) {
                    if (product.stockQuantity < item.qty) {
                        // Nếu tồn kho không đủ, hủy bỏ đơn hàng
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
            // --- KẾT THÚC GIẢM TỒN KHO ---

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
        // Populate user details (name and email) if order has a user
        const order = await Order.findById(req.params.id).populate(
            'user',
            'name email'
        );

        if (order) {
            // Đảm bảo chỉ user của đơn hàng hoặc admin mới có thể xem
            if (req.user && (order.user.toString() === req.user._id.toString() || req.user.role === 'admin')) {
                res.json(order);
            } else {
                res.status(403).json({ message: 'Bạn không có quyền xem đơn hàng này.' });
            }
        } else {
            res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
        }
    } catch (error) {
        console.error('Lỗi khi lấy đơn hàng theo ID:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'ID đơn hàng không hợp lệ.' });
        }
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi lấy đơn hàng.' });
    }
};


// @desc    Get user's own orders
// @route   GET /api/orders/myorders
// @access  Private (only for logged in user)

const getMyOrders = async (req, res) => {
    try {
        // req.user._id được gắn từ middleware 'protect'
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }); // Sắp xếp mới nhất
        res.json(orders);
    } catch (error) {
        console.error('Lỗi khi lấy đơn hàng của người dùng:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi lấy đơn hàng của bạn.' });
    }
};

module.exports = {
    addOrderItems,
    getOrderById,
    getMyOrders,
};
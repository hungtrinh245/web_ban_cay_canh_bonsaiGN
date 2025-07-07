// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Lấy thông tin user (loại bỏ password) và gán vào req.user
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                 return res.status(401).json({ message: 'Không được phép, người dùng không tồn tại' });
            }
            
            next();
        } catch (error) {
            console.error('Lỗi xác thực token:', error);
            res.status(401).json({ message: 'Không được phép, token không hợp lệ' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Không được phép, không có token' });
    }
};

// Middleware phân quyền theo vai trò (ví dụ: chỉ admin mới được vào)
const authorize = (...roles) => {
    return (req, res, next) => {
        // Kiểm tra nếu người dùng không tồn tại hoặc vai trò của họ không nằm trong danh sách cho phép
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Người dùng với vai trò ${req.user ? req.user.role : 'khách'} không có quyền truy cập chức năng này.` });
        }
        next();
    };
};

module.exports = { protect, authorize };

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Kiểm tra xem header 'Authorization' có tồn tại và bắt đầu bằng 'Bearer' không
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Lấy token từ header (format: 'Bearer <token>')
            token = req.headers.authorization.split(' ')[1];

            // Xác minh token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Lấy thông tin user từ ID trong token và gán vào request
            // để các route phía sau có thể sử dụng
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                 return res.status(401).json({ message: 'Không được phép, người dùng không tồn tại' });
            }
            
            next(); // Chuyển sang middleware hoặc controller tiếp theo
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
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Người dùng với vai trò ${req.user ? req.user.role : 'khách'} không có quyền truy cập` });
        }
        next();
    };
};

module.exports = { protect, authorize };
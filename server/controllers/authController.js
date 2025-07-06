// server/controllers/authController.js
const User = require('../models/User'); // Import User model
const jwt = require('jsonwebtoken');

// Hàm tạo token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

// @desc    Đăng ký người dùng mới
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email đã được sử dụng' });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        if (user) {
            const token = generateToken(user._id);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: token
            });
        } else {
            res.status(400).json({ message: 'Dữ liệu người dùng không hợp lệ' });
        }
    } catch (error) {
        console.error('Lỗi đăng ký:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Đăng nhập người dùng
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });
        }

        const user = await User.findOne({ email }).select('+password'); // Lấy cả trường password

        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user._id);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: token
            });
        } else {
            res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Lấy thông tin người dùng hiện tại (profile)
// @route   GET /api/auth/me
// @access  Private (cần token)
const getMe = async (req, res) => {
    // req.user sẽ được gán từ middleware xác thực mà chúng ta sẽ tạo sau
    const user = await User.findById(req.user.id);
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id); // User ID từ token

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        // Thêm cập nhật các trường khác nếu có
        // user.address = req.body.address || user.address;
        // user.phone = req.body.phone || user.phone;

        // Nếu có mật khẩu mới, hash nó
        if (req.body.password) {
            user.password = req.body.password; // Middleware pre('save') trong User model sẽ hash
        }

        const updatedUser = await user.save(); // Lưu thay đổi

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            token: generateToken(updatedUser._id), // Tạo token mới nếu cập nhật
        });
    } else {
        res.status(404).json({ message: 'Người dùng không tìm thấy.' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    updateUserProfile,
};
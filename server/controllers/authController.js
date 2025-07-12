// server/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Hàm tạo token (giữ nguyên)
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
    const user = await User.findById(req.user.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404).json({ message: 'Người dùng không tìm thấy.' });
    }
};

// @desc    Get all users (Admin Only)
// @route   GET /api/auth/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        console.error('Lỗi khi lấy tất cả người dùng:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi lấy danh sách người dùng.' });
    }
};

// @desc    Get user by ID (Admin Only)
// @route   GET /api/auth/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'Không tìm thấy người dùng.' });
        }
    } catch (error) {
        console.error('Lỗi khi lấy người dùng theo ID:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'ID người dùng không hợp lệ.' });
        }
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi lấy người dùng.' });
    }
};

// @desc    Update user (Admin Only)
// @route   PUT /api/auth/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    const { name, email, role } = req.body;

    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.name = name || user.name;
            user.email = email || user.email;
            user.role = role || user.role; 

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
            });
        } else {
            res.status(404).json({ message: 'Không tìm thấy người dùng để cập nhật.' });
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật người dùng (Admin):', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi cập nhật người dùng.' });
    }
};

// @desc    Delete user (Admin Only)
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            // Ngăn admin tự xóa mình hoặc admin khác
            if (user.role === 'admin' && req.user && user._id.toString() === req.user._id.toString()) {
                 return res.status(400).json({ message: 'Bạn không thể xóa tài khoản Admin của chính mình.' });
            }
            await User.deleteOne({ _id: req.params.id });
            res.json({ message: 'Người dùng đã được xóa thành công.' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy người dùng để xóa.' });
        }
    } catch (error) {
        console.error('Lỗi khi xóa người dùng (Admin):', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'ID người dùng không hợp lệ.' });
        }
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi xóa người dùng.' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    updateUserProfile,
    getAllUsers,     // <-- ĐẢM BẢO ĐƯỢC EXPORT
    getUserById,     
    updateUser,      
    deleteUser,      // <-- ĐẢM BẢO ĐƯỢC EXPORT
};
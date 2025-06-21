// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tên không được để trống'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email không được để trống'],
        unique: true, // Email phải là duy nhất
        lowercase: true,
        trim: true,
        match: [ // Kiểm tra định dạng email cơ bản
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Vui lòng nhập một địa chỉ email hợp lệ'
        ]
    },
    password: {
        type: String,
        required: [true, 'Mật khẩu không được để trống'],
        minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
        select: false // Mặc định không trả về trường password khi query user
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true // Tự động thêm trường createdAt và updatedAt
});

// Middleware: Mã hóa mật khẩu trước khi lưu user
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method: So sánh mật khẩu đã nhập với mật khẩu đã hash trong DB
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
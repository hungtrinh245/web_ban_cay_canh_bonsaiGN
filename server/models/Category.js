// server/models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tên danh mục không được để trống'],
        unique: true, // Đảm bảo tên danh mục là duy nhất
        trim: true,
    },
    description: {
        type: String,
        required: false, // Mô tả là tùy chọn
    },
}, {
    timestamps: true, // Tự động thêm createdAt và updatedAt
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
// server/models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Tiêu đề bài viết không được để trống'],
        trim: true,
    },
    excerpt: { // Đoạn trích, mô tả ngắn gọn
        type: String,
        required: [true, 'Mô tả ngắn gọn không được để trống'],
    },
    content: { // Nội dung chi tiết của bài viết
        type: String,
        required: [true, 'Nội dung bài viết không được để trống'],
    },
    image: { // Đường dẫn đến ảnh đại diện bài viết
        type: String,
        required: false, // Ảnh có thể là optional nếu không có
    },
    author: { // Tác giả bài viết (có thể là tên string hoặc ref tới User)
        type: String,
        default: 'Admin', // Mặc định là Admin
    },
    category: { // Danh mục bài viết (ví dụ: "Chăm sóc cây", "Phong thủy", "Tin tức")
        type: String,
        default: 'Mẹo chăm sóc',
    },
    tags: [String], // Các tag liên quan (ví dụ: ["tưới nước", "ánh sáng"])
    isFeatured: { // Bài viết nổi bật 
        type: Boolean,
        default: false,
    },
    views: { // Số lượt xem
        type: Number,
        default: 0,
    },
}, {
    timestamps: true, // Tự động thêm createdAt và updatedAt
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
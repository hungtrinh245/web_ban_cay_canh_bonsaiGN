// server/models/bonsai.js
const mongoose = require('mongoose'); // Đảm bảo bạn đã import mongoose



// Định nghĩa schema cho mỗi đánh giá (Review)
const reviewSchema = mongoose.Schema(
    {
        name: { type: String, required: true }, // Tên người đánh giá
        rating: { type: Number, required: true }, // Số sao (1-5)
        comment: { type: String, required: true }, // Nội dung bình luận
        user: { // Tham chiếu đến người dùng đã đánh giá
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // Tham chiếu đến User Model
        },
    },
    {
        timestamps: true, // Tự động thêm createdAt và updatedAt cho mỗi review
    }
);


const bonsaiSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Tên sản phẩm không được để trống"], // Sửa: require -> required
        trim: true,
    },
    description: { // Sửa: devription -> description
        type: String,
        required: [true, "Mô tả sản phẩm không được để trống"],
    },
    price: {
        type: Number,
        required: [true, "Giá sản phẩm không được để trống"],
    },
    images: [{
        type: String,
        required: false,
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, "Danh mục sản phẩm không được để trống"],
    },
    stockQuantity: {
        type: Number,
        required: [true, 'Số lượng tồn kho không được để trống'],
        min: [0, 'Số lượng tồn kho không thể âm'],
        default: 0
    },
      isFeatured: {
        type: Boolean,
        default: false // Mặc định sản phẩm không phải là nổi bật
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },


    reviews: [reviewSchema], // Mảng chứa các đánh giá 
    rating: { // Điểm đánh giá trung bình
        type: Number,
        required: true,
        default: 0,
    },
    numReviews: { // Tổng số lượt đánh giá
        type: Number,
        required: true,
        default: 0,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});



const Bonsai = mongoose.model("Bonsai", bonsaiSchema);

module.exports = Bonsai; 
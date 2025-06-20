// server/models/bonsai.js
const mongoose = require('mongoose'); // Đảm bảo bạn đã import mongoose

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
        type: String,
        required: [true, "Danh mục sản phẩm không được để trống"],
    },
    stockQuantity: {
        type: Number,
        required: [true, 'Số lượng tồn kho không được để trống'],
        min: [0, 'Số lượng tồn kho không thể âm'],
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Bonsai = mongoose.model("Bonsai", bonsaiSchema);

module.exports = Bonsai; 
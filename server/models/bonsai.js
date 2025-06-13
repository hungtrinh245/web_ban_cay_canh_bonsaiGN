const bonsaiSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Tên sản phẩm không được để trống'],
        trim: true
    },
      devription: {
        type: String,
        require: [true, 'Mô tả sản phẩm không được để trống'],  
    },
      price: {
        type: Number,
        require: [true, 'Giá sản phẩm không được để trống'],  
    },
     images: [{ 
        type: String, 
        required: false 
    }],
    category: {
        type: String,
        required: [true, 'Danh mục sản phẩm không được để trống'],
        // enum: ['phong thủy', 'để bàn', Cây để bàn', 'Cây thủy sinh', 'Xương rồng', 'Sen đá', 'Cây dây leo'] 
    },
     createdAt: {
        type: Date,
        default: Date.now
    }
});
const Bonsai = mongoose.model('Bonsai', bonsaiSchema);
module.exports = Product;

const bonsaiSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Tên sản phẩm không được để trống"],
    trim: true,
  },
  devription: {
    type: String,
    require: [true, "Mô tả sản phẩm không được để trống"],
  },
  price: {
    type: Number,
    require: [true, "Giá sản phẩm không được để trống"],
  },
  images: [
    {
      type: String,
      required: false,
    },
  ],
  category: {
    type: String,
    required: [true, "Danh mục sản phẩm không được để trống"],
    // enum: ['phong thủy', 'để bàn', Cây để bàn', 'Cây thủy sinh', 'Xương rồng', 'Sen đá', 'Cây dây leo']
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
export default Bonsai;

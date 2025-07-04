// server/controllers/bonsaiController.js
const Bonsai = require("../models/bonsai.js");

// Trả về sản phẩm MỚI NHẤT (Nếu không có bộ lọc nào khác, đây là mặc định)
const getAllBonsais = async (req, res) => {
  try {
    const bonsais = await Bonsai.find({}).sort({ createdAt: -1 }); // Sắp xếp theo ngày tạo giảm dần (mới nhất)
    res.status(200).json(bonsais);
  } catch (error) {
    console.error("Lỗi khi lấy tất cả sản phẩm:", error);
    res
      .status(500)
      .json({ message: "Lỗi máy chủ nội bộ khi lấy tất cả sản phẩm." });
  }
};

// Trả về một sản phẩm theo ID
const getProductById = async (req, res) => {
  try {
    const product = await Bonsai.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
  } catch (error) {
    console.error(`Lỗi khi lấy sản phẩm ID ${req.params.id}:`, error);

    if (error.name === "CastError") {
      return res
        .status(404)
        .json({ message: "Định dạng ID sản phẩm không hợp lệ." });
    }
    res
      .status(500)
      .json({ message: "Lỗi máy chủ nội bộ khi lấy sản phẩm theo ID." });
  }
};

// Trả về các sản phẩm liên quan
const getRelatedProducts = async (req, res) => {
  try {
    // Kiểm tra định dạng ID trước
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      // Kiểm tra định dạng ObjectId của MongoDB
      return res
        .status(400)
        .json({ message: "Định dạng ID sản phẩm không hợp lệ." });
    }

    const currentProduct = await Bonsai.findById(req.params.id);
    if (!currentProduct) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm gốc" });
    }
    const relatedProducts = await Bonsai.find({
      category: currentProduct.category,
      _id: { $ne: req.params.id }, // $ne: "not equal"
    }).limit(5); // Giới hạn 5 sản phẩm liên quan
    res.json(relatedProducts);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm liên quan:", error);
    res
      .status(500)
      .json({ message: "Lỗi máy chủ nội bộ khi lấy sản phẩm liên quan." });
  }
};

// Trả về sản phẩm NỔI BẬT
const getFeaturedBonsais = async (req, res) => {
  try {
    const featuredBonsais = await Bonsai.find({ isFeatured: true }).limit(8);
    res.json(featuredBonsais);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm nổi bật:", error);
    res
      .status(500)
      .json({ message: "Lỗi máy chủ nội bộ khi lấy sản phẩm nổi bật." });
  }
};

// Trả về danh sách các danh mục duy nhất
const getBonsaiCategories = async (req, res) => {
  try {
    const categories = await Bonsai.distinct("category");
    res.json(categories);
  } catch (error) {
    console.error("Lỗi khi lấy danh mục:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ khi lấy danh mục." });
  }
};

// Trả về các sản phẩm thuộc một danh mục cụ thể
const getBonsaisByCategory = async (req, res) => {
  try {
    // req.params.categoryName sẽ được giải mã tự động bởi Express nếu được encodeURIComponent
    const products = await Bonsai.find({ category: req.params.categoryName });
    res.json(products);
  } catch (error) {
    console.error(
      `Lỗi khi lấy sản phẩm theo danh mục ${req.params.categoryName}:`,
      error
    );
    res
      .status(500)
      .json({ message: "Lỗi máy chủ nội bộ khi lấy sản phẩm theo danh mục." });
  }
};

//  Lọc sản phẩm theo khoảng giá và có thể theo danh mục
const getBonsaisByPriceRange = async (req, res) => {
  try {
    const { min, max, category } = req.query; // Lấy min, max và category từ query parameters
    let query = {};

    // Chuyển đổi và kiểm tra giá trị số
    const minPriceNum = min ? Number(min) : undefined;
    const maxPriceNum = max ? Number(max) : undefined;

    if (minPriceNum !== undefined && !isNaN(minPriceNum)) {
      query.price = { ...query.price, $gte: minPriceNum };
    }
    if (maxPriceNum !== undefined && !isNaN(maxPriceNum)) {
      query.price = { ...query.price, $lte: maxPriceNum };
    }

    // Thêm điều kiện lọc theo category nếu có và không phải là 'null' string
    if (category && category !== "null" && category !== "undefined") {
      query.category = category;
    }

    console.log("DEBUG Backend: Querying with:", query);
    const products = await Bonsai.find(query).sort({ createdAt: -1 }); // Sắp xếp theo mới nhất
    res.json(products);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm theo giá:", error);
    res
      .status(500)
      .json({ message: "Lỗi máy chủ nội bộ khi lọc sản phẩm theo giá." });
  }
};

module.exports = {
  getAllBonsais,
  getProductById,
  getRelatedProducts,
  getFeaturedBonsais,
  getBonsaiCategories,
  getBonsaisByCategory,
  getBonsaisByPriceRange,
};

// server/controllers/bonsaiController.js
const Bonsai = require('../models/bonsai.js');

// Trả về sản phẩm MỚI NHẤT
const getAllBonsais = async (req, res) => {
    try {
        const bonsais = await Bonsai.find({}).sort({ createdAt: -1 });
        res.status(200).json(bonsais);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// Trả về một sản phẩm theo ID
const getProductById = async (req, res) => {
    try {
        const product = await Bonsai.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// Trả về các sản phẩm liên quan
const getRelatedProducts = async (req, res) => {
    try {
        const currentProduct = await Bonsai.findById(req.params.id);
        if (!currentProduct) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm gốc' });
        }
        const relatedProducts = await Bonsai.find({
            category: currentProduct.category,
            _id: { $ne: req.params.id }
        }).limit(5);
        res.json(relatedProducts);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// Trả về sản phẩm NỔI BẬT
const getFeaturedBonsais = async (req, res) => {
    try {
        const featuredBonsais = await Bonsai.find({ isFeatured: true }).limit(8);
        res.json(featuredBonsais);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// Trả về danh sách các danh mục duy nhất
const getBonsaiCategories = async (req, res) => {
    try {
        const categories = await Bonsai.distinct('category');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// Trả về các sản phẩm thuộc một danh mục cụ thể
const getBonsaisByCategory = async (req, res) => {
    try {
        const products = await Bonsai.find({ category: req.params.categoryName });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// ĐẢM BẢO BẠN EXPORT ĐẦY ĐỦ CÁC HÀM NÀY
module.exports = {
    getAllBonsais,
    getProductById,
    getRelatedProducts,
    getFeaturedBonsais,
    getBonsaiCategories,
    getBonsaisByCategory,
};

const Bonsai = require('../models/bonsai.js'); // Import model Bonsai

const getAllBonsais = async (req, res) => {
    try {
        // Dùng model 'Bonsai' để tìm tất cả sản phẩm trong DB
        const productsFromDB = await Bonsai.find({}); 
        res.status(200).json(productsFromDB);
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu bonsai:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};
const getProductById = async (req, res) => {
    try {
        const product = await Bonsai.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            // Dùng status 404 nếu không tìm thấy sản phẩm
            res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

const getRelatedProducts = async (req, res) => {
    try {
        // 1. Tìm sản phẩm hiện tại để lấy category
        const currentProduct = await Bonsai.findById(req.params.id);

        if (!currentProduct) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm gốc' });
        }

        // 2. Tìm các sản phẩm khác cùng category, trừ sản phẩm hiện tại
        const relatedProducts = await Bonsai.find({
            category: currentProduct.category,      // Cùng category
            _id: { $ne: req.params.id }             // Loại trừ chính nó
        }).limit(5); // Giới hạn 5 sản phẩm liên quan

        res.json(relatedProducts);
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm liên quan:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

module.exports = {
    getAllBonsais,
    getProductById,
     getRelatedProducts,
};
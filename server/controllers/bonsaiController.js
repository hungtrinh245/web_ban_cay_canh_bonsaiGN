
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

module.exports = {
    getAllBonsais,
};
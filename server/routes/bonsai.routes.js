// server/routes/bonsai.routes.js
const express = require("express");
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // Middleware bảo vệ route

const {
    getAllBonsais,
    getProductById,
    getRelatedProducts,
    getFeaturedBonsais,
    getBonsaiCategories,
    getBonsaisByCategory,
    getBonsaisByPriceRange,
    searchBonsais, 
    createProductReview, 
} = require('../controllers/bonsaiController');

// ĐẶT CÁC ROUTE CỤ THỂ HƠN LÊN TRÊN CÁC ROUTE TỔNG QUÁT (:id)
router.get("/featured", getFeaturedBonsais);
router.get("/categories", getBonsaiCategories);

// Các route có tham số query (filter, search) thường nên đứng trước các route có param (:id)
router.get("/category/:categoryName", getBonsaisByCategory);
router.get("/filter-products", getBonsaisByPriceRange);
router.get("/search", searchBonsais); // trc /:id
router.get("/", getAllBonsais); 

// Route cho một sản phẩm theo ID (phải ở dưới cùng của các route bonsai chính)
router.get("/:id", getProductById);

// Route cho sản phẩm liên quan (phải ở dưới cùng vì nó cũng có :id)
router.get("/:id/related", getRelatedProducts);

// Route để tạo đánh giá mới cho sản phẩm (bảo vệ bằng protect)
router.post('/:id/reviews', protect, createProductReview);

module.exports = router;
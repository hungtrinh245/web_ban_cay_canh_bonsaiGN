// server/routes/bonsai.routes.js
const express = require("express");
const router = express.Router();
// DÒNG NÀY RẤT QUAN TRỌNG: ĐẢM BẢO protect VÀ authorize ĐƯỢC IMPORT
const { protect, authorize } = require('../middleware/authMiddleware'); 

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
    createBonsai,
    updateBonsai,
    deleteBonsai,
} = require('../controllers/bonsaiController');

// --- CÁC ROUTE CÔNG KHAI (Public Routes) ---
router.get("/featured", getFeaturedBonsais);
router.get("/categories", getBonsaiCategories);
router.get("/category/:categoryName", getBonsaisByCategory);
router.get("/filter-products", getBonsaisByPriceRange);
router.get("/search", searchBonsais);
router.get("/", getAllBonsais); 
router.get("/:id", getProductById); 
router.get("/:id/related", getRelatedProducts);

// --- ROUTE ĐẶT BIỆT CHO ĐÁNH GIÁ (cần bảo vệ) ---
router.post('/:id/reviews', protect, createProductReview);

// --- CÁC ROUTE QUẢN LÝ CHO ADMIN (Protected & Authorized Routes) ---
// Yêu cầu đăng nhập (protect) và phải có vai trò 'admin' (authorize('admin'))
router.post('/', protect, authorize('admin'), createBonsai); // Tạo sản phẩm
router.put('/:id', protect, authorize('admin'), updateBonsai); // Cập nhật sản phẩm
router.delete('/:id', protect, authorize('admin'), deleteBonsai); // Xóa sản phẩm

module.exports = router;
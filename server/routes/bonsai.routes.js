
const express = require("express");
const router = express.Router();

const {
    getAllBonsais,
    getProductById,
    getRelatedProducts,
    getFeaturedBonsais,
    getBonsaiCategories,
    getBonsaisByCategory
} = require('../controllers/bonsaiController');

// Route này trả về SẢN PHẨM MỚI
router.get("/", getAllBonsais);

// Route này trả về SẢN PHẨM NỔI BẬT
router.get("/featured", getFeaturedBonsais);

// Route này trả về DANH SÁCH CÁC CATEGORY
router.get("/categories", getBonsaiCategories);

// Route này trả về SẢN PHẨM THEO CATEGORY
router.get("/category/:categoryName", getBonsaisByCategory);

// Route này trả về MỘT SẢN PHẨM THEO ID
router.get("/:id", getProductById);

// Route này trả về SẢN PHẨM LIÊN QUAN
router.get("/:id/related", getRelatedProducts);

module.exports = router;
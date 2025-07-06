// server/routes/bonsai.routes.js
const express = require("express");
const router = express.Router();

const {
  getAllBonsais,
  getProductById,
  getRelatedProducts,
  getFeaturedBonsais,
  getBonsaiCategories,
  getBonsaisByCategory,
  getBonsaisByPriceRange,
  searchBonsais
} = require("../controllers/bonsaiController");
//tìm kiếm sản phẩm theo từ khoas
router.get("/search", searchBonsais);

// Route này trả về SẢN PHẨM NỔI BẬT
router.get("/featured", getFeaturedBonsais);

// Route này trả về DANH SÁCH CÁC CATEGORY
router.get("/categories", getBonsaiCategories);

// Route này trả về SẢN PHẨM THEO CATEGORY
router.get("/category/:categoryName", getBonsaisByCategory);

// Route này trả về SẢN PHẨM THEO KHOẢNG GIÁ VÀ DANH MỤC
router.get("/filter-products", getBonsaisByPriceRange);

// Route này trả về SẢN PHẨM MỚI
router.get("/", getAllBonsais);

// Route này trả về MỘT SẢN PHẨM THEO ID
router.get("/:id", getProductById);

// Route này trả về SẢN PHẨM LIÊN QUAN
router.get("/:id/related", getRelatedProducts);



module.exports = router;

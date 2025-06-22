const express = require("express");
const router = express.Router();
const {
  getAllBonsais,
  getProductById,
  getRelatedProducts,
} = require("../controllers/bonsaiController");

// Định nghĩa các route
// GET /api/bonsais
router.get("/", getAllBonsais);

// GET /api/bonsais/:id
router.get("/:id", getProductById);

// GET /api/bonsais/:id/related
router.get("/:id/related", getRelatedProducts);
module.exports = router;

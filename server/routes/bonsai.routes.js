const express = require("express");
const router = express.Router();
const {
  getAllBonsais,
  getProductById,
} = require("../controllers/bonsaiController");

// Định nghĩa các route
// GET /api/bonsais
router.get("/", getAllBonsais);

// GET /api/bonsais/:id
router.get("/:id", getProductById);

module.exports = router;

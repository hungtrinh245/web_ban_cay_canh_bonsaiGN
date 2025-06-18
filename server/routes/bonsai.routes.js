const express = require("express");
const router = express.Router();

const bonsais = [
  { id: 1, name: "Cây Tùng", price: 1000000 },
  { id: 2, name: "Cây Sanh", price: 800000 },
  { id: 3, name: "Cây Mai", price: 1200000 }
];

// GET: Lấy danh sách cây bonsai
router.get("/", (req, res) => {
  res.json(bonsais);
});

module.exports = router;

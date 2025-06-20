const express = require("express");
const router = express.Router();

const { getAllBonsais } = require("../controllers/bonsaiController");

router.get("/", getAllBonsais);

module.exports = router;

// server/routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const { sendContactMessage } = require('../controllers/contactController');

router.post('/', sendContactMessage); // Endpoint để gửi tin nhắn liên hệ

module.exports = router;
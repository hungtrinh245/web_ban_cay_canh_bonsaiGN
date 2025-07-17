// server/routes/chatbotRoutes.js
const express = require('express');
const router = express.Router();

const { getChatbotResponse } = require('../controllers/chatbotController');

// Route để gửi tin nhắn đến chatbot
router.post('/message', getChatbotResponse); 

module.exports = router;
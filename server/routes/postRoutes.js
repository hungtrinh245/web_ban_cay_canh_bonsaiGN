// server/routes/postRoutes.js
const express = require('express');
const router = express.Router();
const { getPosts, getPostById, getLatestPosts, getFeaturedPosts } = require('../controllers/postController');

// Route để lấy tất cả bài viết (hỗ trợ phân trang qua query params)
router.get('/', getPosts);

// Route để lấy bài viết mới nhất (cho homepage, giới hạn cố định)
router.get('/latest', getLatestPosts);

// Route để lấy bài viết nổi bật
router.get('/featured', getFeaturedPosts);

// Route để lấy một bài viết theo ID(đặt cuối)
router.get('/:id', getPostById);

module.exports = router;
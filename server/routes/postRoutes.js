// server/routes/postRoutes.js
const express = require('express');
const router = express.Router();
const { getPosts, getPostById, getLatestPosts, getFeaturedPosts } = require('../controllers/postController');
// const { protect, authorize } = require('../middleware/authMiddleware'); // Uncomment nếu cần bảo vệ route (ví dụ cho admin)

// Route để lấy tất cả bài viết
router.get('/', getPosts);

// Route để lấy bài viết mới nhất (cho homepage)
router.get('/latest', getLatestPosts);

// Route để lấy bài viết nổi bật
router.get('/featured', getFeaturedPosts);

// Route để lấy một bài viết theo ID
router.get('/:id', getPostById);

module.exports = router;
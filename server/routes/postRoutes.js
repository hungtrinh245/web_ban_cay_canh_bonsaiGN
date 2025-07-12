// server/routes/postRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

const { 
    getPosts, getPostById, getLatestPosts, getFeaturedPosts,
    createPost, updatePost, deletePost, // ĐẢM BẢO CÁC HÀM NÀY ĐƯỢC IMPORT
} = require('../controllers/postController');

// Public routes for posts
router.get('/', getPosts); // GET /api/posts (lấy tất cả bài viết)
router.get('/latest', getLatestPosts);
router.get('/featured', getFeaturedPosts);
router.get('/:id', getPostById);

// Admin Only routes for posts (CRUD)
router.post('/', protect, authorize('admin'), createPost);
router.put('/:id', protect, authorize('admin'), updatePost);
router.delete('/:id', protect, authorize('admin'), deletePost);

module.exports = router;
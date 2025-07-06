// server/controllers/postController.js
const Post = require('../models/Post');

const paginatePost = async (req) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5; 
    const skip = (page - 1) * limit;

    let query = {};


    const totalDocuments = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalDocuments / limit);

    const results = await Post.find(query)
                                .sort({ createdAt: -1 })
                                .skip(skip)
                                .limit(limit);

    return {
        posts: results,
        page,
        limit,
        totalPages,
        totalDocuments,
    };
};

// @desc  Nhận tất cả các bài đăng trên blog có phân trang
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
    try {
        const { posts, page, limit, totalPages, totalDocuments } = await paginatePost(req);
        res.status(200).json({
            posts,
            page,
            limit,
            totalPages,
            totalDocuments,
        });
    } catch (error) {
        console.error('Lỗi khi lấy tất cả bài viết với phân trang:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi lấy bài viết.' });
    }
};

// @desc   Nhận bài đăng blog đơn lẻ theo ID
// @route   GET /api/posts/:id
// @access  Public
const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post) {
            post.views = (post.views || 0) + 1;
            await post.save();
            res.json(post);
        } else {
            res.status(404).json({ message: 'Không tìm thấy bài viết.' });
        }
    } catch (error) {
        console.error(`Lỗi khi lấy bài viết ID ${req.params.id}:`, error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'ID bài viết không hợp lệ.' });
        }
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi lấy bài viết.' });
    }
};

// @desc    Nhận bài viết blog mới nhất
// @route   GET /api/posts/latest
// @access  Public
const getLatestPosts = async (req, res) => {
    try {
        const latestPosts = await Post.find({}).sort({ createdAt: -1 }).limit(3);
        res.status(200).json(latestPosts);
    } catch (error) {
        console.error('Lỗi khi lấy bài viết mới nhất:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi lấy bài viết mới nhất.' });
    }
};

// @desc   Nhận bài đăng blog nổi bật (giới hạn cố định)
// @route   GET /api/posts/featured
// @access  Public
const getFeaturedPosts = async (req, res) => {
    try {
        const featuredPosts = await Post.find({ isFeatured: true }).sort({ createdAt: -1 }).limit(3);
        res.status(200).json(featuredPosts);
    } catch (error) {
        console.error('Lỗi khi lấy bài viết nổi bật:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi lấy bài viết nổi bật.' });
    }
};

module.exports = {
    getPosts,
    getPostById,
    getLatestPosts,
    getFeaturedPosts,
};
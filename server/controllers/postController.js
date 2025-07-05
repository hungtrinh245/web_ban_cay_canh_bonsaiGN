// server/controllers/postController.js
const Post = require('../models/Post');

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).sort({ createdAt: -1 }); // Lấy bài viết mới nhất
        res.status(200).json(posts);
    } catch (error) {
        console.error('Lỗi khi lấy tất cả bài viết:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi lấy bài viết.' });
    }
};


const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post) {
            // Tăng số lượt xem (tùy chọn)
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

const getLatestPosts = async (req, res) => {
    try {
        const latestPosts = await Post.find({}).sort({ createdAt: -1 }).limit(3); // Lấy 3 bài mới nhất
        res.status(200).json(latestPosts);
    } catch (error) {
        console.error('Lỗi khi lấy bài viết mới nhất:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi lấy bài viết mới nhất.' });
    }
};


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
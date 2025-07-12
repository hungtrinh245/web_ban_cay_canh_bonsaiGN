// server/controllers/postController.js
const Post = require('../models/Post');
const mongoose = require('mongoose');

const paginatePost = async (req) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    let query = {};
    if (req.query.category && req.query.category !== 'null' && req.query.category !== 'undefined') {
        query.category = req.query.category;
    }
    if (req.query.keyword) {
        query.title = { $regex: req.query.keyword, $options: 'i' };
    }

    const totalDocuments = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalDocuments / limit);

    const results = await Post.find(query)
                                .sort({ createdAt: -1 })
                                .skip(skip)
                                .limit(limit);

    return { posts: results, page, limit, totalPages, totalDocuments };
};

const getPosts = async (req, res) => {
    try {
        const { posts, page, limit, totalPages, totalDocuments } = await paginatePost(req);
        res.status(200).json({ posts, page, limit, totalPages, totalDocuments });
    } catch (error) {
        console.error('Lỗi khi lấy tất cả bài viết với phân trang:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi lấy bài viết.' });
    }
};

const getPostById = async (req, res) => {
    try {
        const postId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'ID bài viết không hợp lệ.' });
        }
        const post = await Post.findById(postId);
        if (post) {
            post.views = (post.views || 0) + 1;
            await post.save();
            res.json(post);
        } else {
            res.status(404).json({ message: 'Không tìm thấy bài viết.' });
        }
    } catch (error) {
        console.error(`Lỗi khi lấy bài viết ID ${req.params.id}:`, error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi lấy bài viết.' });
    }
};

const getLatestPosts = async (req, res) => {
    try {
        const latestPosts = await Post.find({}).sort({ createdAt: -1 }).limit(3);
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

const createPost = async (req, res) => {
    try {
        const { title, excerpt, content, image, author, category, tags, isFeatured } = req.body;
        const post = await Post.create({ title, excerpt, content, image, author, category, tags, isFeatured });
        res.status(201).json(post);
    } catch (error) {
        console.error('Lỗi khi tạo bài viết mới:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi tạo bài viết.' });
    }
};

const updatePost = async (req, res) => {
    const { title, excerpt, content, image, author, category, tags, isFeatured } = req.body;
    try {
        const post = await Post.findById(req.params.id);
        if (post) {
            post.title = title || post.title;
            post.excerpt = excerpt || post.excerpt;
            post.content = content || post.content;
            post.image = image || post.image;
            post.author = author || post.author;
            post.category = category || post.category;
            post.tags = tags || post.tags;
            post.isFeatured = isFeatured !== undefined ? isFeatured : post.isFeatured;
            const updatedPost = await post.save();
            res.json(updatedPost);
        } else {
            res.status(404).json({ message: 'Không tìm thấy bài viết để cập nhật.' });
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật bài viết:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi cập nhật bài viết.' });
    }
};

const deletePost = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'ID bài viết không hợp lệ.' });
        }
        const post = await Post.findById(req.params.id);
        if (post) {
            await Post.deleteOne({ _id: req.params.id });
            res.json({ message: 'Bài viết đã được xóa thành công.' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy bài viết để xóa.' });
        }
    } catch (error) {
        console.error('Lỗi khi xóa bài viết:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi xóa bài viết.' });
    }
};

module.exports = {
    getPosts, getPostById, getLatestPosts, getFeaturedPosts,
    createPost, updatePost, deletePost, 
};
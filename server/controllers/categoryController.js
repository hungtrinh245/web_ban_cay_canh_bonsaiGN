// server/controllers/categoryController.js
const Category = require('../models/Category');
const mongoose = require('mongoose');

// @desc    Get all categories (Public & Admin)
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({}).sort({ name: 1 }); // Sắp xếp theo tên
        res.json(categories);
    } catch (error) {
        console.error('Lỗi khi lấy tất cả danh mục:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi lấy danh mục.' });
    }
};

// @desc    Get single category by ID (Admin Only, if needed)
// @route   GET /api/categories/:id
// @access  Private/Admin
const getCategoryById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'ID danh mục không hợp lệ.' });
        }
        const category = await Category.findById(req.params.id);
        if (category) {
            res.json(category);
        } else {
            res.status(404).json({ message: 'Không tìm thấy danh mục.' });
        }
    } catch (error) {
        console.error('Lỗi khi lấy danh mục theo ID:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi lấy danh mục.' });
    }
};

// @desc    Create new category (Admin Only)
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
    const { name, description } = req.body;
    try {
        if (!name) {
            return res.status(400).json({ message: 'Tên danh mục không được để trống.' });
        }
        const categoryExists = await Category.findOne({ name: name });
        if (categoryExists) {
            return res.status(400).json({ message: 'Danh mục này đã tồn tại.' });
        }
        const newCategory = await Category.create({ name, description });
        res.status(201).json(newCategory);
    } catch (error) {
        console.error('Lỗi khi tạo danh mục mới:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi tạo danh mục.' });
    }
};

// @desc    Update category (Admin Only)
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
    const { name, description } = req.body;
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'ID danh mục không hợp lệ.' });
        }
        const category = await Category.findById(req.params.id);
        if (category) {
            category.name = name || category.name;
            category.description = description || category.description;
            const updatedCategory = await category.save();
            res.json(updatedCategory);
        } else {
            res.status(404).json({ message: 'Không tìm thấy danh mục để cập nhật.' });
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật danh mục:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Tên danh mục này đã tồn tại.' });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi cập nhật danh mục.' });
    }
};

// @desc    Delete category (Admin Only)
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'ID danh mục không hợp lệ.' });
        }
        const category = await Category.findById(req.params.id);
        if (category) {
            await Category.deleteOne({ _id: req.params.id });
            res.json({ message: 'Danh mục đã được xóa thành công.' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy danh mục để xóa.' });
        }
    } catch (error) {
        console.error('Lỗi khi xóa danh mục:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi xóa danh mục.' });
    }
};

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};
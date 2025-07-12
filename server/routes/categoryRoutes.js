// server/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

const {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} = require('../controllers/categoryController');

// Public route to get all categories
router.get('/', getCategories);

// Admin Only routes for Categories (CRUD)
router.post('/', protect, authorize('admin'), createCategory);
router.put('/:id', protect, authorize('admin'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

module.exports = router;
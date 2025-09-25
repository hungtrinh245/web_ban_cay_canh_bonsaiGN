// server/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const Bonsai = require('../models/bonsai');
const { protect, authorize } = require('../middleware/authMiddleware');

// Route public để test (tạm thời)
router.get('/test', async (req, res) => {
    try {
        console.log('API /test được gọi');
        const categories = await Category.find({})
            .select('name description image isActive sortOrder')
            .sort({ sortOrder: 1, name: 1 })
            .lean();
        
        console.log('Số categories tìm thấy:', categories.length);
        
        // Lấy số sản phẩm cho mỗi danh mục
        for (let category of categories) {
            const productCount = await Bonsai.countDocuments({ category: category._id });
            category.productCount = productCount;
        }
        
        res.json({
            message: 'Test categories thành công',
            count: categories.length,
            categories
        });
    } catch (error) {
        console.error('Lỗi trong route /test:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Route public để test tạo danh mục (tạm thời)
router.post('/test-create', async (req, res) => {
    try {
        console.log('API /test-create được gọi với data:', req.body);
        const { name, description, image } = req.body;

        // Kiểm tra tên danh mục đã tồn tại
        const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (existingCategory) {
            return res.status(400).json({ message: 'Tên danh mục đã tồn tại' });
        }

        const category = new Category({
            name,
            description,
            image: image || '/images/sample-tung-la-han.jpg',
            isActive: true,
            sortOrder: 999
        });

        await category.save();
        
        res.status(201).json({
            message: 'Tạo danh mục thành công',
            category
        });
    } catch (error) {
        console.error('Lỗi trong route /test-create:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Route public để test xóa danh mục (tạm thời)
router.delete('/test-delete/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        console.log('API /test-delete được gọi với ID:', categoryId);

        // Kiểm tra danh mục tồn tại
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục' });
        }

        // Kiểm tra có sản phẩm nào đang sử dụng danh mục này không
        const productCount = await Bonsai.countDocuments({ category: categoryId });
        if (productCount > 0) {
            return res.status(400).json({ 
                message: `Không thể xóa danh mục "${category.name}" vì có ${productCount} sản phẩm đang sử dụng` 
            });
        }

        // Kiểm tra có danh mục con nào không
        const childCategories = await Category.countDocuments({ parentCategory: categoryId });
        if (childCategories > 0) {
            return res.status(400).json({ 
                message: `Không thể xóa danh mục "${category.name}" vì có ${childCategories} danh mục con` 
            });
        }

        // Xóa danh mục
        await Category.findByIdAndDelete(categoryId);
        
        res.json({
            message: `Xóa danh mục "${category.name}" thành công`
        });
    } catch (error) {
        console.error('Lỗi trong route /test-delete:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Middleware kiểm tra quyền admin
router.use(protect, authorize('admin'));

// GET: Lấy danh sách tất cả danh mục
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', sortBy = 'sortOrder', sortOrder = 'asc' } = req.query;
        
        // Xây dựng query
        let query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Xây dựng sort
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Thực hiện query với pagination
        const categories = await Category.find(query)
            .populate('parentCategory', 'name')
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        // Đếm tổng số danh mục
        const total = await Category.countDocuments(query);

        // Lấy số sản phẩm cho mỗi danh mục
        for (let category of categories) {
            const productCount = await Bonsai.countDocuments({ category: category._id });
            category.productCount = productCount;
        }

        res.json({
            categories,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// GET: Lấy danh sách danh mục cho dropdown (không có pagination)
router.get('/list', async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true })
            .select('name _id parentCategory')
            .sort({ sortOrder: 1, name: 1 })
            .lean();

        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// GET: Lấy danh mục theo ID
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
            .populate('parentCategory', 'name _id')
            .lean();

        if (!category) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục' });
        }

        // Lấy số sản phẩm trong danh mục
        const productCount = await Bonsai.countDocuments({ category: category._id });
        category.productCount = productCount;

        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// POST: Tạo danh mục mới
router.post('/', async (req, res) => {
    try {
        const { name, description, image, parentCategory, metaTitle, metaDescription, sortOrder } = req.body;

        // Kiểm tra tên danh mục đã tồn tại
        const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (existingCategory) {
            return res.status(400).json({ message: 'Tên danh mục đã tồn tại' });
        }

        // Kiểm tra parent category nếu có
        if (parentCategory) {
            const parentExists = await Category.findById(parentCategory);
            if (!parentExists) {
                return res.status(400).json({ message: 'Danh mục cha không tồn tại' });
            }
        }

        const category = new Category({
            name,
            description,
            image,
            parentCategory,
            metaTitle,
            metaDescription,
            sortOrder: sortOrder || 0
        });

        await category.save();
        res.status(201).json({ message: 'Tạo danh mục thành công', category });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Dữ liệu không hợp lệ', error: error.message });
        }
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// PUT: Cập nhật danh mục
router.put('/:id', async (req, res) => {
    try {
        const { name, description, image, parentCategory, metaTitle, metaDescription, sortOrder, isActive } = req.body;
        const categoryId = req.params.id;

        // Kiểm tra danh mục tồn tại
        const existingCategory = await Category.findById(categoryId);
        if (!existingCategory) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục' });
        }

        // Kiểm tra tên danh mục đã tồn tại (trừ danh mục hiện tại)
        if (name && name !== existingCategory.name) {
            const duplicateName = await Category.findOne({ 
                name: { $regex: new RegExp(`^${name}$`, 'i') },
                _id: { $ne: categoryId }
            });
            if (duplicateName) {
                return res.status(400).json({ message: 'Tên danh mục đã tồn tại' });
            }
        }

        // Kiểm tra parent category (không được set chính nó làm parent)
        if (parentCategory && parentCategory === categoryId) {
            return res.status(400).json({ message: 'Danh mục không thể là parent của chính nó' });
        }

        // Kiểm tra parent category tồn tại
        if (parentCategory) {
            const parentExists = await Category.findById(parentCategory);
            if (!parentExists) {
                return res.status(400).json({ message: 'Danh mục cha không tồn tại' });
            }
        }

        // Cập nhật danh mục
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            {
                name,
                description,
                image,
                parentCategory,
                metaTitle,
                metaDescription,
                sortOrder,
                isActive
            },
            { new: true, runValidators: true }
        );

        res.json({ message: 'Cập nhật danh mục thành công', category: updatedCategory });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Dữ liệu không hợp lệ', error: error.message });
        }
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// DELETE: Xóa danh mục
router.delete('/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;

        // Kiểm tra danh mục tồn tại
        const existingCategory = await Category.findById(categoryId);
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục' });
        }

        // Kiểm tra có sản phẩm nào đang sử dụng danh mục này không
        const productCount = await Bonsai.countDocuments({ category: categoryId });
        if (productCount > 0) {
            return res.status(400).json({ 
                message: `Không thể xóa danh mục "${category.name}" vì có ${productCount} sản phẩm đang sử dụng` 
            });
        }

        // Kiểm tra có danh mục con nào không
        const childCategories = await Category.countDocuments({ parentCategory: categoryId });
        if (childCategories > 0) {
            return res.status(400).json({ 
                message: `Không thể xóa danh mục "${category.name}" vì có ${childCategories} danh mục con` 
            });
        }

        // Xóa danh mục
        await Category.findByIdAndDelete(categoryId);
        res.json({ message: 'Xóa danh mục thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// PATCH: Thay đổi trạng thái active/inactive
router.patch('/:id/toggle-status', async (req, res) => {
    try {
        const categoryId = req.params.id;
        
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục' });
        }

        category.isActive = !category.isActive;
        await category.save();

        res.json({ 
            message: `Đã ${category.isActive ? 'kích hoạt' : 'vô hiệu hóa'} danh mục`,
            category 
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// PATCH: Cập nhật thứ tự sắp xếp
router.patch('/:id/sort-order', async (req, res) => {
    try {
        const { sortOrder } = req.body;
        const categoryId = req.params.id;

        if (typeof sortOrder !== 'number') {
            return res.status(400).json({ message: 'Thứ tự sắp xếp phải là số' });
        }

        const category = await Category.findByIdAndUpdate(
            categoryId,
            { sortOrder },
            { new: true }
        );

        if (!category) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục' });
        }

        res.json({ message: 'Cập nhật thứ tự thành công', category });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

module.exports = router;
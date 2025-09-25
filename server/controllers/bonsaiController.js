// server/controllers/bonsaiController.js
const Bonsai = require('../models/bonsai.js');
const mongoose = require('mongoose');

// Hàm trợ giúp tính toán dữ liệu phân trang cho mô hình Bonsai
const paginateBonsai = async (req) => { 
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8; 
    const skip = (page - 1) * limit;

    let query = {};

   // Áp dụng bộ lọc danh mục(nếu có)
    if (req.query.category && req.query.category !== 'null' && req.query.category !== 'undefined') {
        try {
            // Sử dụng mongoose.model thay vì require để tránh conflict
            const Category = mongoose.model('Category');
            console.log('Searching for category with name:', req.query.category);
            
            // Tìm Category theo tên để lấy ObjectId
            const category = await Category.findOne({ name: req.query.category });
            console.log('Category search result:', category);
            
            if (category) {
                query.category = category._id;
                console.log('Found category:', category.name, 'with ID:', category._id);
            } else {
                console.log('Category not found:', req.query.category);
                // Thử tìm tất cả categories để debug
                const allCategories = await Category.find({});
                console.log('All available categories:', allCategories.map(c => c.name));
                // Nếu không tìm thấy danh mục, trả về kết quả rỗng
                query.category = null;
            }
        } catch (error) {
            console.error('Error finding category:', error);
            query.category = null;
        }
    }
// Áp dụng tìm kiếm từ khóa (nếu có)
    if (req.query.keyword) {
        query.name = { $regex: req.query.keyword, $options: 'i' };
    }

// Áp dụng bộ lọc phạm vi giá (nếu có)
    const minPriceNum = req.query.min ? Number(req.query.min) : undefined;
    const maxPriceNum = req.query.max ? Number(req.query.max) : undefined;
    if (!isNaN(minPriceNum) && minPriceNum !== undefined) {
        query.price = { ...query.price, $gte: minPriceNum };
    }
    if (!isNaN(maxPriceNum) && maxPriceNum !== undefined) {
        query.price = { ...query.price, $lte: maxPriceNum };
    }

    const totalDocuments = await Bonsai.countDocuments(query);
    const totalPages = Math.ceil(totalDocuments / limit);

    const results = await Bonsai.find(query)
                                .sort({ createdAt: -1 })
                                .skip(skip)
                                .limit(limit);

    return {
        products: results, 
        page,
        limit,
        totalPages,
        totalDocuments,
    };
};

// @desc    Get all bonsais with pagination
// @route   GET /api/bonsais
// @access  Public
const getAllBonsais = async (req, res) => {
    try {
        const { products, page, limit, totalPages, totalDocuments } = await paginateBonsai(req);
        res.status(200).json({
            products,
            page,
            limit,
            totalPages,
            totalDocuments,
        });
    } catch (error) {
        console.error('Lỗi khi lấy tất cả sản phẩm với phân trang:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi lấy sản phẩm.' });
    }
};

// @desc    Get single bonsai by ID
// @route   GET /api/bonsais/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Bonsai.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
    } catch (error) {
        console.error(`Lỗi khi lấy sản phẩm ID ${req.params.id}:`, error);
        if (error.name === 'CastError') {
            return res.status(404).json({ message: 'Định dạng ID sản phẩm không hợp lệ.' });
        }
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi lấy sản phẩm.' });
    }
};

// @desc    Get related products
// @route   GET /api/bonsais/:id/related
// @access  Public
const getRelatedProducts = async (req, res) => {
    try {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Định dạng ID sản phẩm không hợp lệ.' });
        }

        const currentProduct = await Bonsai.findById(req.params.id);
        if (!currentProduct) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm gốc' });
        }
        const relatedProducts = await Bonsai.find({
            category: currentProduct.category,
            _id: { $ne: req.params.id }
        }).limit(5);
        res.json(relatedProducts);
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm liên quan:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi lấy sản phẩm liên quan.' });
    }
};

// @desc    Get featured bonsais (no pagination, fixed limit)
// @route   GET /api/bonsais/featured
// @access  Public
const getFeaturedBonsais = async (req, res) => {
    try {
        const featuredBonsais = await Bonsai.find({ isFeatured: true }).limit(8);
        res.json(featuredBonsais);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// @desc    Get unique bonsai categories
// @route   GET /api/bonsais/categories
// @access  Public
const getBonsaiCategories = async (req, res) => {
    try {
        const categories = await Bonsai.distinct('category');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// @desc    Get products by category with pagination
// @route   GET /api/bonsais/category/:categoryName
// @access  Public
const getBonsaisByCategory = async (req, res) => {
    try {
        // Thêm categoryName từ URL params vào query
        req.query.category = req.params.categoryName;
        console.log('getBonsaisByCategory - categoryName from params:', req.params.categoryName);
        console.log('getBonsaisByCategory - query.category:', req.query.category);
        
        const { products, page, limit, totalPages, totalDocuments } = await paginateBonsai(req);
        res.json({
            products,
            page,
            limit,
            totalPages,
            totalDocuments,
        });
    } catch (error) {
        console.error(`Lỗi khi lấy sản phẩm theo danh mục ${req.params.categoryName} với phân trang:`, error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
    }
};

// @desc    Get bonsais by price range with pagination
// @route   GET /api/bonsais/filter-products
// @access  Public
const getBonsaisByPriceRange = async (req, res) => {
    try {
        const { products, page, limit, totalPages, totalDocuments } = await paginateBonsai(req);
        res.json({
            products,
            page,
            limit,
            totalPages,
            totalDocuments,
        });
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm theo khoảng giá với phân trang:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
    }
};

// @desc    Search bonsais by keyword with pagination
// @route   GET /api/bonsais/search
// @access  Public
const searchBonsais = async (req, res) => {
    // Keyword is handled by paginateBonsai helper from req.query
    try {
        const { products, page, limit, totalPages, totalDocuments } = await paginateBonsai(req);
        res.json({
            products,
            page,
            limit,
            totalPages,
            totalDocuments,
        });
    } catch (error) {
        console.error('Lỗi khi tìm kiếm sản phẩm với phân trang:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi tìm kiếm.' });
    }
};

// @desc    Create new review
// @route   POST /api/bonsais/:id/reviews
// @access  Private (Only logged-in users can review)
const createProductReview = async (req, res) => {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    try {
        const product = await Bonsai.findById(productId);

        if (product) {
            const alreadyReviewed = product.reviews.find(
                (r) => r.user.toString() === req.user._id.toString()
            );

            if (alreadyReviewed) {
                res.status(400).json({ message: 'Bạn đã đánh giá sản phẩm này rồi.' });
                return;
            }

            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id,
            };

            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating =
                product.reviews.reduce((acc, item) => item.rating + acc, 0) /
                product.reviews.length;

            await product.save();
            res.status(201).json({ message: 'Đánh giá sản phẩm thành công!' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
        }
    } catch (error) {
        console.error('Lỗi khi tạo đánh giá sản phẩm:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi tạo đánh giá.' });
    }
};


//ADMIN (CRUD Sản phẩm) ---

// @desc    Create a new bonsai product
// @route   POST /api/bonsais
// @access  Private/Admin
const createBonsai = async (req, res) => {
    try {
        // Tạo sản phẩm mới với dữ liệu từ req.body
        const { name, description, price, images, category, stockQuantity, isFeatured } = req.body;

        const bonsai = await Bonsai.create({
            name,
            description,
            price,
            images, // Mảng các URL hình ảnh
            category,
            stockQuantity,
            isFeatured: isFeatured || false,
            // rating và numReviews sẽ được tính toán tự động
        });

        res.status(201).json(bonsai); // Trả về sản phẩm đã tạo

    } catch (error) {
        console.error('Lỗi khi tạo sản phẩm mới:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi tạo sản phẩm.' });
    }
};

// @desc    Update a bonsai product
// @route   PUT /api/bonsais/:id
// @access  Private/Admin
const updateBonsai = async (req, res) => {
    const { name, description, price, images, category, stockQuantity, isFeatured } = req.body;
    const productId = req.params.id;

    try {
        const bonsai = await Bonsai.findById(productId);

        if (bonsai) {
            bonsai.name = name || bonsai.name;
            bonsai.description = description || bonsai.description;
            bonsai.price = price || bonsai.price;
            bonsai.images = images || bonsai.images; // Cập nhật toàn bộ mảng ảnh
            bonsai.category = category || bonsai.category;
            bonsai.stockQuantity = stockQuantity !== undefined ? stockQuantity : bonsai.stockQuantity;
            bonsai.isFeatured = isFeatured !== undefined ? isFeatured : bonsai.isFeatured;

            const updatedBonsai = await bonsai.save();
            res.json(updatedBonsai);
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm để cập nhật.' });
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật sản phẩm:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi cập nhật sản phẩm.' });
    }
};

// @desc    Delete a bonsai product
// @route   DELETE /api/bonsais/:id
// @access  Private/Admin
const deleteBonsai = async (req, res) => {
    const productId = req.params.id;

    try {
        // Validate if productId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'ID sản phẩm không hợp lệ.' });
        }

        const bonsai = await Bonsai.findById(productId);

        if (bonsai) {
            await Bonsai.deleteOne({ _id: productId }); // Use deleteOne for Mongoose 5.x/6.x
            res.json({ message: 'Sản phẩm đã được xóa thành công.' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm để xóa.' });
        }
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        // Catch any other potential errors during deletion
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi xóa sản phẩm.' });
    }
};


module.exports = {
    getAllBonsais,
    getProductById,
    getRelatedProducts,
    getFeaturedBonsais,
    getBonsaiCategories,
    getBonsaisByCategory,
    getBonsaisByPriceRange,
    searchBonsais,
    createProductReview,
    createBonsai, 
    updateBonsai, 
    deleteBonsai,
};
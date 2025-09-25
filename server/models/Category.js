// server/models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tên danh mục là bắt buộc'],
        trim: true,
        unique: true,
        maxlength: [100, 'Tên danh mục không được quá 100 ký tự'],
        index: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Mô tả không được quá 500 ký tự']
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    image: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    sortOrder: {
        type: Number,
        default: 0
    },
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    metaTitle: {
        type: String,
        maxlength: [60, 'Meta title không được quá 60 ký tự']
    },
    metaDescription: {
        type: String,
        maxlength: [160, 'Meta description không được quá 160 ký tự']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual field để đếm số sản phẩm trong danh mục
categorySchema.virtual('productCount', {
    ref: 'Bonsai',
    localField: '_id',
    foreignField: 'category',
    count: true
});

// Middleware để tạo slug tự động
categorySchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    }
    next();
});

// Middleware để kiểm tra trước khi xóa
categorySchema.pre('remove', async function(next) {
    try {
        const Bonsai = mongoose.model('Bonsai');
        const productCount = await Bonsai.countDocuments({ category: this._id });
        
        if (productCount > 0) {
            throw new Error(`Không thể xóa danh mục "${this.name}" vì có ${productCount} sản phẩm đang sử dụng`);
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Index để tối ưu truy vấn
categorySchema.index({ isActive: 1 });
categorySchema.index({ sortOrder: 1 });

module.exports = mongoose.model('Category', categorySchema);
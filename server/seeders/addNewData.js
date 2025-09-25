const mongoose = require('mongoose');
require('dotenv').config();
const Category = require('../models/Category');
const Bonsai = require('../models/Bonsai');

// Kết nối database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });
        console.log('✅ Đã kết nối tới MongoDB');
        return true;
    } catch (error) {
        console.error('❌ Lỗi kết nối MongoDB:', error.message);
        return false;
    }
};

// Danh sách các danh mục mới cần thêm
const newCategories = [
    {
        name: 'Cây Nội Thất',
        description: 'Các loại cây cảnh phù hợp để trang trí nội thất',
        image: '/images/categories/noi-that.jpg',
        sortOrder: 6,
        isActive: true
    },
    {
        name: 'Cây Thủy Sinh',
        description: 'Các loại cây sống trong môi trường nước',
        image: '/images/categories/thuy-sinh.jpg',
        sortOrder: 7,
        isActive: true
    }
];

// Danh sách các sản phẩm mới
const newProducts = [
    // Cây Nội Thất
    {
        name: 'Cây Lưỡi Hổ',
        description: 'Cây lưỡi hổ thanh lọc không khí',
        price: 350000,
        stockQuantity: 20,
        images: ['/images/products/luoi-ho.jpg']
    },
    {
        name: 'Cây Kim Tiền',
        description: 'Cây kim tiền phong thủy',
        price: 450000,
        stockQuantity: 15,
        images: ['/images/products/kim-tien.jpg']
    },
    // Cây Thủy Sinh
    {
        name: 'Rong Đuôi Chồn',
        description: 'Cây thủy sinh dễ trồng',
        price: 25000,
        stockQuantity: 50,
        images: ['/images/products/rong-duoi-chon.jpg']
    },
    {
        name: 'Trân Châu Ngọc Trai',
        description: 'Cây thủy sinh tạo thảm đẹp',
        price: 40000,
        stockQuantity: 30,
        images: ['/images/products/tran-chau-ngoc-trai.jpg']
    }
];

// Hàm tạo slug
const createSlug = (name) => {
    return name.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
};

// Hàm chính
const seedData = async () => {
    console.log('🔄 Đang bắt đầu thêm dữ liệu mới...');
    
    // Kết nối database
    const isConnected = await connectDB();
    if (!isConnected) {
        console.log('❌ Không thể kết nối tới database');
        process.exit(1);
    }

    try {
        // Thêm danh mục mới
        console.log('\n📁 Đang thêm danh mục mới...');
        const createdCategories = [];
        
        for (const category of newCategories) {
            const slug = createSlug(category.name);
            const existingCategory = await Category.findOne({ slug });
            
            if (!existingCategory) {
                const newCategory = new Category({ ...category, slug });
                await newCategory.save();
                createdCategories.push(newCategory);
                console.log(`✅ Đã thêm danh mục: ${category.name}`);
            } else {
                createdCategories.push(existingCategory);
                console.log(`ℹ️ Danh mục đã tồn tại: ${category.name}`);
            }
        }

        // Thêm sản phẩm mới
        console.log('\n🛍️ Đang thêm sản phẩm mới...');
        for (let i = 0; i < createdCategories.length; i++) {
            const category = createdCategories[i];
            const startIdx = i * 2;
            const endIdx = startIdx + 2;
            const categoryProducts = newProducts.slice(startIdx, endIdx);
            
            for (const product of categoryProducts) {
                const slug = createSlug(product.name);
                const existingProduct = await Bonsai.findOne({ slug });
                
                if (!existingProduct) {
                    const newProduct = new Bonsai({
                        ...product,
                        slug,
                        category: category._id,
                        ratings: [],
                        numReviews: 0,
                        averageRating: 0
                    });
                    
                    await newProduct.save();
                    console.log(`✅ Đã thêm sản phẩm: ${product.name} (${category.name})`);
                } else {
                    console.log(`ℹ️ Sản phẩm đã tồn tại: ${product.name}`);
                }
            }
        }

        console.log('\n✨ Đã hoàn thành thêm dữ liệu mới!');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Lỗi khi thêm dữ liệu:', error.message);
        process.exit(1);
    }
};

// Chạy chương trình
seedData();

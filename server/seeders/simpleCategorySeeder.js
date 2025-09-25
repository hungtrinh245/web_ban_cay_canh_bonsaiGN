const mongoose = require('mongoose');
require('dotenv').config();

// Kết nối database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const Category = require('../models/category');

const simpleCategories = [
    {
        name: 'Cây Phong Thủy',
        description: 'Các loại cây cảnh mang lại may mắn, tài lộc và sức khỏe',
        image: '/images/categories/phong-thuy.jpg',
        sortOrder: 1,
        isActive: true
    },
    {
        name: 'Cây Lọc Không Khí',
        description: 'Cây cảnh có khả năng lọc không khí, hấp thụ chất độc hại',
        image: '/images/categories/loc-khong-khi.jpg',
        sortOrder: 2,
        isActive: true
    },
    {
        name: 'Cây Cảnh Truyền Thống',
        description: 'Các loại cây cảnh truyền thống của Việt Nam',
        image: '/images/categories/truyen-thong.jpg',
        sortOrder: 3,
        isActive: true
    },
    {
        name: 'Bonsai',
        description: 'Nghệ thuật tạo hình cây cảnh thu nhỏ theo phong cách Nhật Bản',
        image: '/images/categories/bonsai.jpg',
        sortOrder: 4,
        isActive: true
    },
    {
        name: 'Cây Dây Leo',
        description: 'Các loại cây dây leo trang trí, tạo không gian xanh mát',
        image: '/images/categories/day-leo.jpg',
        sortOrder: 5,
        isActive: true
    }
];

const seedSimpleCategories = async () => {
    try {
        await connectDB();
        
        // Kiểm tra xem đã có categories chưa
        const existingCount = await Category.countDocuments();
        if (existingCount > 0) {
            console.log(`Đã có ${existingCount} categories trong database. Bỏ qua seeding.`);
            process.exit(0);
        }

        // Thêm categories mới
        const createdCategories = await Category.insertMany(simpleCategories);
        console.log(`Đã tạo thành công ${createdCategories.length} categories cơ bản`);
        
        console.log('Danh sách categories đã tạo:');
        createdCategories.forEach(cat => {
            console.log(`- ${cat.name}: ${cat.description}`);
        });

        console.log('Hoàn thành seeding categories!');
        process.exit(0);
    } catch (error) {
        console.error('Lỗi khi seeding categories:', error);
        process.exit(1);
    }
};

// Chạy seeder
seedSimpleCategories();

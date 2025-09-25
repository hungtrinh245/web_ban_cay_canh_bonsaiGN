const Category = require('../models/category');

const categoryData = [
    {
        name: 'Cây Phong Thủy',
        description: 'Các loại cây cảnh mang lại may mắn, tài lộc và sức khỏe cho gia chủ',
        image: '/images/categories/phong-thuy.jpg',
        sortOrder: 1,
        isActive: true,
        metaTitle: 'Cây Phong Thủy - Mang Lại May Mắn Và Tài Lộc',
        metaDescription: 'Khám phá bộ sưu tập cây phong thủy đẹp, mang lại may mắn, tài lộc và sức khỏe cho gia đình bạn'
    },
    {
        name: 'Cây Lọc Không Khí',
        description: 'Cây cảnh có khả năng lọc không khí, hấp thụ chất độc hại',
        image: '/images/categories/loc-khong-khi.jpg',
        sortOrder: 2,
        isActive: true,
        metaTitle: 'Cây Lọc Không Khí - Thanh Lọc Môi Trường Sống',
        metaDescription: 'Cây cảnh lọc không khí giúp thanh lọc môi trường, hấp thụ chất độc hại và tạo không gian trong lành'
    },
    {
        name: 'Cây Cảnh Truyền Thống',
        description: 'Các loại cây cảnh truyền thống của Việt Nam',
        image: '/images/categories/truyen-thong.jpg',
        sortOrder: 3,
        isActive: true,
        metaTitle: 'Cây Cảnh Truyền Thống Việt Nam',
        metaDescription: 'Khám phá vẻ đẹp của các loại cây cảnh truyền thống Việt Nam, mang đậm bản sắc văn hóa dân tộc'
    },
    {
        name: 'Bonsai',
        description: 'Nghệ thuật tạo hình cây cảnh thu nhỏ theo phong cách Nhật Bản',
        image: '/images/categories/bonsai.jpg',
        sortOrder: 4,
        isActive: true,
        metaTitle: 'Bonsai - Nghệ Thuật Tạo Hình Cây Cảnh Thu Nhỏ',
        metaDescription: 'Khám phá nghệ thuật bonsai độc đáo, tạo hình cây cảnh thu nhỏ với vẻ đẹp tinh tế và sang trọng'
    },
    {
        name: 'Cây Dây Leo',
        description: 'Các loại cây dây leo trang trí, tạo không gian xanh mát',
        image: '/images/categories/day-leo.jpg',
        sortOrder: 5,
        isActive: true,
        metaTitle: 'Cây Dây Leo Trang Trí - Tạo Không Gian Xanh Mát',
        metaDescription: 'Cây dây leo trang trí giúp tạo không gian xanh mát, tăng tính thẩm mỹ cho ngôi nhà của bạn'
    },
    {
        name: 'Cây Để Bàn',
        description: 'Cây cảnh nhỏ gọn, phù hợp để trên bàn làm việc, bàn học',
        image: '/images/categories/de-ban.jpg',
        sortOrder: 6,
        isActive: true,
        metaTitle: 'Cây Để Bàn - Tạo Không Gian Làm Việc Xanh Mát',
        metaDescription: 'Cây cảnh để bàn nhỏ gọn, phù hợp trang trí bàn làm việc, bàn học, tạo không gian xanh mát'
    },
    {
        name: 'Cây Ngoại Thất',
        description: 'Cây cảnh trồng ngoài trời, chịu được điều kiện thời tiết khắc nghiệt',
        image: '/images/categories/ngoai-that.jpg',
        sortOrder: 7,
        isActive: true,
        metaTitle: 'Cây Ngoại Thất - Tạo Cảnh Quan Xanh Cho Không Gian Ngoài Trời',
        metaDescription: 'Cây cảnh ngoại thất chịu được điều kiện thời tiết khắc nghiệt, tạo cảnh quan xanh cho không gian ngoài trời'
    },
    {
        name: 'Cây Cảnh Cao Cấp',
        description: 'Các loại cây cảnh cao cấp, độc đáo và có giá trị nghệ thuật cao',
        image: '/images/categories/cao-cap.jpg',
        sortOrder: 8,
        isActive: true,
        metaTitle: 'Cây Cảnh Cao Cấp - Nghệ Thuật Và Độc Đáo',
        metaDescription: 'Khám phá bộ sưu tập cây cảnh cao cấp, độc đáo với giá trị nghệ thuật cao, phù hợp người sành chơi'
    }
];

const seedCategories = async () => {
    try {
        // Xóa tất cả categories hiện có
        await Category.deleteMany({});
        console.log('Đã xóa tất cả categories cũ');

        // Thêm categories mới
        const createdCategories = await Category.insertMany(categoryData);
        console.log(`Đã tạo thành công ${createdCategories.length} categories`);

        // Tạo categories con (subcategories)
        const subCategories = [
            {
                name: 'Cây Kim Tiền',
                description: 'Cây phong thủy mang lại tài lộc và may mắn',
                parentCategory: createdCategories[0]._id, // Cây Phong Thủy
                image: '/images/categories/kim-tien.jpg',
                sortOrder: 1,
                isActive: true
            },
            {
                name: 'Cây Phát Tài',
                description: 'Cây phong thủy giúp gia chủ phát tài, phát lộc',
                parentCategory: createdCategories[0]._id, // Cây Phong Thủy
                image: '/images/categories/phat-tai.jpg',
                sortOrder: 2,
                isActive: true
            },
            {
                name: 'Cây Lưỡi Hổ',
                description: 'Cây lọc không khí hiệu quả, hấp thụ chất độc',
                parentCategory: createdCategories[1]._id, // Cây Lọc Không Khí
                image: '/images/categories/luoi-ho.jpg',
                sortOrder: 1,
                isActive: true
            },
            {
                name: 'Cây Trầu Bà',
                description: 'Cây dây leo lọc không khí, dễ chăm sóc',
                parentCategory: createdCategories[1]._id, // Cây Lọc Không Khí
                image: '/images/categories/trau-ba.jpg',
                sortOrder: 2,
                isActive: true
            },
            {
                name: 'Cây Mai Vàng',
                description: 'Cây cảnh truyền thống, biểu tượng của mùa xuân',
                parentCategory: createdCategories[2]._id, // Cây Cảnh Truyền Thống
                image: '/images/categories/mai-vang.jpg',
                sortOrder: 1,
                isActive: true
            },
            {
                name: 'Cây Đào',
                description: 'Cây cảnh truyền thống, mang lại may mắn đầu năm',
                parentCategory: createdCategories[2]._id, // Cây Cảnh Truyền Thống
                image: '/images/categories/cay-dao.jpg',
                sortOrder: 2,
                isActive: true
            }
        ];

        const createdSubCategories = await Category.insertMany(subCategories);
        console.log(`Đã tạo thành công ${createdSubCategories.length} subcategories`);

        console.log('Hoàn thành seeding categories!');
        process.exit(0);
    } catch (error) {
        console.error('Lỗi khi seeding categories:', error);
        process.exit(1);
    }
};

// Chạy seeder nếu file được gọi trực tiếp
if (require.main === module) {
    seedCategories();
}

module.exports = seedCategories;






const mongoose = require('mongoose');
const Bonsai = require('./models/bonsai.js');

async function fixImagePaths() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/my_bonsai_shop');
        console.log('Connected to MongoDB');
        
        // Lấy tất cả sản phẩm
        const products = await Bonsai.find({});
        console.log('Found products:', products.length);
        
        // Mapping tên sản phẩm với đường dẫn ảnh đúng
        const imageMapping = {
            'Cây Tùng La Hán': '/images/sample-tung-la-han.jpg',
            'Cây Kim Tiền': '/images/sample-kim-tien.jpg',
            'Sen Đá Chuỗi Ngọc Bi': '/images/sample-sen-da-chuoi-ngoc.jpg',
            'Xương Rồng Tai Thỏ': '/images/sample-xuong-rong-tai-tho.jpg',
            'Cây Lưỡi Hổ để bàn': '/images/sample-luoi-ho.jpg',
            'Cây Trầu Bà Đế Vương Xanh': '/images/sample-trau-ba.jpg',
            'Cây Sanh Dáng Cổ': '/images/sample-sanh-co.jpg',
            'Cây Mai Vàng Bonsai': '/images/sample-mai-vang.jpg',
            'Cây Thường Xuân': '/images/sample-trau-ba.jpg',
            'Bộ dụng cụ làm vườn mini': '/images/sample-luoi-ho.jpg',
            'Cây Dâu Tây Chịu Nhiệt': '/images/sample-mai-vang.jpg',
            'Chậu Gốm Sứ Bát Tràng': '/images/sample-tung-la-han.jpg',
            'Lan Ý để bàn': '/images/sample-kim-tien.jpg',
            'Sen Đá Giọt Lệ': '/images/sample-sen-da-chuoi-ngoc.jpg',
            'Vạn Niên Thanh': '/images/sample-trau-ba.jpg',
            'Cây Ớt Cảnh Mini': '/images/sample-mai-vang.jpg',
            'Bình tưới cây': '/images/sample-luoi-ho.jpg',
            'Cây Phát Lộc': '/images/sample-tung-la-han.jpg',
            'Cây Phú Quý': '/images/sample-kim-tien.jpg',
            'Cây Đa Búp Đỏ Cổ Thụ': '/images/sample-sanh-co.jpg',
            'Chậu composite cao cấp': '/images/sample-tung-la-han.jpg'
        };
        
        // Cập nhật từng sản phẩm
        let updatedCount = 0;
        for (const product of products) {
            if (imageMapping[product.name]) {
                product.images = [imageMapping[product.name]];
                await product.save();
                console.log(`Updated ${product.name} with image: ${imageMapping[product.name]}`);
                updatedCount++;
            } else {
                console.log(`No mapping found for: ${product.name}`);
            }
        }
        
        console.log(`\nUpdate completed! Updated ${updatedCount} products.`);
        await mongoose.disconnect();
        
    } catch (error) {
        console.error('Error:', error);
    }
}

fixImagePaths();



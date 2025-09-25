const mongoose = require('mongoose');
const Bonsai = require('./models/bonsai.js');

async function updateImagePaths() {
    try {
        await mongoose.connect('mongodb://localhost:27017/bonsai_shop');
        console.log('Connected to MongoDB');
        
        // Lấy tất cả sản phẩm
        const products = await Bonsai.find({});
        console.log('Found products:', products.length);
        
        // Mapping tên sản phẩm với đường dẫn ảnh
        const imageMapping = {
            'Trân Châu Ngọc Trai': '/images/products/tran-chau-ngoc-trai.jpg',
            'Rong Đuôi Chồn': '/images/products/rong-duoi-chon.jpg',
            'Cây Kim Tiền': '/images/products/cay-kim-tien.jpg',
            'Cây Lưỡi Hổ': '/images/products/cay-luoi-ho.jpg'
        };
        
        // Cập nhật từng sản phẩm
        for (const product of products) {
            if (imageMapping[product.name]) {
                product.images = [imageMapping[product.name]];
                await product.save();
                console.log(`Updated ${product.name} with image: ${imageMapping[product.name]}`);
            }
        }
        
        console.log('Update completed!');
        await mongoose.disconnect();
        
    } catch (error) {
        console.error('Error:', error);
    }
}

updateImagePaths();




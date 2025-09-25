const mongoose = require('mongoose');
const Bonsai = require('./models/bonsai.js');

async function getProductsInfo() {
    try {
        await mongoose.connect('mongodb://localhost:27017/bonsai_shop');
        const products = await Bonsai.find({});
        const data = { products };
        
        console.log('=== PRODUCTS INFO ===');
        console.log('Total products:', data.products.length);
        
        data.products.forEach((product, index) => {
            console.log(`\nProduct ${index + 1}:`);
            console.log('  Name:', product.name);
            console.log('  Images:', product.images);
            console.log('  Price:', product.price);
        });
        
        // Lấy tất cả đường dẫn ảnh unique
        const allImagePaths = new Set();
        data.products.forEach(product => {
            if (product.images && product.images.length > 0) {
                product.images.forEach(img => allImagePaths.add(img));
            }
        });
        
        console.log('\n=== ALL UNIQUE IMAGE PATHS ===');
        Array.from(allImagePaths).forEach(path => {
            console.log(path);
        });
        
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

getProductsInfo();

const mongoose = require('mongoose');
const Bonsai = require('./models/bonsai.js');

async function checkAllProducts() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/my_bonsai_shop');
        console.log('Connected to MongoDB');
        
        const products = await Bonsai.find({});
        console.log('=== ALL PRODUCTS ===');
        console.log('Total products found:', products.length);
        
        const imagePaths = new Set();
        products.forEach((p, i) => {
            if (p.images && p.images.length > 0) {
                p.images.forEach(img => imagePaths.add(img));
            }
        });
        
        console.log('\n=== UNIQUE IMAGE PATHS ===');
        Array.from(imagePaths).forEach(path => {
            console.log(path);
        });
        
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    } catch (err) {
        console.error('Error:', err);
    }
}

checkAllProducts();


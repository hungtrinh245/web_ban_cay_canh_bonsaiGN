const mongoose = require('mongoose');
const Bonsai = require('./models/bonsai.js');

async function checkProducts() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/my_bonsai_shop');
        console.log('Connected to MongoDB');
        
        const products = await Bonsai.find({}).limit(3);
        console.log('=== SAMPLE PRODUCTS ===');
        console.log('Total products found:', products.length);
        
        products.forEach((p, i) => {
            console.log(`\nProduct ${i+1}:`);
            console.log('  Name:', p.name);
            console.log('  Images:', JSON.stringify(p.images, null, 2));
            console.log('  Images length:', p.images ? p.images.length : 0);
            console.log('  Category:', p.category);
            console.log('  Price:', p.price);
            if (p.images && p.images.length > 0) {
                console.log('  First image URL:', p.images[0]);
                console.log('  Image type:', typeof p.images[0]);
            }
        });
        
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    } catch (err) {
        console.error('Error:', err);
    }
}

checkProducts();


// server/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.DB_URI || 'mongodb://localhost:27017/my_bonsai_shop';
        console.log('Connecting to MongoDB with URI:', mongoURI);
        const conn = await mongoose.connect(mongoURI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
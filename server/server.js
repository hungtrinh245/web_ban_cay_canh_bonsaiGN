// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); 
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const bonsaiRoutes = require("./routes/bonsai.routes");
const couponRoutes = require("./routes/couponRoutes");
const orderRoutes = require("./routes/orderRoutes"); 
const postRoutes = require("./routes/postRoutes"); 
const contactRoutes = require("./routes/contactRoutes"); 
const categoryRoutes = require("./routes/categoryRoutes"); 
const chatbotRoutes = require("./routes/chatbotRoutes");
const paymentRoutes = require('./routes/payment');

connectDB(); 

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/public')));

app.use("/api/bonsais", bonsaiRoutes);
app.use('/api/auth', authRoutes); 
app.use('/api/coupons', couponRoutes); // ĐẢM BẢO
app.use('/api/orders', orderRoutes); // ĐẢM BẢO
app.use('/api/posts', postRoutes); 
app.use('/api/contact', contactRoutes); 
app.use('/api/categories', categoryRoutes); // ĐẢM BẢO
app.use('/api/chatbot', chatbotRoutes); 
app.use('/api/payment', paymentRoutes);

app.listen(PORT, () => {
    console.log(`Backend server mới đang chạy trên http://localhost:${PORT}`);
});
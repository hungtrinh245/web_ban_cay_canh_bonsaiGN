// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // <-- THÊM DÒNG NÀY
const authRoutes = require('./routes/authRoutes');
// Kết nối đến Database
connectDB(); 

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route API cơ bản để kiểm tra
app.get('/api/test-server', (req, res) => {
    res.json({ message: 'Backend server đang hoạt động tốt!' });
});
const bonsaiRoutes = require("./routes/bonsai.routes");
app.use("/api/bonsais", bonsaiRoutes);
// app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes); 


// Khởi động server sau đó chạy server
app.listen(PORT, () => {
    console.log(`Backend server mới đang chạy trên http://localhost:${PORT}`);
});
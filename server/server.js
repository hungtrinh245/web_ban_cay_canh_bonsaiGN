

require('dotenv').config(); 
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001; // Sử dụng port khác với React

// Middleware
app.use(cors()); // Cho phép tất cả các origin truy cập
app.use(express.json()); // Parse request body dạng JSON
app.use(express.urlencoded({ extended: true })); 

// Route API cơ bản để kiểm tra
app.get('/api/test-server', (req, res) => {
  res.json({ message: 'Backend server đang hoạt động tốt!' });
}); 

// Khởi động server sau đó chạy server
app.listen(PORT, () => {
  console.log(`Backend server mới đang chạy trên http://localhost:${PORT}`);
});
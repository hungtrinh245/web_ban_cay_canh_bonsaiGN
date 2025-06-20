

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors'); // Import thư viện colors
const connectDB = require('../config/db');

// Load models
const Bonsai = require('../models/bonsai'); // Đảm bảo đường dẫn đến model là đúng

// Load env vars
// Chỉ định đường dẫn tới file .env ở thư mục gốc của server
dotenv.config({ path: __dirname + '/../.env' });


// Dữ liệu mẫu
const bonsaiData = [
    {
        name: "Cây Tùng La Hán",
        description: "Tùng La Hán mang ý nghĩa của sự trường thọ, may mắn và phồn vinh. Dáng cây uy nghi, cổ kính, thích hợp trang trí phòng khách hoặc sân vườn.",
        price: 2500000,
        images: ["/images/sample-tung-la-han.jpg"],
        category: "Cây phong thủy",
        stockQuantity: 15
    },
    {
        name: "Cây Kim Tiền",
        description: "Cây Kim Tiền (cây Phát Tài) là biểu tượng của tài lộc và thịnh vượng. Cây dễ chăm sóc, phù hợp làm quà tặng khai trương hoặc để bàn làm việc.",
        price: 180000,
        images: ["/images/sample-kim-tien.jpg"],
        category: "Cây để bàn",
        stockQuantity: 50
    },
    {
        name: "Sen Đá Chuỗi Ngọc Bi",
        description: "Sen đá chuỗi ngọc bi có hình dáng độc đáo như những chuỗi ngọc, dễ chăm sóc và thích hợp cho những không gian nhỏ, bàn làm việc.",
        price: 95000,
        images: ["/images/sample-sen-da-chuoi-ngoc.jpg"],
        category: "Sen đá",
        stockQuantity: 70
    },
    {
        name: "Xương Rồng Tai Thỏ",
        description: "Xương rồng tai thỏ với hình dáng dễ thương, không đòi hỏi chăm sóc nhiều, là lựa chọn tuyệt vời cho người mới bắt đầu chơi cây cảnh.",
        price: 85000,
        images: ["/images/sample-xuong-rong-tai-tho.jpg"],
        category: "Xương rồng",
        stockQuantity: 100
    },
    {
        name: "Cây Lưỡi Hổ để bàn",
        description: "Cây Lưỡi Hổ có khả năng lọc không khí tốt, sức sống bền bỉ, mang ý nghĩa xua đuổi tà ma và mang lại may mắn cho gia chủ.",
        price: 120000,
        images: ["/images/sample-luoi-ho.jpg"],
        category: "Cây để bàn",
        stockQuantity: 45
    },
    {
        name: "Cây Trầu Bà Đế Vương Xanh",
        description: "Trầu Bà Đế Vương thể hiện ý chí vươn lên, quyền lực và may mắn. Cây có thể sống trong môi trường thiếu sáng và có khả năng hút khí độc.",
        price: 250000,
        images: ["/images/sample-trau-ba.jpg"],
        category: "Cây thủy sinh",
        stockQuantity: 30
    },
    {
        name: "Cây Sanh Dáng Cổ",
        description: "Cây sanh thế cổ thụ thu nhỏ, mang vẻ đẹp mộc mạc, vững chãi. Tượng trưng cho sự trường tồn và phát triển.",
        price: 3500000,
        images: ["/images/sample-sanh-co.jpg"],
        category: "Cây phong thủy",
        stockQuantity: 10
    },
    {
        name: "Cây Mai Vàng Mini",
        description: "Mai vàng mini để bàn mang không khí Tết đến mọi nhà. Cây nhỏ gọn, ra hoa đẹp, biểu tượng cho sự phú quý và sung túc.",
        price: 550000,
        images: ["/images/sample-mai-vang.jpg"],
        category: "Cây để bàn",
        stockQuantity: 25
    },
];

// Kết nối tới DB
connectDB();

// Hàm nhập dữ liệu
const importData = async () => {
    try {
        // Xóa dữ liệu cũ
        await Bonsai.deleteMany();

        // Thêm dữ liệu mới từ mảng bonsaiData
        await Bonsai.insertMany(bonsaiData);

        console.log('Dữ liệu mẫu đã được thêm thành công!'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`Lỗi: ${error}`.red.inverse);
        process.exit(1);
    }
};

// Hàm xóa dữ liệu
const destroyData = async () => {
    try {
        // Xóa toàn bộ dữ liệu
        await Bonsai.deleteMany();

        console.log('Dữ liệu đã được xóa thành công!'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(`Lỗi: ${error}`.red.inverse);
        process.exit(1);
    }
};

// Xử lý tham số dòng lệnh
if (process.argv[2] === '-d') {
    // Nếu có tham số -d, ví dụ "node seeder.js -d"
    destroyData();
} else {
    // Mặc định sẽ là nhập dữ liệu
    importData();
}
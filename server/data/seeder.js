const mongoose = require("mongoose");
const dotenv = require("dotenv");
const colors = require("colors"); // Import thư viện colors
const connectDB = require("../config/db");

// Load models
const Bonsai = require("../models/bonsai"); // Đảm bảo đường dẫn đến model là đúng

// Load env vars
// Chỉ định đường dẫn tới file .env ở thư mục gốc của server
dotenv.config({ path: __dirname + "/../.env" });

// Dữ liệu mẫu
const bonsaiData = [
 {
        name: "Cây Tùng La Hán",
        description: "Cây Tùng La Hán có ý nghĩa phong thủy rất lớn, mang lại sự may mắn, thịnh vượng và bình an cho gia chủ.",
        price: 450000,
        images: ["/images/sample-tung-la-han.jpg"],
        category: "Cây phong thủy",
        stockQuantity: 15,
        isFeatured: true
    },
    {
        name: "Cây Kim Tiền",
        description: "Cây Kim Tiền (cây Phát Tài) là biểu tượng của tài lộc và thịnh vượng. Cây dễ chăm sóc, phù hợp làm quà tặng khai trương hoặc để bàn làm việc.",
        price: 180000,
        images: ["/images/sample-kim-tien.jpg"],
        category: "Cây để bàn",
        stockQuantity: 50,
    },
    {
        name: "Sen Đá Chuỗi Ngọc Bi",
        description: "Sen đá chuỗi ngọc bi có hình dáng độc đáo như những chuỗi ngọc, dễ chăm sóc và thích hợp để trang trí bàn học, văn phòng.",
        price: 95000,
        images: ["/images/sample-sen-da-chuoi-ngoc.jpg"],
        category: "Sen đá",
        stockQuantity: 70
    },
    {
        name: "Xương Rồng Tai Thỏ",
        description: "Xương rồng tai thỏ với hình dáng dễ thương, không đòi hỏi chăm sóc nhiều, là lựa chọn tuyệt vời cho người mới bắt đầu.",
        price: 85000,
        images: ["/images/sample-xuong-rong-tai-tho.jpg"],
        category: "Xương rồng",
        stockQuantity: 100,
        isFeatured: true
    },
    {
        name: "Cây Lưỡi Hổ để bàn",
        description: "Cây Lưỡi Hổ có khả năng lọc không khí hiệu quả, loại bỏ các độc tố. Cây rất dễ sống và phát triển tốt trong điều kiện trong nhà.",
        price: 120000,
        images: ["/images/sample-luoi-ho.jpg"],
        category: "Cây văn phòng",
        stockQuantity: 40,
        isFeatured: true
    },
    {
        name: "Cây Trầu Bà Đế Vương Xanh",
        description: "Trầu Bà Đế Vương Xanh tượng trưng cho sự quyền uy, may mắn và thăng tiến. Cây có lá to, xanh bóng, phát triển mạnh mẽ.",
        price: 250000,
        images: ["/images/sample-trau-ba.jpg"],
        category: "Cây thủy sinh",
        stockQuantity: 30
    },
    {
        name: "Cây Sanh Dáng Cổ",
        description: "Một tác phẩm bonsai cây Sanh với dáng thế cổ thụ, uy nghi, thể hiện đẳng cấp và sự am hiểu của người chơi cây.",
        price: 3500000,
        images: ["/images/sample-sanh-co.jpg"],
        category: "Cây cao cấp",
        stockQuantity: 5,
        isFeatured: true
    },
    {
        name: "Cây Mai Vàng Bonsai",
        description: "Mai Vàng bonsai mini, biểu tượng của ngày Tết phương Nam, mang lại không khí xuân và tài lộc cho mọi nhà.",
        price: 1200000,
        images: ["/images/sample-mai-vang.jpg"],
        category: "Cây phong thủy",
        stockQuantity: 10
    },

    {
        name: "Cây Thường Xuân",
        description: "Dây leo thường xuân với khả năng leo bám và thanh lọc không khí tốt, mang lại vẻ đẹp mềm mại cho ban công, cửa sổ.",
        price: 110000,
        images: ["/images/sample-trau-ba.jpg"], 
        category: "Cây Dây Leo",
        stockQuantity: 50,
        isFeatured: true
    },
    {
        name: "Bộ dụng cụ làm vườn mini",
        description: "Bộ 3 dụng cụ làm vườn mini gồm xẻng, cào, xúc đất, tiện lợi cho việc chăm sóc các chậu cây nhỏ trong nhà.",
        price: 75000,
        images: ["/images/sample-luoi-ho.jpg"], 
        category: "Dụng Cụ & Chậu",
        stockQuantity: 200,
    },
    {
        name: "Cây Dâu Tây Chịu Nhiệt",
        description: "Giống dâu tây chịu nhiệt, có thể trồng chậu tại ban công và cho quả ngọt sau vài tháng chăm sóc.",
        price: 80000,
        images: ["/images/sample-mai-vang.jpg"], 
        category: "Cây Ăn Trái",
        stockQuantity: 60,
    },
    {
        name: "Chậu Gốm Sứ Bát Tràng",
        description: "Chậu gốm sứ cao cấp từ làng nghề Bát Tràng, với hoa văn tinh xảo, nâng tầm vẻ đẹp cho cây cảnh của bạn.",
        price: 250000,
        images: ["/images/sample-tung-la-han.jpg"], 
        category: "Dụng Cụ & Chậu",
        stockQuantity: 40,
        isFeatured: true
    },
    {
        name: "Lan Ý để bàn",
        description: "Lan Ý hay Huệ Hòa Bình, mang ý nghĩa về sự bình yên, hạnh phúc. Cây có hoa trắng thanh lịch, sống tốt trong bóng râm.",
        price: 165000,
        images: ["/images/sample-kim-tien.jpg"], 
        category: "Cây để bàn",
        stockQuantity: 35,
    },
    {
        name: "Sen Đá Giọt Lệ",
        description: "Một loại sen đá mọng nước với hình dáng như những giọt lệ xanh mướt, biểu tượng cho sự trong sáng và tinh khiết.",
        price: 65000,
        images: ["/images/sample-sen-da-chuoi-ngoc.jpg"],
        category: "Sen đá",
        stockQuantity: 80,
    },
     {
        name: "Vạn Niên Thanh",
        description: "Cây Vạn Niên Thanh leo, dễ trồng trong nước hoặc đất, mang ý nghĩa về sự sung túc và trường tồn.",
        price: 130000,
        images: ["/images/sample-trau-ba.jpg"], 
        category: "Cây Dây Leo",
        stockQuantity: 45,
    },
    {
        name: "Cây Ớt Cảnh Mini",
        description: "Giống ớt cảnh cho quả nhiều màu sắc (vàng, cam, đỏ), vừa làm cảnh đẹp mắt vừa có thể thu hoạch.",
        price: 70000,
        images: ["/images/sample-mai-vang.jpg"], 
        category: "Cây Ăn Trái",
        stockQuantity: 55,
        isFeatured: true
    },
     {
        name: "Bình tưới cây",
        description: "Bình xịt phun sương dung tích 500ml, giúp cung cấp độ ẩm cần thiết cho các loại cây ưa ẩm.",
        price: 45000,
        images: ["/images/sample-luoi-ho.jpg"], 
        category: "Dụng Cụ & Chậu",
        stockQuantity: 150,
    },
    {
        name: "Cây Phát Lộc",
        description: "Cây Phát Lộc hay Phất Dụ, một trong những loại cây phong thủy phổ biến nhất, mang lại may mắn và tài lộc.",
        price: 195000,
        images: ["/images/sample-tung-la-han.jpg"],
        category: "Cây phong thủy",
        stockQuantity: 25,
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

    console.log("Dữ liệu mẫu đã được thêm thành công!".green.inverse);
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

    console.log("Dữ liệu đã được xóa thành công!".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`Lỗi: ${error}`.red.inverse);
    process.exit(1);
  }
};

// Xử lý tham số dòng lệnh
if (process.argv[2] === "-d") {
  // Nếu có tham số -d, ví dụ "node seeder.js -d"
  destroyData();
} else {
  // Mặc định sẽ là nhập dữ liệu
  importData();
}

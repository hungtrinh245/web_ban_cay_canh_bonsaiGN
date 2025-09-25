// server/data/seeder.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const colors = require("colors"); 
const connectDB = require("../config/db");

// Load models
const Bonsai = require("../models/bonsai"); 
const Coupon = require("../models/Coupon"); 
const Post = require("../models/Post"); 
const User = require("../models/User"); 
const Category = require("../models/Category"); // Đảm bảo import Category model

// Load env vars
dotenv.config({ path: __dirname + "/../.env" });

// --- DỮ LIỆU MẪU SẢN PHẨM ---
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
    {
        name: "Cây Phú Quý",
        description: "Cây Phú Quý mang ý nghĩa tiền tài, phú quý cho gia chủ. Cây rất dễ chăm sóc, phù hợp đặt trong nhà hoặc văn phòng.",
        price: 35000, 
        images: ["/images/sample-kim-tien.jpg"],
        category: "Cây để bàn",
        stockQuantity: 60,
    },
    {
        name: "Cây Đa Búp Đỏ Cổ Thụ",
        description: "Cây Đa Búp Đỏ cổ thụ với dáng vẻ hùng vĩ, tượng trưng cho sự trường tồn và thịnh vượng, thích hợp cho không gian lớn.",
        price: 1500000, 
        images: ["/images/sample-sanh-co.jpg"],
        category: "Cây cao cấp",
        stockQuantity: 3,
        isFeatured: true
    },
    {
        name: "Chậu composite cao cấp",
        description: "Chậu trồng cây làm từ composite siêu nhẹ, bền đẹp, phù hợp với các loại cây lớn trong nhà và ngoài trời.",
        price: 600000, 
        images: ["/images/sample-tung-la-han.jpg"],
        category: "Dụng Cụ & Chậu",
        stockQuantity: 20,
    },
];

// Dữ liệu mẫu cho mã ưu đãi
const couponData = [
    {
        code: 'SALE10',
        type: 'percentage',
        value: 10,
        minAmount: 100000,
        maxDiscount: 100000,
        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        usageLimit: 100,
        isActive: true,
    },
    {
        code: 'FREESHIP',
        type: 'fixed',
        value: 30000,
        minAmount: 0,
        expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
        usageLimit: 50,
        isActive: true,
    },
    {
        code: 'GIAM50K',
        type: 'fixed',
        value: 50000,
        minAmount: 200000,
        expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
        isActive: true,
    },
];

// Dữ liệu mẫu cho bài viết
const postData = [
    {
        title: 'Nên tưới cây bằng nước máy hay nước đun sôi?',
        excerpt: 'Vì sao lại lựa chọn hai loại nước này? Vì nếu bạn ở thành phố và văn phòng thì...',
        content: 'Nước là yếu tố sống còn đối với cây trồng, nhưng loại nước nào là tốt nhất? Nước máy thường chứa clo và florua, có thể không tốt cho một số loại cây nhạy cảm. Nước đun sôi để nguội có thể loại bỏ clo nhưng cũng làm mất đi oxy và khoáng chất. Bài viết này sẽ phân tích ưu nhược điểm của từng loại và đưa ra lời khuyên cho bạn.',
        image: '/images/tuoi-cay-bang-nuoc-may-2.jpg', 
        category: 'Mẹo chăm sóc',
        tags: ['tưới nước', 'chăm sóc'],
    },
    {
        title: '8 yếu tố giúp cây trồng trong nhà luôn xanh tốt',
        excerpt: 'Trong thời đại hiện nay, cây trồng trong nhà không chỉ để trang trí mà còn mang lại...',
        content: 'Để cây trồng trong nhà luôn xanh tốt, bạn cần chú ý đến 8 yếu tố quan trọng: ánh sáng, nước, độ ẩm, nhiệt độ, đất trồng, dinh dưỡng, chậu cây và phòng ngừa sâu bệnh. Mỗi yếu tố đều đóng vai trò thiết yếu trong sự phát triển của cây. Bài viết sẽ đi sâu vào từng yếu tố và cung cấp những mẹo nhỏ để bạn áp dụng ngay tại nhà.',
        image: '/images/yeu-to-giup-cay-canh-trong-nha-xanh-tot.jpg', 
        category: 'Mẹo chăm sóc',
        tags: ['chăm sóc', 'cây trong nhà'],
        isFeatured: true,
    },
    {
        title: '10 loại cây trừ tà ma, xua đuổi vận xui hiệu quả',
        excerpt: 'Trồng cây xanh không chỉ giúp thanh lọc không khí mà còn có ý nghĩa phong thủy sâu sắc...',
        content: 'Theo quan niệm phong thủy, một số loại cây không chỉ mang lại vẻ đẹp tự nhiên mà còn có khả năng trừ tà, xua đuổi vận xui và thu hút tài lộc. Danh sách này bao gồm 10 loại cây phổ biến như cây Lưỡi Hổ, cây Kim Tiền, cây Lan Ý, Trúc Phú Quý, v.v. Tìm hiểu ý nghĩa và cách trồng để mang lại may mắn cho ngôi nhà của bạn.',
        image: '/images/nhung-cay-tru-ta-duoi-ma.jpg', 
        category: 'Phong thủy',
        tags: ['phong thủy', 'tài lộc'],
        isFeatured: true,
    },
    {
        title: 'Bí quyết chọn chậu phù hợp cho từng loại cây',
        excerpt: 'Chậu cây không chỉ là nơi chứa đất mà còn là yếu tố quan trọng ảnh hưởng đến sức khỏe cây và tính thẩm mỹ.',
        content: 'Việc lựa chọn chậu cây tưởng chừng đơn giản nhưng lại rất quan trọng. Một chiếc chậu phù hợp sẽ giúp cây phát triển tốt, thoát nước hiệu quả và tăng thêm vẻ đẹp cho không gian. Bài viết này sẽ hướng dẫn bạn cách chọn chậu dựa trên chất liệu, kích thước, hình dáng và mục đích sử dụng, đảm bảo cây của bạn luôn khỏe mạnh và đẹp mắt.',
        image: '/images/bi-quyet-chon-chau-cay.jpg', 
        category: 'Mẹo chăm sóc',
        tags: ['chậu cây', 'phụ kiện'],
    },
    {
        title: 'Sự thật bất ngờ về lợi ích của cây cảnh trong nhà',
        excerpt: 'Cây cảnh không chỉ là vật trang trí, chúng còn mang lại nhiều lợi ích sức khỏe và tinh thần.',
        content: 'Ngoài việc làm đẹp không gian, cây cảnh trong nhà còn có khả năng thanh lọc không khí, giảm căng thẳng, tăng cường sự tập trung và cải thiện tâm trạng. Nhiều nghiên cứu đã chỉ ra mối liên hệ giữa việc tiếp xúc với cây xanh và sự giảm bớt các triệu chứng lo âu, trầm cảm. Khám phá những lợi ích tuyệt vời mà cây cảnh mang lại cho cuộc sống của bạn.',
        image: '/images/blog-benefits.jpg', 
        tags: ['sức khỏe', 'lợi ích'],
    },
];

// Dữ liệu người dùng mẫu (để tạo admin user)
const usersData = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123', // Mật khẩu sẽ được hash bởi User model
        role: 'admin',
    },
    {
        name: 'Regular User',
        email: 'user@example.com',
        password: 'password123',
        role: 'user',
    },
];

// Dữ liệu mẫu DANH MỤC (Đã thêm trường 'image')
const categoryData = [
    { name: "Cây để bàn", description: "Các loại cây nhỏ gọn, phù hợp trang trí bàn làm việc, bàn học.", image: "/images/sample-tung-la-han.jpg" },
    { name: "Cây phong thủy", description: "Cây mang ý nghĩa phong thủy tốt lành, thu hút tài lộc, may mắn.", image: "/images/sample-tung-la-han.jpg" },
    { name: "Sen đá", description: "Các loại sen đá dễ thương, đa dạng về hình dáng và màu sắc.", image: "/images/sample-tung-la-han.jpg" },
    { name: "Xương rồng", description: "Xương rồng với vẻ đẹp mạnh mẽ, ít cần chăm sóc, thích hợp cho người bận rộn.", image: "/images/sample-tung-la-han.jpg" },
    { name: "Cây thủy sinh", description: "Cây có thể trồng trong nước, mang lại không gian xanh mát và dễ chịu.", image: "/images/sample-tung-la-han.jpg" },
    { name: "Cây cao cấp", description: "Các tác phẩm bonsai, cây cảnh giá trị cao, được tạo tác nghệ thuật.", image: "/images/sample-tung-la-han.jpg" },
    { name: "Cây văn phòng", description: "Cây phù hợp trang trí văn phòng, giúp thanh lọc không khí, giảm căng thẳng.", image: "/images/sample-tung-la-han.jpg" },
    { name: "Cây Dây Leo", description: "Cây thân leo, tạo điểm nhấn xanh cho không gian tường, ban công.", image: "/images/sample-tung-la-han.jpg" },
    { name: "Cây Ăn Trái", description: "Cây cảnh cho trái, vừa trang trí vừa có thể thu hoạch.", image: "/images/sample-tung-la-han.jpg" },
    { name: "Dụng Cụ & Chậu", description: "Các loại dụng cụ và chậu cảnh phục vụ cho việc chăm sóc và trang trí cây.", image: "/images/sample-tung-la-han.jpg" },
];


// Kết nối tới DB
connectDB();

// Hàm nhập dữ liệu
const importData = async () => {
    try {
        // Xóa dữ liệu cũ
        await Bonsai.deleteMany();
        await Coupon.deleteMany(); 
        await Post.deleteMany(); 
        await User.deleteMany();
        await Category.deleteMany(); // <-- ĐẢM BẢO CATEGORY ĐƯỢC XÓA

        // Thêm categories trước
        const insertedCategories = await Category.insertMany(categoryData);
        console.log("Categories đã được thêm:", insertedCategories.length);

        // Tạo mapping từ tên category sang ObjectId
        const categoryMap = {};
        insertedCategories.forEach(cat => {
            categoryMap[cat.name] = cat._id;
        });

        // Cập nhật bonsaiData để sử dụng ObjectId thay vì tên
        const updatedBonsaiData = bonsaiData.map(bonsai => ({
            ...bonsai,
            category: categoryMap[bonsai.category] || null
        }));

        // Thêm dữ liệu mới
        await Bonsai.insertMany(updatedBonsaiData);
        await Coupon.insertMany(couponData); 
        await Post.insertMany(postData);
        await User.insertMany(usersData); // <-- ĐẢM BẢO USER ĐƯỢC THÊM

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
        await Bonsai.deleteMany();
        await Coupon.deleteMany(); // <-- XÓA COUPONS
   await Post.deleteMany();
        await User.deleteMany(); // <-- XÓA USERS
        await Category.deleteMany(); // <-- XÓA CATEGORIES
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

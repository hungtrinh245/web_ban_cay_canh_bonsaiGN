// server/controllers/chatbotController.js
const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require('@google/generative-ai');

// Lấy API Key từ biến môi trường
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Kiểm tra xem API_KEY có tồn tại không
if (!GEMINI_API_KEY) {
    console.error("LỖI KHỞI TẠO CHATBOT: GEMINI_API_KEY không được định nghĩa trong .env!");
}

// Khởi tạo Gemini client (chỉ khi key có)
let genAI;
let model;
if (GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    // SỬA LỖI: Cập nhật tên mô hình sang 'gemini-2.0-flash' (hoặc 'gemini-1.5-flash')
    // Đây là các tên mô hình mới nhất và được tối ưu cho tốc độ
    model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); 
    console.log("Chatbot model initialized with: gemini-2.0-flash"); // Log để xác nhận
} else {
    console.warn("Cảnh báo: Gemini API không được khởi tạo do thiếu GEMINI_API_KEY.");
}

// Cấu hình an toàn (để tránh các nội dung không mong muốn)
const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
];

// @desc    Get response from Chatbot (Gemini API)
// @route   POST /api/chatbot/message
// @access  Public (hoặc Private nếu bạn muốn giới hạn truy cập)
const getChatbotResponse = async (req, res) => {
    const { message } = req.body; // Tin nhắn từ người dùng frontend

    if (!message) {
        return res.status(400).json({ message: 'Tin nhắn không được để trống.' });
    }

    // Kiểm tra lại nếu API_KEY hoặc model không có sẵn
    if (!GEMINI_API_KEY || !model) {
        console.error("LỖI CHATBOT: Gemini API Key hoặc mô hình không được cấu hình. Vui lòng kiểm tra .env và khởi động lại server.");
        return res.status(500).json({ reply: 'Chatbot chưa được cấu hình đúng cách. Vui lòng liên hệ quản trị viên.' });
    }

    try {
        // Tạo một cuộc trò chuyện mới với một prompt hệ thống
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "Bạn là một trợ lý chatbot thân thiện cho một cửa hàng bán cây cảnh tên là \"BonsaiGN Shop\". Nhiệm vụ của bạn là trả lời các câu hỏi của khách hàng về cây cảnh, sản phẩm, chính sách cửa hàng (giao hàng, bảo hành, thanh toán), hoặc tư vấn về cách chăm sóc cây. Hãy trả lời ngắn gọn, hữu ích và thân thiện. Nếu câu hỏi không liên quan đến cây cảnh hoặc cửa hàng, hãy lịch sự từ chối hoặc chuyển hướng họ đến trang liên hệ. Tuyệt đối không trả lời các câu hỏi về chính trị, bạo lực, tình dục, hoặc các chủ đề nhạy cảm khác. Nếu người dùng hỏi những câu hỏi đó, hãy lịch sự từ chối và nói rằng bạn chỉ có thể hỗ trợ về cây cảnh và cửa hàng." }],
                },
                {
                    role: "model",
                    parts: [{ text: "Chào bạn! Tôi là trợ lý của BonsaiGN Shop. Tôi có thể giúp gì cho bạn về cây cảnh hoặc các sản phẩm của cửa hàng ạ?" }],
                },
            ],
            safetySettings: safetySettings, // Áp dụng cấu hình an toàn
        });

        // Gửi tin nhắn của người dùng và nhận phản hồi
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ reply: text });

    } catch (error) {
        console.error('LỖI KHI GỌI GEMINI API:', error.message);
        // Log chi tiết lỗi từ Gemini API
        if (error.response && error.response.data) {
            console.error('Chi tiết lỗi Gemini API:', error.response.data);
        }
        
        // Trả về một tin nhắn lỗi thân thiện cho frontend
        res.status(500).json({ reply: 'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.' });
    }
};

module.exports = {
    getChatbotResponse,
};

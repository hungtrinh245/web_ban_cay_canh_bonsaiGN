// server/controllers/contactController.js
const nodemailer = require('nodemailer');

const sendContactMessage = async (req, res) => {
    const { name, email, phone, message } = req.body;

    // Simple validation
    if (!name || !email || !phone || !message) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ các trường bắt buộc.' });
    }

    try {
        // 1. Tạo transporter (cấu hình dịch vụ email)
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Hoặc 'Outlook' hoặc cấu hình SMTP server khác
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            // Nếu dùng Gmail, có thể thêm tùy chọn này để tránh lỗi bảo mật
            // tls: {
            //     rejectUnauthorized: false
            // }
        });

        // 2. Cấu hình nội dung email
        const mailOptions = {
            from: process.env.EMAIL_USER, // Email gửi đi
            to: process.env.EMAIL_TO,     // Email của admin nhận
            subject: `[BonsaiGN Contact Form] Tin nhắn từ ${name}`,
            html: `
                <h2>Tin nhắn mới từ khách hàng</h2>
                <p><strong>Họ và tên:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Số điện thoại:</strong> ${phone}</p>
                <p><strong>Lời nhắn:</strong></p>
                <p>${message}</p>
                <hr>
                <p><em>Vui lòng phản hồi khách hàng qua email: ${email} hoặc SĐT: ${phone}</em></p>
            `,
        };

        // 3. Gửi email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Tin nhắn của bạn đã được gửi thành công!' });

    } catch (error) {
        console.error('Lỗi khi gửi email liên hệ:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ. Không thể gửi tin nhắn.' });
    }
};

module.exports = {
    sendContactMessage,
};
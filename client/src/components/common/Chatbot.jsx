// client/src/components/common/Chatbot.jsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios'; // Import axios để gọi API backend

const Chatbot = () => {
    const [messages, setMessages] = useState([]); // Lưu trữ lịch sử tin nhắn
    const [input, setInput] = useState(''); // State cho ô nhập liệu
    const [loading, setLoading] = useState(false); // State cho trạng thái loading của chatbot
    const messagesEndRef = useRef(null); // Ref để cuộn xuống cuối khung chat

    // Cuộn xuống cuối khung chat mỗi khi có tin nhắn mới
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    // Hàm gửi tin nhắn đến API backend của bạn
    const sendMessageToBackendChatbot = async (userMessage) => {
        setLoading(true);
        // Thêm tin nhắn người dùng vào lịch sử
        setMessages((prevMessages) => [
            ...prevMessages,
            { type: 'user', text: userMessage },
        ]);

        try {
            // Gọi API backend của bạn
            const response = await axios.post('http://localhost:5001/api/chatbot/message', { message: userMessage });
            
            const botResponseText = response.data.reply; // Lấy phản hồi từ trường 'reply'

            setMessages((prevMessages) => [
                ...prevMessages,
                { type: 'bot', text: botResponseText },
            ]);
        } catch (apiError) {
            console.error('Lỗi khi gọi API Chatbot backend:', apiError);
            setMessages((prevMessages) => [
                ...prevMessages,
                { type: 'bot', text: 'Xin lỗi, tôi đang gặp sự cố kết nối hoặc chatbot không thể trả lời câu hỏi này. Vui lòng thử lại sau.' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    // Xử lý gửi tin nhắn từ form
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (input.trim()) {
            sendMessageToBackendChatbot(input); // Gọi hàm gửi tin nhắn đến backend
            setInput('');
        }
    };

    // Styles cho Chatbot (giữ nguyên)
    const chatbotContainerStyle = {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '350px',
        height: '500px',
        backgroundColor: 'white',
        borderRadius: '15px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 1000,
        fontFamily: 'Roboto, sans-serif',
        border: '1px solid #eee',
    };

    const chatHeaderStyle = {
        backgroundColor: '#28a745',
        color: 'white',
        padding: '15px',
        fontSize: '1.2em',
        fontWeight: 'bold',
        textAlign: 'center',
        borderTopLeftRadius: '15px',
        borderTopRightRadius: '15px',
    };

    const chatMessagesStyle = {
        flexGrow: 1,
        padding: '15px',
        overflowY: 'auto',
        backgroundColor: '#f9f9f9',
    };

    const messageBubbleStyle = {
        maxWidth: '80%',
        padding: '10px 15px',
        borderRadius: '15px',
        marginBottom: '10px',
        wordWrap: 'break-word',
    };

    const userMessageStyle = {
        ...messageBubbleStyle,
        backgroundColor: '#e0e0e0',
        alignSelf: 'flex-end',
        marginLeft: 'auto',
    };

    const botMessageStyle = {
        ...messageBubbleStyle,
        backgroundColor: '#d4edda',
        alignSelf: 'flex-start',
        marginRight: 'auto',
    };

    const chatInputAreaStyle = {
        padding: '15px',
        borderTop: '1px solid #eee',
        display: 'flex',
        gap: '10px',
        backgroundColor: 'white',
    };

    const chatInputStyle = {
        flexGrow: 1,
        padding: '10px',
        borderRadius: '20px',
        border: '1px solid #ccc',
        fontSize: '1em',
    };

    const sendButtonStyle = {
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '20px',
        padding: '10px 15px',
        cursor: 'pointer',
        fontSize: '1em',
        fontWeight: 'bold',
        transition: 'background-color 0.2s',
        '&:hover': {
            backgroundColor: '#218838',
        },
    };

    const loadingIndicatorStyle = {
        textAlign: 'center',
        padding: '10px',
        color: '#555',
        fontSize: '0.9em',
    };


    return (
        <div style={chatbotContainerStyle}>
            <div style={chatHeaderStyle}>BonsaiGN Chatbot</div>
            <div style={chatMessagesStyle}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        style={msg.type === 'user' ? userMessageStyle : botMessageStyle}
                    >
                        {msg.text}
                    </div>
                ))}
                {loading && <div style={loadingIndicatorStyle}>Chatbot đang soạn tin...</div>}
                <div ref={messagesEndRef} /> 
            </div>
            <form onSubmit={handleSendMessage} style={chatInputAreaStyle}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Nhập tin nhắn của bạn..."
                    style={chatInputStyle}
                    disabled={loading}
                />
                <button
                    type="submit"
                    style={sendButtonStyle}
                    onMouseOver={(e) => Object.assign(e.currentTarget.style, sendButtonStyle['&:hover'])}
                    onMouseOut={(e) => Object.assign(e.currentTarget.style, sendButtonStyle)}
                    disabled={loading}
                >
                    Gửi
                </button>
            </form>
        </div>
    );
};

export default Chatbot;

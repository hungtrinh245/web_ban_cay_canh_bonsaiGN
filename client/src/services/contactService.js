// client/src/services/contactService.js
import axios from 'axios';

const API_URL_CONTACT = 'http://localhost:5001/api/contact'; 

export const sendMessage = async (messageData) => {
    try {
        const response = await axios.post(API_URL_CONTACT, messageData);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gửi tin nhắn:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Gửi tin nhắn thất bại.');
    }
};
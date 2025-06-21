
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/auth';

// Hàm đăng ký
export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data; // Trả về { _id, name, email, role, token }
    } catch (error) {
        console.error('Lỗi khi đăng ký:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
    }
};

// Hàm đăng nhập
export const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials);
        return response.data; // Trả về { _id, name, email, role, token }
    } catch (error) {
        console.error('Lỗi khi đăng nhập:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
    }
};
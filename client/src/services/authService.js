
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

export const updateProfile = async (userData, token) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.put(`${API_URL}/profile`, userData, config);
        return response.data; // Trả về { _id, name, email, role, token }
    } catch (error) {
        console.error('Lỗi khi cập nhật hồ sơ:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Cập nhật hồ sơ thất bại');
    }
};

// Hàm lấy thông tin user hiện tại (getMe)
// hàm  muốn reload user info sau khi refresh trang
export const getProfile = async (token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(`${API_URL}/me`, config);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy hồ sơ người dùng:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Không thể lấy hồ sơ');
    }
};
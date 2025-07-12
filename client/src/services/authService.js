// client/src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/auth';

// Hàm đăng ký (Public)
const register = async (userData) => { 
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi đăng ký:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
    }
};

// Hàm đăng nhập (Public)
const login = async (credentials) => { 
    try {
        const response = await axios.post(`${API_URL}/login`, credentials);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi đăng nhập:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
    }
};

// Hàm cập nhật hồ sơ người dùng hiện tại
const updateProfile = async (userData, token) => { 
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.put(`${API_URL}/profile`, userData, config);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật hồ sơ:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Cập nhật hồ sơ thất bại');
    }
};

// Hàm lấy thông tin user hiện tại (getMe)
const getProfile = async (token) => { 
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

// =========================================================
// CÁC HÀM API CHO ADMIN (Quản lý người dùng)
// =========================================================

// Lấy tất cả người dùng (Admin Only)
const getAllUsers = async (token) => { 
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${API_URL}/users`, config);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy tất cả người dùng (Admin):', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Không thể tải danh sách người dùng.');
    }
};

// Cập nhật người dùng theo ID (Admin Only)
const updateUser = async (userId, userData, token) => { 
    try {
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };
        const response = await axios.put(`${API_URL}/users/${userId}`, userData, config);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật người dùng (Admin):', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Cập nhật người dùng thất bại.');
    }
};

// Xóa người dùng (Admin Only)
const deleteUser = async (userId, token) => { 
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.delete(`${API_URL}/users/${userId}`, config);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi xóa người dùng (Admin):', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Xóa người dùng thất bại.');
    }
};

// --- DÒNG EXPORT CUỐI CÙNG: ĐẢM BẢO TẤT CẢ CÁC HÀM ĐƯỢC LIỆT KÊ CHỈ MỘT LẦN VÀ ĐÚNG CHÍNH TẢ ---
export {
    register,
    login,
    updateProfile,
    getProfile, 
    getAllUsers,    
    updateUser,     
    deleteUser,     
};
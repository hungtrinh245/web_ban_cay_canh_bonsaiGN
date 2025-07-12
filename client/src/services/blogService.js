// client/src/services/blogService.js
import axios from 'axios';

const API_URL_POSTS = 'http://localhost:5001/api/posts';

// Lấy tất cả bài viết (Public, có phân trang)
const getAllPosts = async (page = 1, limit = 5) => { 
    try {
        const response = await axios.get(`${API_URL_POSTS}?page=${page}&limit=${limit}`);
        return response.data; 
    } catch (error) {
        console.error('Lỗi khi lấy tất cả bài viết:', error);
        throw error;
    }
};

// Lấy một bài viết theo ID (Public)
const getPostById = async (id) => { 
    try {
        const response = await axios.get(`${API_URL_POSTS}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi lấy bài viết ID ${id}:`, error);
        throw error;
    }
};

// Lấy các bài viết mới nhất (Public, fixed limit)
const getLatestPosts = async () => { 
    try {
        const response = await axios.get(`${API_URL_POSTS}/latest`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy bài viết mới nhất:', error);
        throw error;
    }
};

// Lấy các bài viết nổi bật (Public, fixed limit)
const getFeaturedPosts = async () => { 
    try {
        const response = await axios.get(`${API_URL_POSTS}/featured`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy bài viết nổi bật:', error);
        throw error;
    }
};

// =========================================================
// CÁC HÀM API CHO ADMIN (Quản lý bài viết)
// =========================================================

// Tạo bài viết mới (Admin Only)
const createPost = async (postData, token) => { 
    try {
        const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
        const response = await axios.post(API_URL_POSTS, postData, config);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tạo bài viết:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Tạo bài viết thất bại');
    }
};

// Cập nhật bài viết (Admin Only)
const updatePost = async (postId, postData, token) => { 
    try {
        const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
        const response = await axios.put(`${API_URL_POSTS}/${postId}`, postData, config);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật bài viết:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Cập nhật bài viết thất bại');
    }
};

// Xóa bài viết (Admin Only)
const deletePost = async (postId, token) => { 
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.delete(`${API_URL_POSTS}/${postId}`, config);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi xóa bài viết:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Xóa bài viết thất bại');
    }
};


// --- DÒNG EXPORT CUỐI CÙNG: ĐẢM BẢO TẤT CẢ CÁC HÀM ĐƯỢC LIỆT KÊ CHỈ MỘT LẦN VÀ ĐÚNG CHÍNH TẢ ---
export {
    getAllPosts,
    getPostById,
    getLatestPosts,
    getFeaturedPosts,
    createPost,       // <-- Đảm bảo export
    updatePost,       // <-- Đảm bảo export
    deletePost,       // <-- Đảm bảo export
};
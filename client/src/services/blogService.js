// client/src/services/blogService.js
import axios from 'axios';

const API_URL_POSTS = 'http://localhost:5001/api/posts'; 

// Lấy tất cả bài viết (dùng cho trang Blog chính)
export const getAllPosts = async () => {
    try {
        const response = await axios.get(API_URL_POSTS);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy tất cả bài viết:', error);
        throw error;
    }
};

// Lấy một bài viết theo ID
export const getPostById = async (id) => {
    try {
        const response = await axios.get(`${API_URL_POSTS}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi lấy bài viết ID ${id}:`, error);
        throw error;
    }
};

// Lấy các bài viết mới nhất (cho homepage)
export const getLatestPosts = async () => {
    try {
        const response = await axios.get(`${API_URL_POSTS}/latest`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy bài viết mới nhất:', error);
        throw error;
    }
};

// Lấy các bài viết nổi bật
export const getFeaturedPosts = async () => {
    try {
        const response = await axios.get(`${API_URL_POSTS}/featured`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy bài viết nổi bật:', error);
        throw error;
    }
};
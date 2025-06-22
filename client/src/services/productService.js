// client/src/services/productService.js
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/bonsais';

// SỬA LẠI TÊN HÀM Ở ĐÂY
export const getNewProducts = async () => {
    try {
        // API gốc (/) giờ trả về sản phẩm mới nhất
        const response = await axios.get(API_URL); 
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm mới:', error);
        throw error;
    }
};

// Hàm lấy sản phẩm nổi bật
export const getFeaturedProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/featured`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm nổi bật:', error);
        throw error;
    }
};

// Hàm lấy một sản phẩm theo ID
export const getProductById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi lấy sản phẩm ID ${id}:`, error);
        throw error;
    }
};

// Hàm lấy các sản phẩm liên quan
export const getRelatedProducts = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}/related`);
        return response.data;
    } catch (error)
    {
        console.error(`Lỗi khi lấy sản phẩm liên quan cho ID ${id}:`, error);
        throw error;
    }
};
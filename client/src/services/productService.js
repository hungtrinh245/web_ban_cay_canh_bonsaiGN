
import axios from 'axios';



const API_URL = 'http://localhost:5001/api/bonsais';

// Hàm lấy tất cả sản phẩm
export const getAllProducts = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
        throw error; // Ném lỗi ra để component có thể xử lý
    }
};

// Hàm lấy một sản phẩm theo ID
export const getProductById = async (id) => {
    try {
        const response = await axios.get(`<span class="math-inline">\{API\_URL\}/</span>{id}`);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi lấy sản phẩm ID ${id}:`, error);
        throw error;
    }
};
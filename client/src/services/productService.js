// client/src/services/productService.js
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/bonsais';

// Trả về sản phẩm mới nhất
export const getNewProducts = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm mới:', error);
        throw error;
    }
};

// Trả về sản phẩm nổi bật
export const getFeaturedProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/featured`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm nổi bật:', error);
        throw error;
    }
};

// Trả về một sản phẩm theo ID
export const getProductById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi lấy sản phẩm ID ${id}:`, error);
        throw error;
    }
};

// Trả về các sản phẩm liên quan
export const getRelatedProducts = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}/related`);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi lấy sản phẩm liên quan cho ID ${id}:`, error);
        throw error;
    }
};

// ---- HÀM BỊ THIẾU LÀ HÀM NÀY ----
// Trả về danh sách các danh mục duy nhất
export const getCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/categories`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
        throw error;
    }
};

// Trả về các sản phẩm thuộc một danh mục cụ thể
export const getProductsByCategory = async (categoryName) => {
    try {
        const response = await axios.get(`${API_URL}/category/${categoryName}`);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi lấy sản phẩm theo danh mục ${categoryName}:`, error);
        throw error;
    }
};

// Hàm mới để lấy sản phẩm theo khoảng giá và danh mục
 export const getProductsByPriceRange = async (minPrice, maxPrice, category) => {
    try {
        let url = `${API_URL}/filter-products?min=${minPrice}&max=${maxPrice}`;
        if (category) {
            url += `&category=${category}`;
        }
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm theo khoảng giá:', error);
        throw error;
    }
};
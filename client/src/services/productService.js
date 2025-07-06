// client/src/services/productService.js
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/bonsais';
const API_URL_COUPONS  = 'http://localhost:5001/api/coupons';
const API_URL_ORDERS = 'http://localhost:5001/api/orders';

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

export const applyCoupon = async (code, cartTotal) => {
    try {
        const response = await axios.post(`${API_URL_COUPONS}/apply`, { code, cartTotal });
        return response.data; // Trả về { message, discountAmount, couponCode, newTotal }
    } catch (error) {
        console.error('Lỗi khi áp dụng mã ưu đãi:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Áp dụng mã ưu đãi thất bại.');
    }
};

// Hàm để đặt hàng
export const createOrder = async (orderData, token) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Gửi token nếu người dùng đăng nhập
            },
        };
        // orderData đã bao gồm tất cả các thông tin cần thiết
        const response = await axios.post(API_URL_ORDERS, orderData, config);
        return response.data; // Trả về thông tin đơn hàng đã tạo
    } catch (error) {
        console.error('Lỗi khi đặt hàng:', error.response?.data?.message || error.message);
        // Kiểm tra lỗi tồn kho cụ thể
        if (error.response && error.response.status === 400 && error.response.data.message.includes("không đủ số lượng tồn kho")) {
             throw new Error(error.response.data.message);
        }
        throw new Error(error.response?.data?.message || 'Đặt hàng thất bại');
    }
};

// Hàm  để lấy các đơn hàng của người dùng hiện tại
export const getMyOrders = async (token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(`${API_URL_ORDERS}/myorders`, config);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy đơn hàng của tôi:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Không thể lấy danh sách đơn hàng.');
    }
};

// Hàm tìm kiếm sản phẩm theo từ khóa
export const searchProducts = async (keyword) => {
    try {
        const response = await axios.get(`${API_URL}/search?keyword=${keyword}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tìm kiếm sản phẩm:', error);
        throw error;
    }
};
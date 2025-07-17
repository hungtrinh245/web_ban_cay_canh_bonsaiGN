// client/src/services/productService.js
import axios from 'axios';

const API_URL_BONSAIS = 'http://localhost:5001/api/bonsais';
const API_URL_COUPONS = 'http://localhost:5001/api/coupons';
const API_URL_ORDERS = 'http://localhost:5001/api/orders';
const API_URL_CATEGORIES = 'http://localhost:5001/api/categories'; // Đảm bảo dòng này có
const API_URL_AUTH = 'http://localhost:5001/api/auth'; 
const API_URL_POSTS = 'http://localhost:5001/api/posts'; 

// =========================================================
// CÁC HÀM API CHO SẢN PHẨM (BONSAIS) - PUBLIC VÀ ADMIN
// =========================================================

// Lấy TẤT CẢ sản phẩm với phân trang (dùng cho ShopPage và ProductManagement)
const getAllBonsais = async (page = 1, limit = 8) => {
    try {
        const response = await axios.get(`${API_URL_BONSAIS}?page=${page}&limit=${limit}`);
        return response.data; // Trả về { products, page, limit, totalPages, totalDocuments }
    } catch (error) {
        console.error('Lỗi khi lấy tất cả sản phẩm:', error);
        throw error;
    }
};

// Lấy sản phẩm MỚI NHẤT (có hỗ trợ phân trang cho HomePage nếu cần)
const getNewProducts = async (page = 1, limit = 8) => {
    try {
        const response = await axios.get(`${API_URL_BONSAIS}?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm mới:', error);
        throw error;
    }
};

// Lấy sản phẩm NỔI BẬT (không phân trang cố định)
const getFeaturedProducts = async () => {
    try {
        const response = await axios.get(`${API_URL_BONSAIS}/featured`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm nổi bật:', error);
        throw error;
    }
};

// Lấy một sản phẩm theo ID
const getProductById = async (id) => {
    try {
        const response = await axios.get(`${API_URL_BONSAIS}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi lấy sản phẩm ID ${id}:`, error);
        throw error;
    }
};

// Lấy các sản phẩm liên quan
const getRelatedProducts = async (id) => {
    try {
        const response = await axios.get(`${API_URL_BONSAIS}/${id}/related`);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi lấy sản phẩm liên quan cho ID ${id}:`, error);
        throw error;
    }
};

// Lấy sản phẩm theo danh mục (có phân trang)
const getProductsByCategory = async (categoryName, page = 1, limit = 8) => {
    try {
        const response = await axios.get(`${API_URL_BONSAIS}/category/${categoryName}?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi lấy sản phẩm theo danh mục ${categoryName}:`, error);
        throw error;
    }
};

// Lấy sản phẩm theo khoảng giá và danh mục (có phân trang)
const getProductsByPriceRange = async (minPrice, maxPrice, category, page = 1, limit = 8) => {
    try {
        let url = `${API_URL_BONSAIS}/filter-products?min=${minPrice}&max=${maxPrice}&page=${page}&limit=${limit}`;
        if (category && category !== 'null' && category !== 'undefined') {
            url += `&category=${category}`;
        }
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm theo khoảng giá:', error);
        throw error;
    }
};

// Tìm kiếm sản phẩm theo từ khóa (có phân trang)
const searchProducts = async (keyword, page = 1, limit = 8) => {
    try {
        const response = await axios.get(`${API_URL_BONSAIS}/search?keyword=${keyword}&page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tìm kiếm sản phẩm:', error);
        throw error;
    }
};

// Tạo đánh giá sản phẩm (Private)
const createProductReview = async (productId, reviewData, token) => { 
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.post(`${API_URL_BONSAIS}/${productId}/reviews`, reviewData, config);
        return response.data; 
    } catch (error) {
        console.error('Lỗi khi gửi đánh giá sản phẩm:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Gửi đánh giá thất bại');
    }
};

// =========================================================
// CÁC HÀM API CHO ADMIN (CRUD) SẢN PHẨM (BONSAIS)
// =========================================================

// Tạo sản phẩm mới (Admin Only)
const createBonsai = async (productData, token) => { 
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.post(API_URL_BONSAIS, productData, config);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tạo sản phẩm:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Tạo sản phẩm thất bại');
    }
};

// Cập nhật sản phẩm (Admin Only)
const updateBonsai = async (productId, productData, token) => { 
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.put(`${API_URL_BONSAIS}/${productId}`, productData, config);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật sản phẩm:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Cập nhật sản phẩm thất bại');
    }
};

// Xóa sản phẩm (Admin Only)
const deleteBonsai = async (productId, token) => { 
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.delete(`${API_URL_BONSAIS}/${productId}`, config);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Xóa sản phẩm thất bại');
    }
};

// =========================================================
// CÁC HÀM API CHO COUPONS
// =========================================================

// Áp dụng mã ưu đãi (Public)
const applyCoupon = async (code, cartTotal) => { 
    try {
        const response = await axios.post(`${API_URL_COUPONS}/apply`, { code, cartTotal });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi áp dụng mã ưu đãi:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Áp dụng mã ưu đãi thất bại.');
    }
};

// Lấy tất cả mã ưu đãi (Admin Only)
const getCoupons = async (token) => { 
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(API_URL_COUPONS, config);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy tất cả mã ưu đãi (Admin):', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Không thể tải mã ưu đãi.');
    }
};

// Tạo mã ưu đãi (Admin Only)
const createCoupon = async (couponData, token) => { 
    try {
        const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
        const response = await axios.post(API_URL_COUPONS, couponData, config);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tạo mã ưu đãi:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Tạo mã ưu đãi thất bại.');
    }
};

// Cập nhật mã ưu đãi (Admin Only)
const updateCoupon = async (couponId, couponData, token) => { 
    try {
        const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
        const response = await axios.put(`${API_URL_COUPONS}/${couponId}`, couponData, config);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật mã ưu đãi:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Cập nhật mã ưu đãi thất bại.');
    }
};

// Xóa mã ưu đãi (Admin Only)
const deleteCoupon = async (couponId, token) => { 
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.delete(`${API_URL_COUPONS}/${couponId}`, config);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi xóa mã ưu đãi:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Xóa mã ưu đãi thất bại.');
    }
};

// =========================================================
// CÁC HÀM API CHO ORDERS
// =========================================================

// Tạo đơn hàng (Public/Private - dựa vào token có hay không)
const createOrder = async (orderData, token) => { 
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }), 
            },
        };
        const response = await axios.post(API_URL_ORDERS, orderData, config);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi đặt hàng:', error.response?.data?.message || error.message);
        if (error.response && error.response.status === 400 && error.response.data.message.includes("không đủ số lượng tồn kho")) {
             throw new Error(error.response.data.message);
        }
        throw new Error(error.response?.data?.message || 'Đặt hàng thất bại');
    }
};

// Lấy đơn hàng của người dùng hiện tại (Private)
const getMyOrders = async (token) => { 
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

// Lấy chi tiết đơn hàng theo ID (Public cho Guest Order, Private cho User/Admin Order)
const getOrderById = async (id, token) => { 
    try {
        const config = { 
            headers: { 
                ...(token && { Authorization: `Bearer ${token}` }), 
            } 
        };
        const response = await axios.get(`${API_URL_ORDERS}/${id}`, config);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi lấy đơn hàng ID ${id}:`, error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Không thể lấy chi tiết đơn hàng.');
    }
};

// Cập nhật trạng thái đã thanh toán (Admin Only)
const updateOrderToPaid = async (orderId, token) => { 
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.put(`${API_URL_ORDERS}/${orderId}/pay`, {}, config);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái đã thanh toán:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Cập nhật trạng thái thanh toán thất bại.');
    }
};

// Cập nhật trạng thái đã giao hàng (Admin Only)
const updateOrderToDelivered = async (orderId, token) => { 
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.put(`${API_URL_ORDERS}/${orderId}/deliver`, {}, config);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái đã giao hàng:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Cập nhật trạng thái giao hàng thất bại.');
    }
};

// Lấy tất cả đơn hàng (Admin Only)
const getAllOrdersAdmin = async (token) => { 
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(API_URL_ORDERS, config);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy tất cả đơn hàng (Admin):', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Không thể tải tất cả đơn hàng.');
    }
};

// =========================================================
// CÁC HÀM API CHO BLOG (POSTS)
// =========================================================

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
const getPostById = async (id) => { 
    try {
        const response = await axios.get(`${API_URL_POSTS}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi lấy bài viết ID ${id}:`, error);
        throw error;
    }
};
const getLatestPosts = async () => { 
    try {
        const response = await axios.get(`${API_URL_POSTS}/latest`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy bài viết mới nhất:', error);
        throw error;
    }
};
const getFeaturedPosts = async () => { 
    try {
        const response = await axios.get(`${API_URL_POSTS}/featured`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy bài viết nổi bật:', error);
        throw error;
    }
};

// CRUD Bài viết (Admin Only)
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

// =========================================================
// CÁC HÀM API CHO AUTH (USERS)
// =========================================================

// Đăng ký, Đăng nhập, Profile (Public/Private)
const register = async (userData) => { 
    try {
        const response = await axios.post(`${API_URL_AUTH}/register`, userData); 
        return response.data;
    } catch (error) {
        console.error('Lỗi khi đăng ký:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
    }
};
const login = async (credentials) => { 
    try {
        const response = await axios.post(`${API_URL_AUTH}/login`, credentials); 
        return response.data;
    } catch (error) {
        console.error('Lỗi khi đăng nhập:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
    }
};
const updateProfile = async (userData, token) => { 
    try {
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };
        const response = await axios.put(`${API_URL_AUTH}/profile`, userData, config); 
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật hồ sơ:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Cập nhật hồ sơ thất bại');
    }
};
const getProfile = async (token) => { 
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${API_URL_AUTH}/me`, config); 
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy hồ sơ người dùng:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Không thể lấy hồ sơ');
    }
};

// CRUD Users (Admin Only)
const getAllUsers = async (token) => { 
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${API_URL_AUTH}/users`, config); 
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy tất cả người dùng (Admin):', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Không thể tải danh sách người dùng.');
    }
};
const updateUser = async (userId, userData, token) => { 
    try {
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };
        const response = await axios.put(`${API_URL_AUTH}/users/${userId}`, userData, config); 
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật người dùng (Admin):', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Cập nhật người dùng thất bại.');
    }
};
const deleteUser = async (userId, token) => { 
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.delete(`${API_URL_AUTH}/users/${userId}`, config); 
        return response.data;
    } catch (error) {
        console.error('Lỗi khi xóa người dùng (Admin):', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Xóa người dùng thất bại.');
    }
};

// =========================================================
// CÁC HÀM API CHO CONTACT
// =========================================================

// Gửi tin nhắn liên hệ (Public)
const sendMessage = async (messageData) => { 
    try {
        const response = await axios.post(`${API_URL_CONTACT}`, messageData); 
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gửi tin nhắn:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Gửi tin nhắn thất bại.');
    }
};


// =========================================================
// CÁC HÀM API CHO DANH MỤC
// =========================================================

// Lấy danh sách các danh mục (public và admin)
const getCategories = async () => { 
    try {
        const response = await axios.get(API_URL_CATEGORIES);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
        throw error;
    }
};

// Tạo danh mục mới (Admin Only)
const createCategory = async (categoryData, token) => {
    try {
        const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
        const response = await axios.post(API_URL_CATEGORIES, categoryData, config);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tạo danh mục:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Tạo danh mục thất bại.');
    }
};

// Cập nhật danh mục (Admin Only)
const updateCategory = async (categoryId, categoryData, token) => {
    try {
        const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
        const response = await axios.put(`${API_URL_CATEGORIES}/${categoryId}`, categoryData, config);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật danh mục:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Cập nhật danh mục thất bại.');
    }
};

// Xóa danh mục (Admin Only)
const deleteCategory = async (categoryId, token) => {
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.delete(`${API_URL_CATEGORIES}/${categoryId}`, config);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi xóa danh mục:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Xóa danh mục thất bại.');
    }
};


const getActiveCoupons = async () => {
    try {
        const response = await axios.get(`${API_URL_COUPONS}/active`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy mã ưu đãi đang hoạt động:', error);
        throw error;
    }
};


// =========================================================
// DÒNG EXPORT CUỐI CÙNG: ĐẢM BẢO TẤT CẢ CÁC HÀM ĐƯỢC LIỆT KÊ CHỈ MỘT LẦN VÀ ĐÚNG CHÍNH TẢ
// =========================================================
export {
    // Sản phẩm
    getAllBonsais,
    getNewProducts,
    getFeaturedProducts,
    getProductById,
    getRelatedProducts,
    getProductsByCategory,
    getProductsByPriceRange,
    searchProducts,
    createProductReview,
    createBonsai, 
    updateBonsai, 
    deleteBonsai, 

    // Đơn hàng
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getAllOrdersAdmin, 

    // Mã ưu đãi
    applyCoupon,
    getCoupons,       
    createCoupon,     
    updateCoupon,     
    deleteCoupon,     
    getActiveCoupons,

    // Bài viết
    getAllPosts,      
    getPostById,      
    getLatestPosts,   
    getFeaturedPosts, 
    createPost,       
    updatePost,       
    deletePost,       

    // Người dùng (Auth)
    register,
    login,
    updateProfile,
    getProfile,
    getAllUsers,      
    updateUser,       
    deleteUser,       

    // Liên hệ
    sendMessage,

    // Danh mục
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
};
// client/src/services/productService.js
import axios from "axios";

const API_URL_BONSAIS = "http://localhost:5001/api/bonsais";
const API_URL_COUPONS = "http://localhost:5001/api/coupons";
const API_URL_ORDERS = "http://localhost:5001/api/orders";

// getAllBonsais (Lấy tất cả sản phẩm,phân trang) ---
const getAllBonsais = async (page = 1, limit = 8) => {
  try {
    const response = await axios.get(
      `${API_URL_BONSAIS}?page=${page}&limit=${limit}`
    );
    return response.data; // Sẽ trả về { products, page, limit, totalPages, totalDocuments }
  } catch (error) {
    console.error("Lỗi khi lấy tất cả sản phẩm:", error);
    throw error;
  }
};


const getNewProducts = async (page = 1, limit = 8) => {
  try {
    const response = await axios.get(
      `${API_URL_BONSAIS}?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm mới:", error);
    throw error;
  }
};

const getFeaturedProducts = async () => {
  try {
    const response = await axios.get(`${API_URL_BONSAIS}/featured`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm nổi bật:", error);
    throw error;
  }
};

const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL_BONSAIS}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy sản phẩm ID ${id}:`, error);
    throw error;
  }
};

const getRelatedProducts = async (id) => {
  try {
    const response = await axios.get(`${API_URL_BONSAIS}/${id}/related`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy sản phẩm liên quan cho ID ${id}:`, error);
    throw error;
  }
};

const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL_BONSAIS}/categories`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh mục:", error);
    throw error;
  }
};

const getProductsByCategory = async (categoryName, page = 1, limit = 8) => {
  try {
    const response = await axios.get(
      `${API_URL_BONSAIS}/category/${categoryName}?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy sản phẩm theo danh mục ${categoryName}:`, error);
    throw error;
  }
};

const getProductsByPriceRange = async (
  minPrice,
  maxPrice,
  category,
  page = 1,
  limit = 8
) => {
  try {
    let url = `${API_URL_BONSAIS}/filter-products?min=${minPrice}&max=${maxPrice}&page=${page}&limit=${limit}`;
    if (category && category !== "null" && category !== "undefined") {
      url += `&category=${category}`;
    }
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm theo khoảng giá:", error);
    throw error;
  }
};

const searchProducts = async (keyword, page = 1, limit = 8) => {
  try {
    const response = await axios.get(
      `${API_URL_BONSAIS}/search?keyword=${keyword}&page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    throw error;
  }
};

const applyCoupon = async (code, cartTotal) => {
  try {
    const response = await axios.post(`${API_URL_COUPONS}/apply`, {
      code,
      cartTotal,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi áp dụng mã ưu đãi:",
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message || "Áp dụng mã ưu đãi thất bại."
    );
  }
};

const createOrder = async (orderData, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };
    const response = await axios.post(API_URL_ORDERS, orderData, config);
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi đặt hàng:",
      error.response?.data?.message || error.message
    );
    if (
      error.response &&
      error.response.status === 400 &&
      error.response.data.message.includes("không đủ số lượng tồn kho")
    ) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.response?.data?.message || "Đặt hàng thất bại");
  }
};

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
    console.error(
      "Lỗi khi lấy đơn hàng của tôi:",
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message || "Không thể lấy danh sách đơn hàng."
    );
  }
};

const createProductReview = async (productId, reviewData, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(
      `${API_URL_BONSAIS}/${productId}/reviews`,
      reviewData,
      config
    );
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi gửi đánh giá sản phẩm:",
      error.response?.data?.message || error.message
    );
    throw new Error(error.response?.data?.message || "Gửi đánh giá thất bại");
  }
};

const createBonsai = async (productData, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(API_URL_BONSAIS, productData, config);
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi tạo sản phẩm:",
      error.response?.data?.message || error.message
    );
    throw new Error(error.response?.data?.message || "Tạo sản phẩm thất bại");
  }
};

const updateBonsai = async (productId, productData, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.put(
      `${API_URL_BONSAIS}/${productId}`,
      productData,
      config
    );
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi cập nhật sản phẩm:",
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message || "Cập nhật sản phẩm thất bại"
    );
  }
};

const deleteBonsai = async (productId, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.delete(
      `${API_URL_BONSAIS}/${productId}`,
      config
    );
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi xóa sản phẩm:",
      error.response?.data?.message || error.message
    );
    throw new Error(error.response?.data?.message || "Xóa sản phẩm thất bại");
  }
};

export {
  getNewProducts,
  getFeaturedProducts,
  getProductById,
  getRelatedProducts,
  getCategories,
  getProductsByCategory,
  getProductsByPriceRange,
  searchProducts,
  applyCoupon,
  createOrder,
  getMyOrders,
  createProductReview,
  createBonsai,
  updateBonsai,
  deleteBonsai,
  getAllBonsais,
};

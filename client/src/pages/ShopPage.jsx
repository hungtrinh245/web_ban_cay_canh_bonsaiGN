// client/src/pages/ShopPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
// Đảm bảo import đúng tất cả các hàm service
import {
  getNewProducts,
  getProductsByCategory,
  getProductsByPriceRange,
} from "../services/productService";
import CategorySidebar from "../components/layout/CategorySidebar";
import ProductList from "../components/product/ProductList";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { categoryName } = useParams();
  const navigate = useNavigate();

  // State cho bộ lọc giá

  const [filterMinPrice, setFilterMinPrice] = useState(0);
  const [filterMaxPrice, setFilterMaxPrice] = useState(4000000);

  const [isFilteringApplied, setIsFilteringApplied] = useState(false);

  // Hàm fetch sản phẩm chính, có thể nhận thêm min/max price
  const fetchProducts = useCallback(async (min, max, category) => {
    try {
      setLoading(true);
      let data;
      // Ưu tiên lọc theo giá nếu có tham số min/max
      if (
        min !== undefined &&
        max !== undefined &&
        (min !== 0 || max !== 4000000 || category !== "null")
      ) {
        // Kiểm tra nếu có lọc thật sự khác mặc định
        data = await getProductsByPriceRange(min, max, category);
        console.log(
          "Fetching with price filter:",
          min,
          max,
          "Category:",
          category
        );
      } else if (category) {
        data = await getProductsByCategory(category);
        console.log("Fetching by category:", category);
      } else {
        // Mặc định, lấy sản phẩm mới nhất
        data = await getNewProducts();
        console.log("Fetching new products (default).");
      }
      setProducts(data);
    } catch (err) {
      setError("Không thể tải dữ liệu sản phẩm.");
      console.error("Lỗi khi fetch sản phẩm:", err);
    } finally {
      setLoading(false);
    }
  }, []); // Không cần dependencies ở đây vì nó sẽ được gọi với các tham số

  useEffect(() => {
    setFilterMinPrice(0);
    setFilterMaxPrice(4000000); // Reset maxPrice về giá trị bao phủ tối đa
    setIsFilteringApplied(false);

    // Gọi fetchProducts
    fetchProducts(0, 4000000, categoryName || null); // Luôn truyền các giá trị ban đầu vào
  }, [categoryName, fetchProducts]);

  // Hàm callback được truyền xuống CategorySidebar để áp dụng lọc giá
  const handleApplyPriceFilter = (min, max) => {
    setFilterMinPrice(min);
    setFilterMaxPrice(max);
    setIsFilteringApplied(true); // Đánh dấu là đã áp dụng bộ lọc giá

    // Gọi fetchProducts với giá trị lọc mới và category hiện tại
    fetchProducts(min, max, categoryName || null);
  };

  const handleSelectCategory = (category) => {
    // Reset bộ lọc giá về mặc định khi chọn danh mục mới
    setFilterMinPrice(0);
    setFilterMaxPrice(4000000);
    setIsFilteringApplied(false); // Bỏ đánh dấu lọc giá

    if (category) {
      navigate(`/shop/category/${category}`);
    } else {
      navigate("/shop");
    }
  };

  if (error)
    return (
      <p style={{ color: "red", textAlign: "center", padding: "50px" }}>
        {error}
      </p>
    );

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        boxSizing: "border-box",
        padding: "20px 0",
      }}
    >
      <CategorySidebar
        selectedCategory={categoryName}
        onSelectCategory={handleSelectCategory}
        onApplyPriceFilter={handleApplyPriceFilter}
        initialMinPrice={filterMinPrice}
        initialMaxPrice={filterMaxPrice}
        // Truyền giới hạn min/max của toàn bộ sản phẩm để thanh trượt có dải đúng
        overallMinPriceRange={0}
        overallMaxPriceRange={4000000} // Đặt giá trị lớn nhất theo dữ liệu của bạn
      />
      <div style={{ flex: 1, padding: "0 2.5rem" }}>
        <h2 style={{ marginBottom: "20px", fontWeight: "normal" }}>
          {categoryName
            ? `Sản phẩm theo danh mục: ${categoryName}`
            : "Tất cả sản phẩm"}
        </h2>
        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <>
            <ProductList products={products} />
            {products.length === 0 && (
              <p>
                Không có sản phẩm nào trong danh mục này hoặc trong khoảng giá
                bạn chọn.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ShopPage;

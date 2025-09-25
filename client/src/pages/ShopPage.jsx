// client/src/pages/ShopPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getNewProducts,
    getProductsByCategory,
    getProductsByPriceRange,
    searchProducts,
} from '../services/productService';
import CategorySidebar from '../components/layout/CategorySidebar';
import ProductList from '../components/product/ProductList';
import Pagination from '../components/common/Pagination';

const ShopPage = ({ onAddToCartSuccess }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { categoryName } = useParams();
    const navigate = useNavigate();

    // States cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const productsPerPage = 8; // Số sản phẩm trên mỗi trang

    // States cho bộ lọc giá
    const [filterMinPrice, setFilterMinPrice] = useState(0);
    const [filterMaxPrice, setFilterMaxPrice] = useState(4000000);

    // Hàm fetch sản phẩm chính, có thể nhận thêm min/max price và page
    const fetchProducts = useCallback(async (min, max, category, page) => {
        try {
            setLoading(true);
            setError(null); // Reset error
            console.log('Fetching products with:', { min, max, category, page });

            let data;
            // Đơn giản hóa logic
            if (category && category !== 'null' && category !== 'undefined') {
                console.log('Fetching by category:', category);
                data = await getProductsByCategory(category, page, productsPerPage);
            } else {
                console.log('Fetching all products');
                data = await getNewProducts(page, productsPerPage);
            }

            console.log('Products data received:', data);
            console.log('Products array:', data.products);
            console.log('Products count:', data.products ? data.products.length : 0);

            setProducts(data.products || []);
            setCurrentPage(data.page || 1);
            setTotalPages(data.totalPages || 1);

        } catch (err) {
            console.error("Lỗi khi fetch sản phẩm:", err);
            setError('Không thể tải dữ liệu sản phẩm.');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [productsPerPage]);


    useEffect(() => {
        console.log('Category changed to:', categoryName);
        console.log('URL params categoryName:', categoryName);
        console.log('Will call fetchProducts with category:', categoryName || null);
        setCurrentPage(1);
        setFilterMinPrice(0);
        setFilterMaxPrice(4000000);
        fetchProducts(0, 4000000, categoryName || null, 1);
    }, [categoryName, fetchProducts]);

    const handleApplyPriceFilter = (min, max) => {
        setFilterMinPrice(min);
        setFilterMaxPrice(max);
        setCurrentPage(1);
        fetchProducts(min, max, categoryName || null, 1);
    };

    const handleSelectCategory = (category) => {
        console.log('handleSelectCategory called with:', category);
        setCurrentPage(1);
        setFilterMinPrice(0);
        setFilterMaxPrice(4000000);

        if (category) {
            navigate(`/shop/category/${encodeURIComponent(category)}`);
        } else {
            navigate('/shop');
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchProducts(filterMinPrice, filterMaxPrice, categoryName || null, page);
        window.scrollTo(0, 0);
    };



    return (
        <div style={{ display: 'flex', maxWidth: '1400px', margin: '20px auto' }}>
            <CategorySidebar
                selectedCategory={categoryName}
                onSelectCategory={handleSelectCategory}
                onApplyPriceFilter={handleApplyPriceFilter}
                initialMinPrice={filterMinPrice}
                initialMaxPrice={filterMaxPrice}
                overallMinPriceRange={0}
                overallMaxPriceRange={4000000}
            />
            <div style={{ flex: 1, padding: '0 20px' }}>
                <h2 style={{ marginBottom: '20px', fontWeight: 'normal' }}>
                    {categoryName ? `Sản phẩm theo danh mục: ${decodeURIComponent(categoryName)}` : 'Tất cả sản phẩm'}
                </h2>

                {/* Debug info */}
                <div style={{ marginBottom: '10px', fontSize: '12px', color: '#666' }}>
                    Debug: Loading={loading.toString()}, Error={error || 'none'}, Products count={products.length}, CategoryName={categoryName || 'null'}
                </div>

                {loading ? (
                    <p>Đang tải...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : (
                    <>
                        <ProductList products={products} onAddToCartSuccess={onAddToCartSuccess} />
                        {products.length === 0 && <p>Không có sản phẩm nào trong danh mục này hoặc trong khoảng giá bạn chọn.</p>}

                        {/* Component phân trang */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default ShopPage;
// client/src/pages/ShopPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    getNewProducts, 
    getProductsByCategory, 
    getProductsByPriceRange,
} from '../services/productService'; 
import CategorySidebar from '../components/layout/CategorySidebar';
import ProductList from '../components/product/ProductList'; 

const ShopPage = ({ onAddToCartSuccess }) => { // Nhận prop onAddToCartSuccess từ App.jsx
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { categoryName } = useParams();
    const navigate = useNavigate();

    const [filterMinPrice, setFilterMinPrice] = useState(0); 
    const [filterMaxPrice, setFilterMaxPrice] = useState(4000000); 

    const fetchProducts = useCallback(async (min, max, category) => {
        try {
            setLoading(true);
            let data;
            // Kiểm tra nếu có lọc thật sự khác mặc định hoặc có category
            if ((min !== 0 || max !== 4000000) || category) { 
                data = await getProductsByPriceRange(min, max, category);
                console.log("Fetching with price filter:", min, max, "Category:", category);
            } else if (category) {
                data = await getProductsByCategory(category);
                console.log("Fetching by category:", category);
            } else {
                data = await getNewProducts();
                console.log("Fetching new products (default).");
            }
            setProducts(data);
        } catch (err) {
            setError('Không thể tải dữ liệu sản phẩm.');
            console.error("Lỗi khi fetch sản phẩm:", err);
        } finally {
            setLoading(false);
        }
    }, []); 


    useEffect(() => {
        setFilterMinPrice(0);
        setFilterMaxPrice(4000000);
        fetchProducts(0, 4000000, categoryName || null); 
    }, [categoryName, fetchProducts]);

    const handleApplyPriceFilter = (min, max) => {
        setFilterMinPrice(min);
        setFilterMaxPrice(max);
        fetchProducts(min, max, categoryName || null);
    };

    const handleSelectCategory = (category) => {
        setFilterMinPrice(0);
        setFilterMaxPrice(4000000);
        
        if (category) {
            navigate(`/shop/category/${category}`);
        } else {
            navigate('/shop');
        }
    };


    if (error) return <p style={{ color: 'red', textAlign: 'center', padding: '50px' }}>{error}</p>;

    return (
        <div style={{ display: 'flex', width: '100%', boxSizing: 'border-box', padding: '20px 0' }}>
            <CategorySidebar
                selectedCategory={categoryName}
                onSelectCategory={handleSelectCategory}
                onApplyPriceFilter={handleApplyPriceFilter} 
                initialMinPrice={filterMinPrice}
                initialMaxPrice={filterMaxPrice}
                overallMinPriceRange={0} 
                overallMaxPriceRange={4000000} 
            />
            <div style={{ flex: 1, padding: '0 2.5rem' }}>
                <h2 style={{ marginBottom: '20px', fontWeight: 'normal' }}>
                    {categoryName ? `Sản phẩm theo danh mục: ${categoryName}` : 'Tất cả sản phẩm'}
                </h2>
                {loading ? (
                    <p>Đang tải...</p>
                ) : (
                    <>
                        {/* TRUYỀN onAddToCartSuccess XUỐNG PRODUCTLIST */}
                        <ProductList products={products} onAddToCartSuccess={onAddToCartSuccess} />
                        {products.length === 0 && <p>Không có sản phẩm nào trong danh mục này hoặc trong khoảng giá bạn chọn.</p>}
                    </>
                )}
            </div>
        </div>
    );
};

export default ShopPage;
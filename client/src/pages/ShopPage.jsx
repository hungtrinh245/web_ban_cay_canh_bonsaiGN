// client/src/pages/ShopPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNewProducts, getProductsByCategory } from '../services/productService';
import CategorySidebar from '../components/layout/CategorySidebar';
import ProductList from '../components/product/ProductList';

const ShopPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { categoryName } = useParams(); // Lấy tên category từ URL
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                let data;
                if (categoryName) {
                    // Nếu có category trên URL, gọi API lọc
                    data = await getProductsByCategory(categoryName);
                } else {
                    // Nếu không, lấy tất cả sản phẩm mới
                    data = await getNewProducts();
                }
                setProducts(data);
            } catch (err) {
                setError('Không thể tải dữ liệu sản phẩm.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryName]); // Chạy lại mỗi khi categoryName trên URL thay đổi

    const handleSelectCategory = (category) => {
        if (category) {
            navigate(`/shop/category/${category}`);
        } else {
            navigate('/shop');
        }
    };

    if (error) return <p style={{ color: 'red', textAlign: 'center', padding: '50px' }}>{error}</p>;

    return (
        <div style={{ display: 'flex', maxWidth: '1400px', margin: '20px auto' }}>
            <CategorySidebar 
                selectedCategory={categoryName}
                onSelectCategory={handleSelectCategory}
            />
            <div style={{ flex: 1, padding: '0 20px' }}>
                <h2 style={{ marginBottom: '20px', fontWeight: 'normal' }}>
                    {categoryName || 'Tất cả sản phẩm'}
                </h2>
                {loading ? (
                    <p>Đang tải...</p>
                ) : (
                    <>
                        <ProductList products={products} />
                        {products.length === 0 && <p>Không có sản phẩm nào trong danh mục này.</p>}
                    </>
                )}
            </div>
        </div>
    );
};

export default ShopPage;
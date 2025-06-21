// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import ProductList from '../components/product/ProductList';
import { getAllProducts } from '../services/productService';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getAllProducts();
                setProducts(data);
            } catch (err) {
                setError('Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy 1 lần khi component được mount

    if (loading) return <p>Đang tải sản phẩm...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Sản phẩm nổi bật</h1>
            <ProductList products={products} />
        </div>
    );
};

export default HomePage;
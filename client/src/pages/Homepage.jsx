// client/src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { getAllProducts } from '../services/productService';

// Import các component mới
import Hero from '../components/home/Hero';
import Services from '../components/home/Services';
import ProductList from '../components/product/ProductList';
import BlogSection from '../components/home/BlogSection';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Lấy 8 sản phẩm để hiển thị làm sản phẩm nổi bật
                const allProducts = await getAllProducts();
                setProducts(allProducts.slice(0, 8)); 
            } catch (err) {
                setError('Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div>
            <Hero />
            <Services />

            {/* Khu vực sản phẩm nổi bật */}
            <div style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2em', marginBottom: '40px' }}>SẢN PHẨM NỔI BẬT</h2>
                {loading && <p>Đang tải sản phẩm...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {products.length > 0 && <ProductList products={products} />}
            </div>

            <BlogSection />
        </div>
    );
};

export default HomePage;
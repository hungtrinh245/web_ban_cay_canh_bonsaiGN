// client/src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
// Sửa lại import
import { getNewProducts, getFeaturedProducts } from '../services/productService';

import Hero from '../components/home/Hero';
import Services from '../components/home/Services';
import ProductList from '../components/product/ProductList';
import BlogSection from '../components/home/BlogSection';

const HomePage = () => {
    // Tạo 2 state riêng biệt
    const [newProducts, setNewProducts] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                // Gọi cả 2 API cùng lúc
                const newProductsData = getNewProducts();
                const featuredProductsData = getFeaturedProducts();

                const [newResults, featuredResults] = await Promise.all([newProductsData, featuredProductsData]);
                
                setNewProducts(newResults.slice(0, 8)); // Lấy 8 sản phẩm mới nhất
                setFeaturedProducts(featuredResults); // Lấy tất cả sản phẩm nổi bật

            } catch (err) {
                setError('Không thể tải dữ liệu sản phẩm.');
            } finally {
                setLoading(false);
            }
        };

        fetchAllProducts();
    }, []);

    const Section = ({ title, products, bgColor = 'white' }) => (
        <div style={{ background: bgColor, padding: '60px 0' }}>
            <div style={{ maxWidth: '1200px', margin: 'auto', padding: '0 20px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2em', fontWeight: 'normal', marginBottom: '10px' }}>{title}</h2>
                <div style={{width: '100px', height: '4px', background: '#28a745', margin: '0 auto 40px auto'}}></div>
                
                {loading && <p>Đang tải...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {products.length > 0 && <ProductList products={products} />}
            </div>
        </div>
    );

    return (
        <div>
            <Hero />
            <Services />
            
            {/* Hiển thị 2 khu vực riêng biệt */}
            <Section title="SẢN PHẨM MỚI" products={newProducts} />
            <Section title="SẢN PHẨM NỔI BẬT" products={featuredProducts} bgColor='#f8f9fa' />

            <BlogSection />
        </div>
    );
};

export default HomePage;
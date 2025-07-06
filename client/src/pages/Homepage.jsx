// client/src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { getNewProducts, getFeaturedProducts } from '../services/productService'; 

import Hero from '../components/home/Hero';
import Services from '../components/home/Services';
import CategoryShowcase from '../components/home/CategoryShowcase'; 
import ProductList from '../components/product/ProductList';
import BlogSection from '../components/home/BlogSection';

const HomePage = ({ onAddToCartSuccess }) => { 
    const [newProducts, setNewProducts] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                setLoading(true);
                const newResultsPromise = getNewProducts(1, 4); // Lấy 4 sản phẩm mới nhất từ trang 1
                const featuredResultsPromise = getFeaturedProducts(); 
                const [newResults, featuredResults] = await Promise.all([newResultsPromise, featuredResultsPromise]);
                
                // data.products cho newResults, còn featuredResults trả về trực tiếp mảng
                setNewProducts(newResults.products || newResults); 
                setFeaturedProducts(featuredResults); // featuredResults không có cấu trúc {products, page, ...}

            } catch (err) {
                setError('Không thể tải dữ liệu sản phẩm.');
            } finally {
                setLoading(false);
            }
        };
        fetchAllProducts();
    }, []);

    const Section = ({ title, products, loading, error, onAddToCartSuccess }) => ( 
        <div style={{ background: '#f8f9fa', padding: '60px 0' }}>
            <div style={{ maxWidth: '1200px', margin: 'auto', padding: '0 20px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2em', fontWeight: 'normal', marginBottom: '10px' }}>{title}</h2>
                <div style={{width: '100px', height: '4px', background: '#28a745', margin: '0 auto 40px auto'}}></div>
                
                {loading ? <p>Đang tải...</p> : error ? <p style={{color: 'red'}}>{error}</p> : <ProductList products={products} onAddToCartSuccess={onAddToCartSuccess} />}
            </div>
        </div>
    );

    return (
        <div>
            <Hero />
            <Services />
            <CategoryShowcase /> 

            <Section title="SẢN PHẨM MỚI" products={newProducts} loading={loading} error={error} onAddToCartSuccess={onAddToCartSuccess} />
            <Section title="SẢN PHẨM NỔI BẬT" products={featuredProducts} loading={loading} error={null} onAddToCartSuccess={onAddToCartSuccess} />

            <BlogSection />
        </div>
    );
};

export default HomePage;
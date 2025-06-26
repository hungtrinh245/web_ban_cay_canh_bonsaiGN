// client/src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { getNewProducts, getFeaturedProducts } from '../services/productService';

import Hero from '../components/home/Hero';
import Services from '../components/home/Services';
import CategoryShowcase from '../components/home/CategoryShowcase'; // <-- Import component mới
import ProductList from '../components/product/ProductList';
import BlogSection from '../components/home/BlogSection';

const HomePage = () => {
    const [newProducts, setNewProducts] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                setLoading(true);
                const newProductsData = getNewProducts();
                const featuredProductsData = getFeaturedProducts();
                const [newResults, featuredResults] = await Promise.all([newProductsData, featuredProductsData]);
                
                setNewProducts(newResults.slice(0, 4));
                setFeaturedProducts(featuredResults.slice(0, 4));
            } catch (err) {
                setError('Không thể tải dữ liệu sản phẩm.');
            } finally {
                setLoading(false);
            }
        };
        fetchAllProducts();
    }, []);

    const Section = ({ title, products, loading, error }) => (
        <div style={{ maxWidth: '1200px', margin: 'auto', padding: '0 20px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2em', fontWeight: 'normal', marginBottom: '10px' }}>{title}</h2>
            <div style={{width: '100px', height: '4px', background: '#28a745', margin: '0 auto 40px auto'}}></div>
            
            {loading ? <p>Đang tải...</p> : error ? <p style={{color: 'red'}}>{error}</p> : <ProductList products={products} />}
        </div>
    );

    return (
        <div>
            <Hero />
            <Services />
            <CategoryShowcase /> 

            <div style={{ background: '#f8f9fa', padding: '60px 0' }}>
                 <Section title="SẢN PHẨM MỚI" products={newProducts} loading={loading} error={error} />
            </div>
            
            <div style={{ padding: '60px 0' }}>
                <Section title="SẢN PHẨM NỔI BẬT" products={featuredProducts} loading={loading} error={null} /> {/* Giả sử không báo lỗi trùng lặp */}
            </div>

            <BlogSection />
        </div>
    );
};

export default HomePage;
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
        <div style={{
            background: '#fafafa',
            padding: '80px 0'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: 'auto',
                padding: '0 24px',
                textAlign: 'center'
            }}>
                <div style={{ marginBottom: '60px' }}>
                    <h2 style={{
                        fontSize: '2.5rem',
                        fontWeight: '600',
                        marginBottom: '16px',
                        color: '#262626'
                    }}>
                        {title}
                    </h2>
                    <div style={{
                        width: '80px',
                        height: '4px',
                        background: 'linear-gradient(135deg, #52c41a, #389e0d)',
                        margin: '0 auto 20px auto',
                        borderRadius: '2px'
                    }}></div>
                    <p style={{
                        color: '#8c8c8c',
                        fontSize: '16px',
                        maxWidth: '600px',
                        margin: '0 auto',
                        lineHeight: '1.6'
                    }}>
                        {title === 'SẢN PHẨM MỚI'
                            ? 'Khám phá những sản phẩm cây cảnh mới nhất được cập nhật hàng tuần'
                            : 'Những sản phẩm được yêu thích nhất và có chất lượng tốt nhất'
                        }
                    </p>
                </div>

                {loading ? (
                    <div style={{ padding: '60px 0' }}>
                        <p style={{ fontSize: '16px', color: '#8c8c8c' }}>Đang tải sản phẩm...</p>
                    </div>
                ) : error ? (
                    <div style={{ padding: '60px 0' }}>
                        <p style={{ color: '#ff4d4f', fontSize: '16px' }}>{error}</p>
                    </div>
                ) : (
                    <ProductList products={products} onAddToCartSuccess={onAddToCartSuccess} />
                )}
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
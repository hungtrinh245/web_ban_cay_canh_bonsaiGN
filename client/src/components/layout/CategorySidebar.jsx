// client/src/components/layout/CategorySidebar.jsx
import React, { useState, useEffect } from 'react';
import { getCategories, getNewProducts } from '../../services/productService';
import { Link } from 'react-router-dom';
// SỬA LỖI: Import Button từ antd
import { Button } from 'antd';

const CategorySidebar = ({ selectedCategory, onSelectCategory, onApplyPriceFilter, overallMinPriceRange, overallMaxPriceRange, initialMinPrice, initialMaxPrice }) => {
    const [categories, setCategories] = useState([]);
    const [randomProducts, setRandomProducts] = useState([]);
    const [minPriceRange, setMinPriceRange] = useState(overallMinPriceRange);
    const [maxPriceRange, setMaxPriceRange] = useState(overallMaxPriceRange);

    const [currentMinPrice, setCurrentMinPrice] = useState(initialMinPrice);
    const [currentMaxPrice, setCurrentMaxPrice] = useState(initialMaxPrice);

    // Hàm này sẽ được dùng để lấy các bài viết mới nhất cho sidebar (nếu có)
    const latestPosts = [
        { _id: '1', title: 'Nên tưới cây bằng nước máy hay nước đun sôi?', image: '/images/tuoi-cay-bang-nuoc-may-2.jpg' },
        { _id: '2', title: '8 yếu tố giúp cây trồng trong nhà luôn xanh tốt', image: '/images/yeu-to-giup-cay-canh-trong-nha-luon-xanh-tot.jpg' },
        { _id: '3', title: 'Bí quyết chọn chậu phù hợp cho từng loại cây', image: '/images/bi-quyet-chon-chau-cay.jpg' },
    ];

    useEffect(() => {
        const fetchSidebarData = async () => {
            try {
                const categoryData = await getCategories();
                setCategories(categoryData);

                const productsDataResponse = await getNewProducts();
                const productsData = productsDataResponse.products || [];
                const shuffled = productsData.sort(() => 0.5 - Math.random());
                setRandomProducts(shuffled.slice(0, 5));

                const prices = productsData.map(p => p.price).filter(p => p !== undefined);
                if (prices.length > 0) {
                    const dynamicMin = Math.min(...prices);
                    const dynamicMax = Math.max(...prices);
                    setMinPriceRange(dynamicMin);
                    setMaxPriceRange(dynamicMax);
                } else {
                    setMinPriceRange(0);
                    setMaxPriceRange(1000000);
                }

            } catch (error) {
                console.error("Không thể tải dữ liệu sidebar:", error);
            }
        };

        fetchSidebarData();
    }, [overallMinPriceRange, overallMaxPriceRange]);

    useEffect(() => {
        setCurrentMinPrice(initialMinPrice);
        setCurrentMaxPrice(initialMaxPrice);
    }, [initialMinPrice, initialMaxPrice]);

    const handlePriceFilterChange = (e) => {
        if (e.target.id === 'minPrice') {
            setCurrentMinPrice(Number(e.target.value));
        } else {
            setCurrentMaxPrice(Number(e.target.value));
        }
    };

    const applyFilter = () => {
        if (onApplyPriceFilter) {
            onApplyPriceFilter(currentMinPrice, currentMaxPrice);
        }
    };

    // Helper functions for hover effects
    const applyHover = (e, hoverStyle) => Object.assign(e.currentTarget.style, hoverStyle);
    const removeHover = (e, baseStyle) => Object.assign(e.currentTarget.style, baseStyle);

    // --- CÁC STYLE ---
    const sidebarStyle = {
        width: '280px',
        flexShrink: 0,
        paddingRight: '30px',
        fontFamily: 'Roboto, sans-serif',
    };

    const sectionStyle = {
        marginBottom: '30px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        padding: '25px',
        border: '1px solid #eee',
    };

    const sectionTitleStyle = {
        fontSize: '1.3em',
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: '15px',
        paddingBottom: '10px',
        borderBottom: '2px solid #eee',
    };

    const categoryListStyle = {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    };

    const categoryItemStyle = {
        marginBottom: '8px',
        transition: 'color 0.2s, transform 0.2s',
    };

    const categoryItemHoverStyle = {
        color: '#28a745',
        transform: 'translateX(5px)',
    };

    const categoryLinkStyle = {
        textDecoration: 'none',
        color: '#555',
        fontSize: '0.95em',
        display: 'block',
        padding: '5px 0',
    };

    const priceFilterInputGroup = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '15px',
        gap: '10px',
    };

    const priceInputStyle = {
        width: 'calc(50% - 20px)',
        padding: '8px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '0.9em',
    };

    const filterButton = {
        width: '100%',
        padding: '10px',
        background: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1em',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease',
    };

    const filterButtonHoverStyle = {
        backgroundColor: '#218838',
    };

    const randomProductListStyle = {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    };

    const randomProductItemStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '15px',
        paddingBottom: '15px',
        borderBottom: '1px dashed #eee',
        '&:last-child': {
            borderBottom: 'none',
            paddingBottom: '0',
            marginBottom: '0',
        }
    };

    const randomProductImageStyle = {
        width: '60px',
        height: '60px',
        objectFit: 'cover',
        borderRadius: '8px',
        marginRight: '15px',
    };

    const randomProductInfoStyle = {
        flexGrow: 1,
        textAlign: 'left',
    };

    const randomProductNameStyle = {
        fontSize: '1em',
        fontWeight: 'bold',
        color: '#333',
        textDecoration: 'none',
        '&:hover': {
            color: '#28a745',
            textDecoration: 'underline',
        }
    };

    const randomProductPriceStyle = {
        fontSize: '0.9em',
        color: '#28a745',
        fontWeight: 'bold',
        marginTop: '5px',
    };

    const blogPostItemStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '15px',
        paddingBottom: '15px',
        borderBottom: '1px dashed #eee',
        '&:last-child': {
            borderBottom: 'none',
            paddingBottom: '0',
            marginBottom: '0',
        }
    };

    const blogPostImageStyle = {
        width: '80px',
        height: '60px',
        objectFit: 'cover',
        borderRadius: '8px',
        marginRight: '15px',
    };

    const blogPostTitleStyle = {
        fontSize: '0.95em',
        fontWeight: 'bold',
        color: '#333',
        textDecoration: 'none',
        '&:hover': {
            color: '#28a745',
            textDecoration: 'underline',
        }
    };


    return (
        <div style={sidebarStyle}>
            {/* Lọc theo danh mục */}
            <div style={sectionStyle}>
                <h3 style={sectionTitleStyle}>DANH MỤC SẢN PHẨM</h3>
                <ul style={categoryListStyle}>
                    <li style={categoryItemStyle}
                        onMouseOver={(e) => applyHover(e, categoryItemHoverStyle)}
                        onMouseOut={(e) => removeHover(e, categoryItemStyle)}
                    >
                        <Link
                            to="/shop"
                            style={{ ...categoryLinkStyle, fontWeight: selectedCategory === null ? 'bold' : 'normal' }}
                        >
                            Tất cả sản phẩm
                        </Link>
                    </li>
                    {categories.length > 0 ? (
                        categories.map((cat) => (
                            <li key={cat._id} style={categoryItemStyle}
                                onMouseOver={(e) => applyHover(e, categoryItemHoverStyle)}
                                onMouseOut={(e) => removeHover(e, categoryItemStyle)}
                            >
                                <Link
                                    to={`/shop/category/${encodeURIComponent(cat.name)}`}
                                    style={{ ...categoryLinkStyle, fontWeight: selectedCategory === cat.name ? 'bold' : 'normal' }}
                                >
                                    {cat.name}
                                    {cat.productCount > 0 && (
                                        <span style={{
                                            fontSize: '0.8em',
                                            color: '#28a745',
                                            marginLeft: '8px',
                                            backgroundColor: '#e8f5e8',
                                            padding: '2px 6px',
                                            borderRadius: '10px'
                                        }}>
                                            ({cat.productCount})
                                        </span>
                                    )}
                                </Link>
                            </li>
                        ))
                    ) : (
                        <li style={{ ...categoryItemStyle, color: '#999', fontStyle: 'italic' }}>
                            Đang tải danh mục...
                        </li>
                    )}
                </ul>
            </div>

            {/* Lọc theo giá */}
            <div style={sectionStyle}>
                <h3 style={sectionTitleStyle}>LỌC THEO GIÁ</h3>
                <div style={priceFilterInputGroup}>
                    <input
                        type="number"
                        id="minPrice"
                        value={currentMinPrice}
                        onChange={handlePriceFilterChange}
                        style={priceInputStyle}
                        min={minPriceRange}
                        max={maxPriceRange}
                    />
                    <span>-</span>
                    <input
                        type="number"
                        id="maxPrice"
                        value={currentMaxPrice}
                        onChange={handlePriceFilterChange}
                        style={priceInputStyle}
                        min={minPriceRange}
                        max={maxPriceRange}
                    />
                </div>
                <Button
                    onClick={applyFilter}
                    style={filterButton}
                    onMouseOver={(e) => applyHover(e, filterButtonHoverStyle)}
                    onMouseOut={(e) => removeHover(e, filterButton)}
                >
                    Lọc
                </Button>
            </div>

            {/* Sản phẩm ngẫu nhiên */}
            <div style={sectionStyle}>
                <h3 style={sectionTitleStyle}>SẢN PHẨM CÓ THỂ BẠN THÍCH</h3>
                <ul style={randomProductListStyle}>
                    {randomProducts.map((product) => (
                        // SỬA LỖI: Đảm bảo key duy nhất và render thuộc tính của product
                        <li key={product._id} style={randomProductItemStyle}>
                            <img src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/60?text=No+Image'} alt={product.name} style={randomProductImageStyle} />
                            <div style={randomProductInfoStyle}>
                                <Link to={`/products/${product._id}`} style={randomProductNameStyle}
                                    onMouseOver={(e) => applyHover(e, randomProductNameStyle['&:hover'])}
                                    onMouseOut={(e) => removeHover(e, randomProductNameStyle)}
                                >
                                    {product.name}
                                </Link>
                                <p style={randomProductPriceStyle}>{product.price.toLocaleString('vi-VN')} VNĐ</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Bài viết mới nhất */}
            <div style={sectionStyle}>
                <h3 style={sectionTitleStyle}>BÀI VIẾT MỚI NHẤT</h3>
                <ul style={randomProductListStyle}> {/* Tái sử dụng style list */}
                    {latestPosts.map((post) => (
                        <li key={post._id} style={blogPostItemStyle}>
                            <img src={post.image || 'https://via.placeholder.com/80?text=No+Image'} alt={post.title} style={blogPostImageStyle} />
                            <div style={randomProductInfoStyle}>
                                <Link to={`/blog/${post._id}`} style={blogPostTitleStyle}
                                    onMouseOver={(e) => applyHover(e, blogPostTitleStyle['&:hover'])}
                                    onMouseOut={(e) => removeHover(e, blogPostTitleStyle)}
                                >
                                    {post.title}
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CategorySidebar;
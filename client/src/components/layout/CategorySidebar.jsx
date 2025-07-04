// client/src/components/layout/CategorySidebar.jsx
import React, { useState, useEffect } from 'react';
import { getCategories, getNewProducts } from '../../services/productService';
import { Link } from 'react-router-dom';

// Thêm onApplyPriceFilter, initialMinPrice, initialMaxPrice vào props
const CategorySidebar = ({ selectedCategory, onSelectCategory, onApplyPriceFilter, initialMinPrice, initialMaxPrice }) => {
    const [categories, setCategories] = useState([]);
    const [randomProducts, setRandomProducts] = useState([]);
    const [minPriceRange, setMinPriceRange] = useState(0); // Giới hạn min của thanh trượt
    const [maxPriceRange, setMaxPriceRange] = useState(1000000); // Giới hạn max của thanh trượt (có thể lấy từ API)
    const [currentMinPrice, setCurrentMinPrice] = useState(initialMinPrice); // Giá trị hiện tại của range
    const [currentMaxPrice, setCurrentMaxPrice] = useState(initialMaxPrice); // Giá trị hiện tại của range

    // Dữ liệu mẫu cho bài viết mới nhất (tạm thời, sau này có thể fetch từ API)
    const latestPosts = [
        { id: 1, title: 'Nên tưới cây bằng nước máy hay nước đun sôi?', image: '/images/sample-luoi-ho.jpg' },
        { id: 2, title: '8 yếu tố giúp cây trồng trong nhà luôn xanh tốt', image: '/images/sample-trau-ba.jpg' },
        { id: 3, title: '10 loại cây trừ tà ma, xua đuổi vận xui hiệu quả', image: '/images/sample-xuong-rong-tai-tho.jpg' },
        { id: 4, title: 'Bí quyết chọn chậu phù hợp cho từng loại cây', image: '/images/sample-sanh-co.jpg' },
        { id: 5, title: 'Sự thật bất ngờ về lợi ích của cây cảnh trong nhà', image: '/images/sample-kim-tien.jpg' },
    ];

    useEffect(() => {
        const fetchSidebarData = async () => {
            try {
                const categoryData = await getCategories();
                setCategories(categoryData);

                const productsData = await getNewProducts();
                const shuffled = productsData.sort(() => 0.5 - Math.random());
                setRandomProducts(shuffled.slice(0, 5));

                // Cập nhật giới hạn min/max của thanh trượt dựa trên dữ liệu sản phẩm
                const prices = productsData.map(p => p.price).filter(p => p !== undefined);
                if (prices.length > 0) {
                    const dynamicMin = Math.min(...prices);
                    const dynamicMax = Math.max(...prices);
                    setMinPriceRange(dynamicMin);
                    setMaxPriceRange(dynamicMax);
                }

            } catch (error) {
                console.error("Không thể tải dữ liệu sidebar:", error);
            }
        };
        fetchSidebarData();
    }, []);

    // Cập nhật giá trị thanh trượt khi initialMinPrice/initialMaxPrice thay đổi từ ShopPage
    useEffect(() => {
        setCurrentMinPrice(initialMinPrice);
        setCurrentMaxPrice(initialMaxPrice);
    }, [initialMinPrice, initialMaxPrice]);


    const handlePriceFilterChange = (e) => {
        const value = Number(e.target.value);
        if (e.target.id === "minPrice") {
            setCurrentMinPrice(value);
            // Đảm bảo min không vượt quá max
            if (value > currentMaxPrice) {
                setCurrentMaxPrice(value);
            }
        } else if (e.target.id === "maxPrice") {
            setCurrentMaxPrice(value);
            // Đảm bảo max không nhỏ hơn min
            if (value < currentMinPrice) {
                setCurrentMinPrice(value);
            }
        }
    };

    const applyFilter = () => {
        // Gọi hàm callback từ ShopPage
        if (onApplyPriceFilter) {
            onApplyPriceFilter(currentMinPrice, currentMaxPrice);
        }
    };

    const sectionTitleStyle = {
        fontSize: '1.2em',
        fontWeight: 'bold',
        marginBottom: '15px',
        marginTop: '30px',
        color: '#333',
        borderBottom: '2px solid #28a745',
        paddingBottom: '8px',
    };

    const linkStyle = (category) => ({
        display: 'block',
        padding: '10px 15px',
        textDecoration: 'none',
        color: selectedCategory === category ? '#28a745' : '#555',
        fontWeight: selectedCategory === category ? 'bold' : 'normal',
        background: selectedCategory === category ? '#e9f5e9' : 'transparent',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontSize: '0.95em'
    });

    const sidebarWrapperStyle = {
        width: '280px',
        padding: '20px',
        background: '#fff',
        boxShadow: '2px 0 8px rgba(0,0,0,0.08)',
        minHeight: 'calc(100vh - 120px)',
        boxSizing: 'border-box',
        overflowY: 'auto',
    };

    const priceFilterContainerStyle = {
        padding: '15px 0',
        borderBottom: '1px solid #eee',
        marginBottom: '20px'
    };

    const priceRangeInputStyle = {
        width: '100%',
        margin: '10px 0',
        height: '5px',
        background: '#d3d3d3',
        borderRadius: '5px',
        outline: 'none',
        opacity: '0.7',
        transition: 'opacity .2s',
        appearance: 'none',
    };
    
    const filterButtonStyle = {
        background: '#28a745',
        color: 'white',
        border: 'none',
        padding: '8px 18px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginTop: '10px',
        transition: 'background-color 0.3s ease',
    };

    const productListItemStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '15px',
        gap: '10px',
        borderBottom: '1px solid #f0f0f0',
        paddingBottom: '10px',
    };

    const productImgStyle = {
        width: '60px',
        height: '60px',
        objectFit: 'cover',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    };

    const productInfoStyle = {
        flex: 1,
        textAlign: 'left',
    };

    const productNameStyle = {
        margin: 0,
        fontSize: '0.95em',
        fontWeight: 'bold',
        color: '#333',
        textDecoration: 'none',
        '&:hover': {
            color: '#28a745',
        }
    };

    const productPriceStyle = {
        margin: '3px 0 0 0',
        fontSize: '0.9em',
        color: '#28a745',
        fontWeight: 'bold',
    };

    const postItemStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '15px',
        gap: '10px',
        borderBottom: '1px solid #f0f0f0',
        paddingBottom: '10px',
    };

    const postImgStyle = {
        width: '60px',
        height: '60px',
        objectFit: 'cover',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    };

    const postTitleStyle = {
        margin: 0,
        fontSize: '0.95em',
        color: '#333',
        textDecoration: 'none',
        '&:hover': {
            color: '#28a745',
        }
    };


    return (
        <div style={sidebarWrapperStyle}>
            {/* DANH MỤC SẢN PHẨM */}
            <h3 style={sectionTitleStyle}>
                DANH MỤC SẢN PHẨM
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0' }}>
                <li
                    style={{
                        ...linkStyle(null),
                        onMouseOver: (e) => Object.assign(e.currentTarget.style, { background: '#f0f0f0', color: '#28a745' }),
                        onMouseOut: (e) => Object.assign(e.currentTarget.style, { background: 'transparent', color: selectedCategory === null ? '#28a745' : '#555' }),
                    }}
                    onClick={() => onSelectCategory(null)}
                >
                    Tất cả sản phẩm
                </li>
                {categories.map(category => (
                    <li
                        key={category}
                        style={{
                            ...linkStyle(category),
                            onMouseOver: (e) => Object.assign(e.currentTarget.style, { background: '#f0f0f0', color: '#28a745' }),
                            onMouseOut: (e) => Object.assign(e.currentTarget.style, { background: 'transparent', color: selectedCategory === category ? '#28a745' : '#555' }),
                        }}
                        onClick={() => onSelectCategory(category)}
                    >
                        {category}
                    </li>
                ))}
            </ul>

            {/* LỌC THEO GIÁ */}
            <h3 style={sectionTitleStyle}>LỌC THEO GIÁ</h3>
            <div style={priceFilterContainerStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
                    <label htmlFor="minPrice" style={{ fontSize: '0.9em', color: '#555' }}>Từ:</label>
                    <input
                        type="range"
                        id="minPrice"
                        min={minPriceRange}
                        max={maxPriceRange}
                        value={currentMinPrice}
                        onChange={handlePriceFilterChange}
                        style={priceRangeInputStyle}
                    />
                    <span style={{ fontSize: '0.9em', fontWeight: 'bold', color: '#28a745', minWidth: '80px', textAlign: 'right' }}>{currentMinPrice.toLocaleString('vi-VN')} VNĐ</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
                    <label htmlFor="maxPrice" style={{ fontSize: '0.9em', color: '#555' }}>Đến:</label>
                    <input
                        type="range"
                        id="maxPrice"
                        min={minPriceRange}
                        max={maxPriceRange}
                        value={currentMaxPrice}
                        onChange={handlePriceFilterChange}
                        style={priceRangeInputStyle}
                    />
                    <span style={{ fontSize: '0.9em', fontWeight: 'bold', color: '#28a745', minWidth: '80px', textAlign: 'right' }}>{currentMaxPrice.toLocaleString('vi-VN')} VNĐ</span>
                </div>
                
                <button
                    onClick={applyFilter} // Gọi hàm applyFilter
                    style={filterButtonStyle}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
                >
                    Áp dụng
                </button>
            </div>

            {/* SẢN PHẨM MỚI (hoặc Ngẫu nhiên) */}
            <h3 style={sectionTitleStyle}>SẢN PHẨM MỚI</h3>
            <div style={{ marginBottom: '30px' }}>
                {randomProducts.map(product => (
                    <Link to={`/products/${product._id}`} key={product._id} style={{ textDecoration: 'none' }}>
                        <div style={productListItemStyle}>
                            <img src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/60?text=No+Image'} alt={product.name} style={productImgStyle} />
                            <div style={productInfoStyle}>
                                <p style={productNameStyle}>{product.name}</p>
                                {product.price && <p style={productPriceStyle}>{product.price.toLocaleString('vi-VN')} VNĐ</p>}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* BÀI VIẾT MỚI NHẤT */}
            <h3 style={sectionTitleStyle}>BÀI VIẾT MỚI NHẤT</h3>
            <div>
                {latestPosts.map(post => (
                    <Link to={`/blog/${post.id}`} key={post.id} style={{ textDecoration: 'none' }}>
                        <div style={postItemStyle}>
                            <img src={post.image} alt={post.title} style={postImgStyle} />
                            <div style={productInfoStyle}>
                                <p style={postTitleStyle}>{post.title}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategorySidebar;
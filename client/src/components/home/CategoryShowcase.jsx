// client/src/components/home/CategoryShowcase.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../../services/productService'; 

const CategoryShowcase = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const data = await getCategories(); 
                setCategories(data);
            } catch (err) {
                setError("Không thể tải danh mục.");
                console.error("Fetch categories error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // --- CÁC STYLE ---
    const showcaseStyle = {
        padding: '80px 0',
        backgroundColor: '#fff',
        textAlign: 'center',
    };

    const sectionTitleStyle = {
        fontSize: '2.5em',
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: '40px',
        position: 'relative',
        paddingBottom: '15px',
        '&::after': {
            content: '""',
            width: '80px',
            height: '4px',
            background: '#28a745',
            margin: '0 auto',
            display: 'block',
            marginTop: '10px',
        }
    };

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '30px',
        maxWidth: '1200px',
        margin: '0 auto',
    };

    const categoryCardStyle = {
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        textDecoration: 'none',
        color: '#333',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden', // Ẩn phần ảnh thừa nếu tràn
        minHeight: '250px', // Tăng chiều cao tối thiểu của thẻ
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
            backgroundColor: '#e9f5e9',
        }
    };

    const categoryImageStyle = { // STYLE MỚI CHO ẢNH DANH MỤC (Bao phủ toàn bộ)
        width: '100%', // Chiếm toàn bộ chiều rộng
        height: '150px', // Chiều cao cố định
        objectFit: 'cover', // Đảm bảo ảnh bao phủ và không bị méo
        borderRadius: '12px 12px 0 0', // Chỉ bo góc trên
        marginBottom: '15px', // Khoảng cách với chữ
    };

    const categoryContentStyle = { // Style cho phần nội dung (chữ)
        padding: '0 20px 20px', // Padding dưới và hai bên
        textAlign: 'center',
        flexGrow: 1, // Đảm bảo nội dung chiếm hết không gian còn lại
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    };

    const categoryTitleStyle = {
        fontSize: '1.4em',
        fontWeight: 'bold',
        marginTop: '0', 
        color: '#2c3e50',
    };

    const loadingStyle = {
        textAlign: 'center',
        padding: '50px',
    };

    // Helper functions for hover effects
    const applyHover = (e, hoverStyle) => Object.assign(e.currentTarget.style, hoverStyle);
    const removeHover = (e, baseStyle) => Object.assign(e.currentTarget.style, baseStyle);


    if (loading) return <div style={loadingStyle}>Đang tải danh mục...</div>;
    if (error) return <div style={{...loadingStyle, color: 'red'}}>Lỗi: {error}</div>;

    return (
        <div style={showcaseStyle}>
            <h2 style={sectionTitleStyle}>
                KHÁM PHÁ THEO DANH MỤC
                <div style={sectionTitleStyle['&::after']}></div>
            </h2>
            <div style={gridStyle}>
                {categories.map((category) => (
                    <Link
                        key={category._id} 
                        to={`/shop/category/${category.name}`}
                        style={categoryCardStyle}
                        onMouseOver={(e) => applyHover(e, categoryCardStyle['&:hover'])}
                        onMouseOut={(e) => removeHover(e, categoryCardStyle)}
                    >
                        {/* HIỂN THỊ ẢNH DANH MỤC (Bao phủ toàn bộ phần trên) */}
                        {category.image && (
                            <img src={category.image} alt={category.name} style={categoryImageStyle} />
                        )}
                        {/* Phần nội dung của thẻ */}
                        <div style={categoryContentStyle}>
                            <h3 style={categoryTitleStyle}>{category.name}</h3> 
                            <p style={{fontSize: '0.9em', color: '#666'}}>{category.description || ''}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategoryShowcase;
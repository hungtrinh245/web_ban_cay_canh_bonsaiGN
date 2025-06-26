// client/src/components/home/CategoryShowcase.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../../services/productService';

const CategoryShowcase = () => {
    const [categories, setCategories] = useState([]);

    // Ánh xạ tên danh mục với một hình ảnh đại diện
    // Chúng ta sẽ lấy các ảnh đã có trong public/images
    const categoryImages = {
        'Cây để bàn': '/images/sample-kim-tien.jpg',
        'Cây phong thủy': '/images/sample-tung-la-han.jpg',
        'Sen đá': '/images/sample-sen-da-chuoi-ngoc.jpg',
        'Xương rồng': '/images/sample-xuong-rong-tai-tho.jpg',
        'Cây thủy sinh': '/images/sample-trau-ba.jpg',
        // Thêm các danh mục khác bạn có ở đây
        'Cây cao cấp': '/images/sample-sanh-co.jpg',
        'Cây văn phòng': '/images/sample-luoi-ho.jpg',
    };
    const defaultImage = '/images/sample-mai-vang.jpg'; // Ảnh mặc định nếu không có ảnh riêng

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Không thể tải danh mục:", error);
            }
        };
        fetchCategories();
    }, []);

    const sectionStyle = {
        padding: '60px 20px',
        textAlign: 'center',
        background: '#fff',
    };

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        maxWidth: '1200px',
        margin: '40px auto 0 auto'
    };
    
    const cardStyle = {
        position: 'relative',
        height: '350px',
        borderRadius: '8px',
        overflow: 'hidden',
        color: 'white',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    };

    const cardImageStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: 1,
        transition: 'transform 0.3s ease',
    };

    const cardOverlayStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.4)',
        zIndex: 2,
    };

    const cardTitleStyle = {
        position: 'relative',
        zIndex: 3,
        fontSize: '1.5em',
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
    };
    

    return (
        <div style={sectionStyle}>
            <h2 style={{ fontSize: '2em', fontWeight: 'normal', marginBottom: '10px' }}>KHÁM PHÁ THEO DANH MỤC</h2>
            <div style={{width: '100px', height: '4px', background: '#28a745', margin: '0 auto 40px auto'}}></div>
            
            <div style={gridStyle}>
                {categories.map(category => (
                    <Link
                        key={category}
                        to={`/shop/category/${encodeURIComponent(category)}`}
                        style={cardStyle}
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <img 
                            src={categoryImages[category] || defaultImage} 
                            alt={category} 
                            style={cardImageStyle}
                        />
                        <div style={cardOverlayStyle}></div>
                        <h3 style={cardTitleStyle}>{category}</h3>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategoryShowcase;
// client/src/components/home/CategoryShowcase.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../../services/productService'; // Import hàm API

const CategoryShowcase = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                // getCategories sẽ trả về một mảng các đối tượng { _id, name, description, ... }
                const data = await getCategories();
                // Lọc chỉ 6 danh mục đầu tiên hoặc hiển thị tất cả
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
        padding: '25px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        textDecoration: 'none',
        color: '#333',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '150px',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
            backgroundColor: '#e9f5e9',
        }
    };

    const categoryTitleStyle = {
        fontSize: '1.4em',
        fontWeight: 'bold',
        marginTop: '15px',
        color: '#2c3e50',
    };

    const loadingStyle = {
        textAlign: 'center',
        padding: '50px',
    };

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
                    // SỬA LỖI: Đảm bảo sử dụng key duy nhất (_id) và render tên (name)
                    <Link
                        key={category._id} // <- Đảm bảo key duy nhất
                        to={`/shop/category/${category.name}`}
                        style={categoryCardStyle}
                        onMouseOver={(e) => Object.assign(e.currentTarget.style, categoryCardStyle['&:hover'])}
                        onMouseOut={(e) => Object.assign(e.currentTarget.style, categoryCardStyle)}
                    >
                        {/* Lỗi "Objects are not valid as a React child" xảy ra khi bạn 
                            cố gắng render category trực tiếp trong JSX, ví dụ: <div>{category}</div>.
                            Chúng ta cần render category.name.
                        */}
                        <h3 style={categoryTitleStyle}>{category.name}</h3> 
                        <p style={{fontSize: '0.9em', color: '#666'}}>{category.description || ''}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategoryShowcase;
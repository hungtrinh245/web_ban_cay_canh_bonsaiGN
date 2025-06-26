// client/src/components/layout/CategorySidebar.jsx
import React, { useState, useEffect } from 'react';
import { getCategories } from '../../services/productService';

const CategorySidebar = ({ selectedCategory, onSelectCategory }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.log("Không thể tải danh mục");
            }
        };
        fetchCategories();
    }, []);

    const linkStyle = (category) => ({
        display: 'block',
        padding: '10px 15px',
        textDecoration: 'none',
        color: selectedCategory === category ? '#28a745' : '#333',
        fontWeight: selectedCategory === category ? 'bold' : 'normal',
        background: selectedCategory === category ? '#e9f5e9' : 'transparent',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'all 0.2s'
    });

    return (
        <div style={{
            width: '250px',
            padding: '20px',
            borderRight: '1px solid #eee',
            background: '#fff'
        }}>
            <h3 style={{ marginBottom: '20px', borderBottom: '2px solid #28a745', paddingBottom: '10px' }}>
                DANH MỤC SẢN PHẨM
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li 
                    style={linkStyle(null)} 
                    onClick={() => onSelectCategory(null)}
                >
                    Tất cả sản phẩm
                </li>
                {categories.map(category => (
                    <li 
                        key={category} 
                        style={linkStyle(category)}
                        onClick={() => onSelectCategory(category)}
                    >
                        {category}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategorySidebar;
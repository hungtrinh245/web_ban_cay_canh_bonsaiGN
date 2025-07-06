// client/src/pages/SearchPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; //lấy query param
import { searchProducts } from '../services/productService'; //gọi API tìm kiếm
import ProductList from '../components/product/ProductList'; //hiển thị danh sách sản phẩm

const SearchPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get('keyword'); // Lấy từ khóa từ URL

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (keyword) {
            const fetchSearchResults = async () => {
                try {
                    setLoading(true);
                    const data = await searchProducts(keyword);
                    setProducts(data);
                } catch (err) {
                    console.error("Lỗi khi tìm kiếm:", err);
                    setError('Không thể tải kết quả tìm kiếm.');
                } finally {
                    setLoading(false);
                }
            };
            fetchSearchResults();
        } else {
            setProducts([]); // Nếu không có từ khóa, không hiển thị gì
            setLoading(false);
        }
    }, [keyword]); // Chạy lại khi từ khóa thay đổi


    const pageContainerStyle = {
        maxWidth: '1200px',
        margin: '40px auto',
        padding: '0 20px',
        fontFamily: 'Roboto, sans-serif',
        color: '#333',
    };

    const pageTitleStyle = {
        fontSize: '2.5em',
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: '30px',
        textAlign: 'center',
        position: 'relative',
        paddingBottom: '15px',
    };

    const pageTitleUnderlineStyle = {
        width: '80px',
        height: '4px',
        background: '#28a745',
        margin: '0 auto',
        position: 'absolute',
        bottom: '0',
        left: '50%',
        transform: 'translateX(-50%)',
    };

    return (
        <div style={pageContainerStyle}>
            <h1 style={pageTitleStyle}>
                Kết quả tìm kiếm cho: "{keyword}"
                <div style={pageTitleUnderlineStyle}></div>
            </h1>
            {loading ? (
                <p style={{textAlign: 'center'}}>Đang tìm kiếm...</p>
            ) : error ? (
                <p style={{color: 'red', textAlign: 'center'}}>{error}</p>
            ) : products.length === 0 ? (
                <p style={{textAlign: 'center'}}>Không tìm thấy sản phẩm nào phù hợp với từ khóa "{keyword}".</p>
            ) : (
                <ProductList products={products} />
            )}
        </div>
    );
};

export default SearchPage;
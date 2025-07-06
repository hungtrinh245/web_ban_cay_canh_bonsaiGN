// client/src/pages/SearchPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { searchProducts } from '../services/productService';
import ProductList from '../components/product/ProductList';
import Pagination from '../components/common/Pagination'; 

const SearchPage = ({ onAddToCartSuccess }) => { // Thêm prop onAddToCartSuccess
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get('keyword');
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // States cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const productsPerPage = 8; // Số sản phẩm trên mỗi trang,

    useEffect(() => {
        if (keyword) {
            const fetchSearchResults = async () => {
                try {
                    setLoading(true);
                    const data = await searchProducts(keyword, currentPage, productsPerPage); 
                    setProducts(data.products); 
                    setCurrentPage(data.page);
                    setTotalPages(data.totalPages);
                } catch (err) {
                    console.error("Lỗi khi tìm kiếm:", err);
                    setError('Không thể tải kết quả tìm kiếm.');
                } finally {
                    setLoading(false);
                }
            };
            fetchSearchResults();
        } else {
            setProducts([]); 
            setLoading(false);
            setCurrentPage(1); 
            setTotalPages(1);
        }
    }, [keyword, currentPage, productsPerPage]); 

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0); 
    };

    const pageContainerStyle = {
        maxWidth: '1200px',
        margin: '40px auto',
        padding: '0 20px',
        fontFamily: 'Roboto, sans-serif',
        color: '#333',
    };

    const pageTitleStyle = {
        fontSize: '1.5em',
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
                Kết quả tìm kiếm: "{keyword || ''}"
                <div style={pageTitleUnderlineStyle}></div>
            </h1>
            {loading ? (
                <p style={{textAlign: 'center'}}>Đang tìm kiếm...</p>
            ) : error ? (
                <p style={{color: 'red', textAlign: 'center'}}>{error}</p>
            ) : products.length === 0 ? (
                <p style={{textAlign: 'center'}}>Không tìm thấy sản phẩm nào phù hợp với từ khóa "{keyword}".</p>
            ) : (
                <>
                    <ProductList products={products} onAddToCartSuccess={onAddToCartSuccess} /> {/* TRUYỀN onAddToCartSuccess */}
                    {/* Component phân trang */}
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </div>
    );
};

export default SearchPage;
// client/src/components/common/Pagination.jsx
import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = [...Array(totalPages).keys()].map(i => i + 1); // Tạo mảng các số trang

    const paginationContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '40px',
        marginBottom: '20px',
        gap: '10px',
        fontFamily: 'Arial, sans-serif',
    };

    const pageButtonStyle = {
        padding: '10px 15px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        background: 'white',
        color: '#555',
        cursor: 'pointer',
        fontSize: '1em',
        transition: 'background-color 0.2s, color 0.2s',
        '&:hover': {
            background: '#f0f0f0',
        }
    };

    const activePageButtonStyle = {
        ...pageButtonStyle,
        background: '#28a745',
        color: 'white',
        borderColor: '#28a745',
        fontWeight: 'bold',
        '&:hover': {
            background: '#218838',
        }
    };

    const disabledButtonStyle = {
        ...pageButtonStyle,
        cursor: 'not-allowed',
        opacity: '0.6',
        background: '#f8f8f8',
        color: '#aaa',
    };

    // Helper functions for hover effects
    const applyHover = (e, hoverStyle) => Object.assign(e.currentTarget.style, hoverStyle);
    const removeHover = (e, baseStyle) => Object.assign(e.currentTarget.style, baseStyle);


    if (totalPages <= 1) return null; // Không hiển thị phân trang nếu chỉ có 1 trang

    return (
        <div style={paginationContainerStyle}>
            {/* Nút Previous */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={currentPage === 1 ? disabledButtonStyle : pageButtonStyle}
                onMouseOver={(e) => currentPage !== 1 && applyHover(e, pageButtonStyle['&:hover'])}
                onMouseOut={(e) => currentPage !== 1 && removeHover(e, pageButtonStyle)}
            >
                <FaChevronLeft size={12} />
            </button>

            {/* Các nút số trang */}
            {pages.map(pageNumber => (
                <button
                    key={pageNumber}
                    onClick={() => onPageChange(pageNumber)}
                    style={currentPage === pageNumber ? activePageButtonStyle : pageButtonStyle}
                    onMouseOver={(e) => currentPage !== pageNumber && applyHover(e, pageButtonStyle['&:hover'])}
                    onMouseOut={(e) => currentPage !== pageNumber && removeHover(e, pageButtonStyle)}
                >
                    {pageNumber}
                </button>
            ))}

            {/* Nút Next */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={currentPage === totalPages ? disabledButtonStyle : pageButtonStyle}
                onMouseOver={(e) => currentPage !== totalPages && applyHover(e, pageButtonStyle['&:hover'])}
                onMouseOut={(e) => currentPage !== totalPages && removeHover(e, pageButtonStyle)}
            >
                <FaChevronRight size={12} />
            </button>
        </div>
    );
};

export default Pagination;
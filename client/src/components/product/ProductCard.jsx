import React from 'react';
import { Link } from 'react-router-dom';

// DÒNG BỊ THIẾU LÀ DÒNG NÀY:
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
 // Dòng này sẽ hết báo lỗi sau khi bạn thêm import
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        // Ngăn sự kiện click lan ra thẻ Link, tránh chuyển trang không mong muốn
        e.preventDefault();
        e.stopPropagation();
        
        addToCart(product, 1); // Thêm 1 sản phẩm
        alert(`Đã thêm ${product.name} vào giỏ hàng!`);
    };

    return (
        <div style={{ border: '1px solid #eee', margin: '10px', padding: '15px', width: '220px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            
            <Link to={`/products/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <img
                    src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/200?text=No+Image'}
                    alt={product.name}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
                <h3 style={{ fontSize: '1.1em', margin: '10px 0' }}>{product.name}</h3>
            </Link>

            <p style={{ color: '#d9534f', fontWeight: 'bold', fontSize: '1.2em' }}>
                {product.price ? product.price.toLocaleString('vi-VN') : 'N/A'} VNĐ
            </p>

            {/* Gắn sự kiện onClick cho nút */}
            <button onClick={handleAddToCart} style={{ padding: '8px 15px', cursor: 'pointer', background: '#5cb85c', color: 'white', border: 'none', borderRadius: '4px' }}>
                Thêm vào giỏ
            </button>
        </div>
    );
};

export default ProductCard;

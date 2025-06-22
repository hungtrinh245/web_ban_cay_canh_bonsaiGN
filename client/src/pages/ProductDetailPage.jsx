// client/src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Hook để lấy ID từ URL
import { getProductById } from '../services/productService'; // Service gọi API

const ProductDetailPage = () => {
    const { id } = useParams(); // Lấy 'id' từ URL
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const data = await getProductById(id);
                setProduct(data);
            } catch (err) {
                setError('Không tìm thấy sản phẩm hoặc có lỗi xảy ra.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]); // Effect sẽ chạy lại mỗi khi 'id' trên URL thay đổi

    if (loading) return <p>Đang tải chi tiết sản phẩm...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!product) return <p>Không tìm thấy sản phẩm.</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>{product.name}</h1>
            <img
                src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/400?text=No+Image'}
                alt={product.name}
                style={{ maxWidth: '400px', marginBottom: '20px' }}
            />
<p style={{ fontSize: '1.5em', color: '#d9534f', fontWeight: 'bold' }}>
    {product.price ? product.price.toLocaleString('vi-VN') + ' VNĐ' : 'Giá liên hệ'}
</p>
            <h3>Mô tả sản phẩm</h3>
            <p>{product.description}</p>
            <p><strong>Loại cây:</strong> {product.category}</p>
            <p><strong>Số lượng còn lại:</strong> {product.stockQuantity}</p>
            <button style={{ padding: '10px 20px', fontSize: '1em', cursor: 'pointer', background: '#5cb85c', color: 'white', border: 'none', borderRadius: '4px', marginTop: '20px' }}>
                Thêm vào giỏ hàng
            </button>
        </div>
    );
};

export default ProductDetailPage;
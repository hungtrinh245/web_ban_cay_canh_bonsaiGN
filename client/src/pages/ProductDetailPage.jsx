// client/src/pages/ProductDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../services/productService';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1); // Thêm state cho số lượng

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
    }, [id]);

    const handleQuantityChange = (amount) => {
        setQuantity((prevQuantity) => {
            const newQuantity = prevQuantity + amount;
            if (newQuantity < 1) return 1; // Số lượng không được nhỏ hơn 1
            if (newQuantity > product.stockQuantity) return product.stockQuantity; // Không vượt quá tồn kho
            return newQuantity;
        });
    };

    const handleAddToCart = () => {
        // Logic thêm vào giỏ hàng sẽ được làm ở giai đoạn sau
        console.log(`Đã thêm ${quantity} sản phẩm '${product.name}' vào giỏ hàng.`);
    };

    if (loading) return <p>Đang tải chi tiết sản phẩm...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!product) return <p>Không tìm thấy sản phẩm.</p>;

    // --- Giao diện mới bắt đầu từ đây ---
    return (
        <div style={{ display: 'flex', gap: '50px', padding: '20px', fontFamily: 'Arial, sans-serif' }}>

            {/* CỘT BÊN TRÁI: HÌNH ẢNH */}
            <div style={{ flex: 1 }}>
                <img
                    src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/500?text=No+Image'}
                    alt={product.name}
                    style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                />
                {/* Bạn có thể thêm một bộ sưu tập ảnh nhỏ ở đây nếu muốn */}
            </div>

            {/* CỘT BÊN PHẢI: THÔNG TIN */}
            <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '2.5em', margin: '0 0 10px 0' }}>{product.name}</h1>
                
                <p style={{ fontSize: '2em', color: '#28a745', fontWeight: 'bold', margin: '20px 0', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
                    {product.price ? product.price.toLocaleString('vi-VN') + ' VNĐ' : 'Giá liên hệ'}
                </p>

                <p style={{ lineHeight: '1.6', color: '#555' }}>
                    {product.description}
                </p>
                
                {/* PHẦN CHỌN SỐ LƯỢNG VÀ THÊM VÀO GIỎ */}
                <div style={{ display: 'flex', alignItems: 'center', margin: '30px 0' }}>
                    <div style={{ display: 'flex', border: '1px solid #ccc', borderRadius: '5px' }}>
                        <button onClick={() => handleQuantityChange(-1)} style={{ padding: '10px 15px', border: 'none', background: '#f4f4f4', cursor: 'pointer', fontSize: '1.2em' }}>-</button>
                        <input 
                            type="number" 
                            value={quantity} 
                            readOnly 
                            style={{ width: '50px', textAlign: 'center', border: 'none', fontSize: '1.1em' }} 
                        />
                        <button onClick={() => handleQuantityChange(1)} style={{ padding: '10px 15px', border: 'none', background: '#f4f4f4', cursor: 'pointer', fontSize: '1.2em' }}>+</button>
                    </div>

                    <button 
                        onClick={handleAddToCart} 
                        style={{ padding: '12px 25px', fontSize: '1em', cursor: 'pointer', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', marginLeft: '20px', fontWeight: 'bold' }}>
                        THÊM VÀO GIỎ HÀNG
                    </button>
                </div>
                
                <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
                     <p><strong>Loại cây: </strong> <span>{product.category}</span></p>
                     <p><strong>Tồn kho: </strong> <span>{product.stockQuantity} sản phẩm</span></p>
                     <p><strong>SKU: </strong> <span>{product._id.slice(-6).toUpperCase()}</span></p>
                     {/* Bạn có thể thêm các thông tin khác như ở ảnh ví dụ */}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
// client/src/pages/ProductDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById, getRelatedProducts } from '../services/productService';
import ProductList from '../components/product/ProductList';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1); // Thêm state cho số lượng
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                const productData = await getProductById(id);
                setProduct(productData);

                const relatedData = await getRelatedProducts(id);
                setRelatedProducts(relatedData);
            } catch (err) {
                setError('Không tìm thấy sản phẩm hoặc có lỗi xảy ra.');
            } finally {
                setLoading(false);
            }
        };

        // Scroll lên đầu trang khi chuyển sản phẩm
        window.scrollTo(0, 0);
        fetchAllData();
    }, [id]);

    const handleQuantityChange = (amount) => {
        setQuantity((prevQuantity) => {
            if (!product) return 1;
            const newQuantity = prevQuantity + amount;
            if (newQuantity < 1) return 1;
            if (newQuantity > product.stockQuantity) return product.stockQuantity;
            return newQuantity;
        });
    };

    const handleAddToCart = () => {
        // Logic thêm vào giỏ hàng sẽ được làm ở giai đoạn sau
        console.log(`Đã thêm ${quantity} sản phẩm '${product.name}' vào giỏ hàng.`);
        alert(`Đã thêm ${quantity} x ${product.name} vào giỏ hàng!`);
    };

    if (loading) return <p style={{ textAlign: 'center', padding: '50px' }}>Đang tải chi tiết sản phẩm...</p>;
    if (error) return <p style={{ color: 'red', textAlign: 'center', padding: '50px' }}>{error}</p>;
    if (!product) return <p style={{ textAlign: 'center', padding: '50px' }}>Không tìm thấy sản phẩm.</p>;

    // --- GIAO DIỆN ĐẦY ĐỦ ---
    return (
        <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '50px', padding: '20px', fontFamily: 'Arial, sans-serif' }}>

                {/* CỘT BÊN TRÁI: HÌNH ẢNH */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <img
                        src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/500?text=No+Image'}
                        alt={product.name}
                        style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                    />
                </div>

                {/* CỘT BÊN PHẢI: THÔNG TIN */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <h1 style={{ fontSize: '2.5em', margin: '0 0 10px 0' }}>{product.name}</h1>
                    
                    <p style={{ fontSize: '2em', color: '#28a745', fontWeight: 'bold', margin: '20px 0', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
                        {product.price ? product.price.toLocaleString('vi-VN') + ' VNĐ' : 'Giá liên hệ'}
                    </p>

                    <p style={{ lineHeight: '1.6', color: '#555' }}>
                        {product.description}
                    </p>
                    
                    {/* PHẦN CHỌN SỐ LƯỢNG VÀ THÊM VÀO GIỎ */}
                    <div style={{ display: 'flex', alignItems: 'center', margin: '30px 0', flexWrap: 'wrap', gap: '20px' }}>
                        <div style={{ display: 'flex', border: '1px solid #ccc', borderRadius: '5px' }}>
                            <button onClick={() => handleQuantityChange(-1)} style={{ padding: '10px 15px', border: 'none', background: '#f4f4f4', cursor: 'pointer', fontSize: '1.2em' }}>-</button>
                            <input
                                type="text"
                                value={quantity}
                                readOnly
                                style={{ width: '50px', textAlign: 'center', border: 'none', borderLeft: '1px solid #ccc', borderRight: '1px solid #ccc', fontSize: '1.1em' }}
                            />
                            <button onClick={() => handleQuantityChange(1)} style={{ padding: '10px 15px', border: 'none', background: '#f4f4f4', cursor: 'pointer', fontSize: '1.2em' }}>+</button>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            style={{ padding: '12px 25px', fontSize: '1em', cursor: 'pointer', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                    
                    <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', color: '#777' }}>
                         <p><strong>SKU: </strong> <span>{product._id.slice(-6).toUpperCase()}</span></p>
                         <p><strong>Loại cây: </strong> <span>{product.category}</span></p>
                         <p><strong>Tồn kho: </strong> <span>{product.stockQuantity} sản phẩm</span></p>
                    </div>
                </div>
            </div>

            {/* PHẦN SẢN PHẨM LIÊN QUAN */}
            <div style={{ marginTop: '60px', padding: '20px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px', fontWeight: 'normal', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>SẢN PHẨM LIÊN QUAN</h2>
                {relatedProducts.length > 0 ? (
                    <ProductList products={relatedProducts} />
                ) : (
                    <p style={{ textAlign: 'center' }}>Không có sản phẩm liên quan nào.</p>
                )}
            </div>
        </>
    );
};

export default ProductDetailPage;
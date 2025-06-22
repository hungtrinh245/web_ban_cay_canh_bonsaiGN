

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById, getRelatedProducts } from '../services/productService';
import ProductList from '../components/product/ProductList'; // Import component ProductList đã có

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    

    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        // Hàm để lấy cả dữ liệu sản phẩm chính và sản phẩm liên quan
        const fetchAllData = async () => {
            try {
                setLoading(true);
                // Lấy dữ liệu sản phẩm chính
                const productData = await getProductById(id);
                setProduct(productData);

                // Lấy dữ liệu sản phẩm liên quan
                const relatedData = await getRelatedProducts(id);
                setRelatedProducts(relatedData);

            } catch (err) {
                setError('Không tìm thấy sản phẩm hoặc có lỗi xảy ra.');
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [id]); // Chạy lại mỗi khi 'id' trên URL thay đổi

    // ... các hàm handleQuantityChange, handleAddToCart không đổi ...
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
        console.log(`Đã thêm ${quantity} sản phẩm '${product.name}' vào giỏ hàng.`);
    };


    if (loading) return <p>Đang tải chi tiết sản phẩm...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!product) return <p>Không tìm thấy sản phẩm.</p>;

    return (
       
        <>
            <div style={{ display: 'flex', gap: '50px', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                <div style={{ flex: 1 }}>
                    <img
                        src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/500?text=No+Image'}
                        alt={product.name}
                        style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                    />
                </div>


                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '2.5em', margin: '0 0 10px 0' }}>{product.name}</h1>
                    <p style={{ fontSize: '2em', color: '#28a745', fontWeight: 'bold', margin: '20px 0', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
                        {product.price ? product.price.toLocaleString('vi-VN') + ' VNĐ' : 'Giá liên hệ'}
                    </p>
                    <p style={{ lineHeight: '1.6', color: '#555' }}>
                        {product.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', margin: '30px 0' }}>
                       
                    </div>
                    <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
       
                    </div>
                </div>
            </div>

            {/*  SẢN PHẨM LIÊN QUAN */}
            <div style={{ marginTop: '60px', padding: '20px', borderTop: '1px solid #eee' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>SẢN PHẨM LIÊN QUAN</h2>
                {relatedProducts.length > 0 ? (
                    // Tái sử dụng component ProductList để hiển thị
                    <ProductList products={relatedProducts} />
                ) : (
                    <p style={{ textAlign: 'center' }}>Không có sản phẩm liên quan nào.</p>
                )}
            </div>
        </>
    );
};

export default ProductDetailPage;
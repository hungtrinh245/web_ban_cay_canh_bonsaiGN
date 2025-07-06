// client/src/pages/ProductDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import { getProductById, getRelatedProducts, createProductReview } from '../services/productService'; 
import ProductList from '../components/product/ProductList';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; 

const ProductDetailPage = ({ onAddToCartSuccess }) => {
    const { id } = useParams();
    const { user, isAuthenticated, token } = useAuth(); 
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState([]);

    const [rating, setRating] = useState(0); 
    const [comment, setComment] = useState(''); 
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState('');
    const [reviewSuccess, setReviewSuccess] = useState('');

    const fetchProductData = async () => {
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

    useEffect(() => {
        fetchProductData();
        window.scrollTo(0, 0);
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
        if (product) {
            addToCart(product, quantity);
            if (onAddToCartSuccess) {
                onAddToCartSuccess();
            }
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setReviewLoading(true);
        setReviewError('');
        setReviewSuccess('');

        if (!rating || !comment) {
            setReviewError('Vui lòng chọn số sao và nhập bình luận.');
            setReviewLoading(false);
            return;
        }

        try {
            const reviewData = { rating, comment };
            await createProductReview(id, reviewData, token);
            setReviewSuccess('Đánh giá của bạn đã được gửi thành công!');
            setRating(0); 
            setComment('');
            fetchProductData(); 
        } catch (err) {
            setReviewError(err.message || 'Gửi đánh giá thất bại. Vui lòng thử lại.');
        } finally {
            setReviewLoading(false);
        }
    };

    // Style cho phần Rating (sao)
    const starRatingStyle = {
        color: '#ffc107', 
        cursor: 'pointer',
        fontSize: '1.5em',
    };

    const reviewFormStyle = {
        background: '#f8f9fa',
        padding: '25px',
        borderRadius: '8px',
        marginBottom: '40px',
        border: '1px solid #eee',
    };

    const reviewInputStyle = {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        marginBottom: '15px',
        fontSize: '1em',
        boxSizing: 'border-box',
    };

    const reviewSubmitButtonStyle = {
        padding: '10px 20px',
        background: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1em',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease, transform 0.2s',
        '&:hover': {
            backgroundColor: '#218838',
            transform: 'translateY(-2px)',
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
    };

    const reviewMessageStyle = {
        textAlign: 'center',
        padding: '8px',
        borderRadius: '5px',
        fontSize: '0.9em',
        fontWeight: 'bold',
        marginTop: '10px',
    };

    const reviewSuccessStyle = {
        ...reviewMessageStyle,
        background: '#d4edda',
        color: '#155724',
    };

    const reviewErrorStyle = {
        ...reviewMessageStyle,
        background: '#f8d7da',
        color: '#721c24',
    };
    
    const reviewItemStyle = {
        borderBottom: '1px solid #eee',
        paddingBottom: '15px',
        marginBottom: '15px',
    };

    const reviewHeaderStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '5px',
    };

    const reviewAuthorDateStyle = {
        fontSize: '0.9em',
        color: '#777',
    };

    const reviewRatingDisplay = (num) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} style={{ color: i <= num ? '#ffc107' : '#e4e5e9' }}>
                    ★
                </span>
            );
        }
        return <div style={{ display: 'inline-block' }}>{stars}</div>;
    };

    // Helper functions for hover effects
    const applyHover = (e, hoverStyle) => Object.assign(e.currentTarget.style, hoverStyle);
    const removeHover = (e, baseStyle) => Object.assign(e.currentTarget.style, baseStyle);


    if (loading) return <p style={{ textAlign: 'center', padding: '50px' }}>Đang tải chi tiết sản phẩm...</p>;
    if (error) return <p style={{ color: 'red', textAlign: 'center', padding: '50px' }}>{error}</p>;
    if (!product) return <p style={{ textAlign: 'center', padding: '50px' }}>Không tìm thấy sản phẩm.</p>;

    return (
        <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '50px', padding: '20px', fontFamily: 'Arial, sans-serif' }}>

                <div style={{ flex: 1, minWidth: '300px' }}>
                    <img
                        src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/500?text=No+Image'}
                        alt={product.name}
                        style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                    />
                </div>

                <div style={{ flex: 1, minWidth: '300px' }}>
                    <h1 style={{ fontSize: '2.5em', margin: '0 0 10px 0' }}>{product.name}</h1>
                    
                    {/* HIỂN THỊ ĐÁNH GIÁ VÀ SỐ LƯỢT ĐÁNH GIÁ */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', gap: '10px' }}>
                        {reviewRatingDisplay(product.rating)}
                        <span style={{ fontSize: '0.9em', color: '#777' }}>
                            ({product.numReviews} lượt đánh giá)
                        </span>
                    </div>

                    <p style={{ fontSize: '2em', color: '#28a745', fontWeight: 'bold', margin: '20px 0', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
                        {product.price ? product.price.toLocaleString('vi-VN') + ' VNĐ' : 'Giá liên hệ'}
                    </p>

                    <p style={{ lineHeight: '1.6', color: '#555' }}>
                        {product.description}
                    </p>
                    
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

            {/* PHẦN ĐÁNH GIÁ SẢN PHẨM */}
            <div style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px', fontWeight: 'normal', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>ĐÁNH GIÁ & BÌNH LUẬN</h2>

                {/* FORM ĐÁNH GIÁ */}
                <div style={reviewFormStyle}>
                    <h3 style={{fontSize: '1.3em', marginBottom: '15px', color: '#2c3e50'}}>Gửi đánh giá của bạn</h3>
                    {isAuthenticated ? (
                        <form onSubmit={handleSubmitReview}>
                            {reviewError && <p style={reviewErrorStyle}>{reviewError}</p>}
                            {reviewSuccess && <p style={reviewSuccessStyle}>{reviewSuccess}</p>}
                            <div style={{ marginBottom: '15px' }}>
                                {/* <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Số sao:</label> */}
                                <div>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span 
                                            key={star} 
                                            onClick={() => setRating(star)} 
                                            style={{...starRatingStyle, cursor: 'pointer'}}
                                        >
                                            {star <= rating ? '★' : '☆'}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label htmlFor="comment" style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Bình luận:</label>
                                <textarea
                                    id="comment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    style={{...reviewInputStyle, minHeight: '80px'}}
                                    placeholder="Viết bình luận của bạn tại đây..."
                                    required
                                ></textarea>
                            </div>
                            <button 
                                type="submit" 
                                style={reviewSubmitButtonStyle}
                                onMouseOver={(e) => applyHover(e, reviewSubmitButtonStyle['&:hover'])}
                                onMouseOut={(e) => removeHover(e, reviewSubmitButtonStyle)}
                                disabled={reviewLoading}
                            >
                                {reviewLoading ? 'Đang gửi...' : 'GỬI ĐÁNH GIÁ'}
                            </button>
                        </form>
                    ) : (
                        <p style={{textAlign: 'center', color: '#777'}}>Vui lòng <Link to="/login">đăng nhập</Link> để gửi đánh giá.</p>
                    )}
                </div>

                {/* DANH SÁCH CÁC ĐÁNH GIÁ */}
                <h3 style={{fontSize: '1.5em', marginBottom: '25px', color: '#2c3e50', textAlign: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>
                    Tất cả đánh giá ({product.reviews.length})
                </h3>
                {product.reviews.length === 0 ? (
                    <p style={{textAlign: 'center', color: '#777'}}>Chưa có đánh giá nào cho sản phẩm này.</p>
                ) : (
                    <div>
                        {product.reviews.map((review, index) => (
                            <div key={review._id || index} style={reviewItemStyle}>
                                <div style={reviewHeaderStyle}>
                                    <strong style={{color: '#333'}}>{review.name}</strong>
                                    {reviewRatingDisplay(review.rating)}
                                </div>
                                <p style={reviewAuthorDateStyle}>
                                    Ngày: {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                </p>
                                <p style={{color: '#555'}}>{review.comment}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

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
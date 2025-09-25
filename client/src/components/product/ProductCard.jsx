// client/src/components/product/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Typography, Rate, Space, Badge, Image } from 'antd';
import { ShoppingCartOutlined, EyeOutlined, HeartOutlined } from '@ant-design/icons';
import { useCart } from '../../context/CartContext';

const { Meta } = Card;
const { Text, Title } = Typography;

const ProductCard = ({ product, onAddToCartSuccess }) => { // Thêm prop onAddToCartSuccess
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        addToCart(product, 1); // Thêm 1 sản phẩm

        if (onAddToCartSuccess) {
            onAddToCartSuccess(); // Gọi callback 
        }
    };

    const isOutOfStock = product.stockQuantity === 0;
    const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;

    return (
        <Card
            hoverable
            style={{
                width: 280,
                margin: '12px',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
            }}
            cover={
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <Link to={`/products/${product._id}`}>
                        <Image
                    alt={product.name}
                            src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/280x200?text=No+Image'}
                            style={{
                                width: '100%',
                                height: '200px',
                                objectFit: 'cover',
                                transition: 'transform 0.3s ease'
                            }}
                            preview={false}
                        />
            </Link>

                    {/* Badges */}
                    <div style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 2 }}>
                        {product.isFeatured && (
                            <div style={{
                                background: '#ff4d4f',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: '500',
                                marginBottom: '8px',
                                display: 'inline-block'
                            }}>
                                Nổi bật
                            </div>
                        )}
                        {isLowStock && !isOutOfStock && (
                            <div style={{
                                background: '#faad14',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: '500',
                                marginTop: product.isFeatured ? '8px' : '0',
                                display: 'inline-block'
                            }}>
                                Sắp hết
                            </div>
                        )}
                        {isOutOfStock && (
                            <div style={{
                                background: '#ff4d4f',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: '500',
                                marginTop: product.isFeatured ? '8px' : '0',
                                display: 'inline-block'
                            }}>
                                Hết hàng
                            </div>
                        )}
                    </div>

                    {/* Quick actions */}
                    <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        opacity: 0,
                        transition: 'opacity 0.3s ease'
                    }} className="quick-actions">
                        <Button
                            shape="circle"
                            icon={<HeartOutlined />}
                            style={{
                                background: 'rgba(255, 255, 255, 0.9)',
                                border: 'none',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                        />
                        <Link to={`/products/${product._id}`}>
                            <Button
                                shape="circle"
                                icon={<EyeOutlined />}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    border: 'none',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}
                            />
                        </Link>
                    </div>
                </div>
            }
            actions={[
                <Button
                    key="add-to-cart"
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    style={{
                        width: '90%',
                        height: '40px',
                        borderRadius: '20px',
                        fontWeight: '500'
                    }}
                >
                    {isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
                </Button>
            ]}
        >
            <Meta
                title={
                    <Link
                        to={`/products/${product._id}`}
                        style={{
                            textDecoration: 'none',
                            color: 'inherit',
                            display: 'block'
                        }}
                    >
                        <Title
                            level={5}
                            ellipsis={{ rows: 2 }}
                            style={{
                                margin: 0,
                                fontSize: '16px',
                                fontWeight: '600',
                                lineHeight: '1.4'
                            }}
                        >
                            {product.name}
                        </Title>
                    </Link>
                }
                description={
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        {/* Rating */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Rate
                                disabled
                                value={product.rating || 0}
                                style={{ fontSize: '14px' }}
                            />
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                ({product.numReviews || 0} đánh giá)
                            </Text>
                        </div>

                        {/* Price */}
                        <div style={{ marginTop: '8px' }}>
                            <Title
                                level={4}
                                style={{
                                    margin: 0,
                                    color: '#ff4d4f',
                                    fontSize: '18px',
                                    fontWeight: '700'
                                }}
                            >
                {product.price ? product.price.toLocaleString('vi-VN') : 'N/A'} VNĐ
                            </Title>
                        </div>

                        {/* Stock info */}
                        <Text
                            type="secondary"
                            style={{ fontSize: '12px' }}
                        >
                            Còn lại: {product.stockQuantity || 0} sản phẩm
                        </Text>
                    </Space>
                }
            />

            <style jsx="true">{`
                .ant-card:hover .quick-actions {
                    opacity: 1 !important;
                }
                
                .ant-card:hover .ant-image img {
                    transform: scale(1.05);
                }
            `}</style>
        </Card>
    );
};

export default ProductCard;
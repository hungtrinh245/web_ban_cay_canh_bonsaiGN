// client/src/components/layout/MiniCart.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
    Card,
    Button,
    Space,
    Typography,
    Divider,
    Empty,
    Image,
    List,
    Badge
} from 'antd';
import {
    CloseOutlined,
    ShoppingCartOutlined,
    CreditCardOutlined,
    DeleteOutlined
} from '@ant-design/icons';

const { Text, Title } = Typography;

// Props: cartItems, subtotal, onClose (hàm để đóng mini-cart)
const MiniCart = ({ cartItems, subtotal, onClose }) => {
    // Safety check: ensure cartItems is always an array
    const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

    return (
        <Card
            styles={{
                body: {
                    padding: '0'
                }
            }}
            style={{
                position: 'absolute',
                top: '60px',
                right: '20px',
                width: '380px',
                maxHeight: '500px',
                zIndex: 1000,
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                border: '1px solid #f0f0f0',
                overflow: 'hidden'
            }}

        >
            {/* Header */}
            <div style={{
                padding: '20px 24px 16px',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                borderBottom: '1px solid #f0f0f0'
            }}>
                <div style={{
        display: 'flex',
        justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Space>
                        <ShoppingCartOutlined style={{
                            fontSize: '18px',
                            color: '#2F6A37'
                        }} />
                        <Title level={5} style={{
                            margin: 0,
                            color: '#2F6A37',
                            fontWeight: '600'
                        }}>
                            Giỏ hàng của bạn
                        </Title>
                        <Badge
                            count={safeCartItems.length}
                            style={{
                                backgroundColor: '#2F6A37',
                                boxShadow: 'none'
                            }}
                        />
                    </Space>
                    <Button
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={onClose}
                        style={{
        border: 'none',
                            color: '#8c8c8c'
                        }}
                        size="small"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="mini-cart-scroll" style={{ maxHeight: '320px', overflowY: 'auto' }}>
            {safeCartItems.length === 0 ? (
                    <div style={{ padding: '40px 24px', textAlign: 'center' }}>
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <Text type="secondary">
                                    Giỏ hàng của bạn đang trống
                                </Text>
                            }
                        />
                        <Link to="/shop" onClick={onClose}>
                            <Button
                                type="primary"
                                style={{
                                    marginTop: '16px',
                                    background: 'linear-gradient(135deg, #2F6A37, #52c41a)',
                                    border: 'none',
                                    borderRadius: '6px'
                                }}
                            >
                                Mua sắm ngay
                            </Button>
                        </Link>
            </div>
                ) : (
                    <>
                        <List
                            dataSource={safeCartItems}
                            renderItem={(item) => (
                                <List.Item
                                    style={{
                                        padding: '16px 24px',
                                        borderBottom: '1px solid #f5f5f5'
                                    }}
                                    actions={[
                                        <Button
                                            key="remove"
                                            type="text"
                                            icon={<DeleteOutlined />}
                                            size="small"
                                            style={{ color: '#ff4d4f' }}
                                        // onClick={() => removeFromCart(item)}
                                        />
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <Image
                                                src={item.images && item.images.length > 0
                                                    ? item.images[0]
                                                    : 'https://via.placeholder.com/60?text=No+Image'
                                                }
                                                alt={item.name}
                                                width={60}
                                                height={60}
                                                style={{
                                                    borderRadius: '8px',
                                                    objectFit: 'cover'
                                                }}
                                                preview={false}
                                            />
                                        }
                                        title={
                                            <Text
                                                style={{
                                                    fontSize: '14px',
                                                    fontWeight: '500',
                                                    color: '#262626'
                                                }}
                                                ellipsis={{ tooltip: item.name }}
                                            >
                                                {item.name}
                                            </Text>
                                        }
                                        description={
                                            <Space direction="vertical" size={2}>
                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                    Số lượng: {item.qty}
                                                </Text>
                                                <Text style={{
                                                    color: '#2F6A37',
                                                    fontWeight: '600',
                                                    fontSize: '14px'
                                                }}>
                                                    {(item.price * item.qty).toLocaleString('vi-VN')} VNĐ
                                                </Text>
                                            </Space>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </>
                )}
                    </div>

            {/* Footer với tổng cộng và buttons */}
            {cartItems.length > 0 && (
                <div style={{
                    borderTop: '1px solid #f0f0f0',
                    background: '#fafafa'
                }}>
                    {/* Tổng cộng */}
                    <div style={{
                        padding: '16px 24px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: '#fff',
                        borderBottom: '1px solid #f0f0f0'
                    }}>
                        <Text style={{ fontSize: '16px', fontWeight: '500' }}>
                            Tổng cộng:
                        </Text>
                        <Text style={{
                            fontSize: '18px',
                            fontWeight: '700',
                            color: '#2F6A37'
                        }}>
                            {subtotal.toLocaleString('vi-VN')} VNĐ
                        </Text>
                    </div>

                    {/* Action buttons */}
                    <div style={{ padding: '16px 24px' }}>
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Link to="/cart" onClick={onClose} style={{ width: '100%' }}>
                                <Button
                                    block
                                    size="large"
                                    icon={<ShoppingCartOutlined />}
                                    style={{
                                        height: '44px',
                                        border: '1px solid #2F6A37',
                                        color: '#2F6A37',
                                        fontWeight: '500',
                                        borderRadius: '8px'
                                    }}
                                >
                                    Xem giỏ hàng
                                </Button>
                        </Link>
                            <Link to="/checkout" onClick={onClose} style={{ width: '100%' }}>
                                <Button
                                    type="primary"
                                    block
                                    size="large"
                                    icon={<CreditCardOutlined />}
                                    className="cart-button-hover"
                                    style={{
                                        height: '44px',
                                        background: 'linear-gradient(135deg, #2F6A37, #52c41a)',
                                        border: 'none',
                                        fontWeight: '600',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(47, 106, 55, 0.3)',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Thanh toán ngay
                                </Button>
                        </Link>
                        </Space>
                    </div>
                    </div>
            )}
        </Card>
    );
};

export default MiniCart;
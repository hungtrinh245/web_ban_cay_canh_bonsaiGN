import React, { useState } from 'react';
import { Outlet, Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Input, Badge, Avatar, Dropdown, Space, Button } from 'antd';
import {
    ShoppingCartOutlined,
    UserOutlined,
    HomeOutlined,
    ShopOutlined,
    InfoCircleOutlined,
    PhoneOutlined,
    FileTextOutlined,
    SearchOutlined,
    LogoutOutlined,
    LoginOutlined,
    UserAddOutlined
} from '@ant-design/icons';
import Newsletter from '../components/layout/Newsletter';
import Footer from '../components/layout/Footer';
import MiniCart from '../components/layout/MiniCart';

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const { Header, Content } = Layout;
const { Search } = Input;

const ClientLayout = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const { cartItems } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const [searchTerm, setSearchTerm] = useState('');
    const [showMiniCart, setShowMiniCart] = useState(false);

    // Safety check: ensure cartItems is always an array
    const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
    const totalCartItems = safeCartItems.reduce((sum, item) => sum + item.qty, 0);
    const miniCartSubtotal = safeCartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleCloseMiniCart = () => {
        setShowMiniCart(false);
    };

    const handleAddToCartSuccess = () => { // Hàm này cần được truyền xuống các ProductCard/ProductDetailPage
        setShowMiniCart(true);
    };

    const handleSearch = (value) => {
        if (value.trim()) {
            // Dùng tham số 'keyword' để tương thích với SearchPage
            navigate(`/search?keyword=${encodeURIComponent(value.trim())}`);
        }
    };

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Thông tin cá nhân',
            onClick: () => navigate('/profile')
        },
        {
            type: 'divider'
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Đăng xuất',
            onClick: handleLogout
        }
    ];

    const guestMenuItems = [
        {
            key: 'login',
            icon: <LoginOutlined />,
            label: 'Đăng nhập',
            onClick: () => navigate('/login')
        },
        {
            key: 'register',
            icon: <UserAddOutlined />,
            label: 'Đăng ký',
            onClick: () => navigate('/register')
        }
    ];

    const menuItems = [
        {
            key: '/',
            icon: <HomeOutlined />,
            label: 'Trang chủ'
        },
        {
            key: '/shop',
            icon: <ShopOutlined />,
            label: 'Cửa hàng'
        },
        {
            key: '/about',
            icon: <InfoCircleOutlined />,
            label: 'Giới thiệu'
        },
        {
            key: '/contact',
            icon: <PhoneOutlined />,
            label: 'Liên hệ'
        },
        {
            key: '/blog',
            icon: <FileTextOutlined />,
            label: 'Tin tức'
        }
    ];

    // Lấy key hiện tại từ location
    const getCurrentMenuKey = () => {
        const path = location.pathname;
        if (path === '/' || path === '/home') return '/';
        if (path.startsWith('/shop')) return '/shop';
        if (path.startsWith('/blog')) return '/blog';
        if (path === '/about') return '/about';
        if (path === '/contact') return '/contact';
        return path;
    };


    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Header với logo, search và user actions */}
            <Header style={{
                height: '80px',
                padding: '0 24px',
                background: 'linear-gradient(135deg, #2F6A37 0%, #52c41a 100%)',
                boxShadow: '0 4px 20px rgba(47, 106, 55, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                zIndex: 1000
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Link to="/" style={{
                        display: 'flex',
                        alignItems: 'center',
                        textDecoration: 'none',
                        color: 'white'
                    }}>
                        <div style={{
                            fontSize: '28px',
                            marginRight: '8px',
                            background: 'linear-gradient(45deg, #fff, #e6f7ff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.1))'
                        }}>
                            🌿
                        </div>
                        <span style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #fff, #e6f7ff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.1))'
                        }}>
                            BonsaiGN
                        </span>
                    </Link>
                </div>

                {/* Search Bar */}
                <div style={{ flex: 1, maxWidth: '500px', margin: '0 24px' }}>
                    <Search
                        placeholder="Tìm kiếm cây cảnh, bonsai..."
                        size="large"
                        enterButton={
                            <Button
                                type="primary"
                                style={{
                                    background: 'linear-gradient(135deg, #1890ff, #096dd9)',
                                    border: 'none',
                                    height: '40px'
                                }}
                            >
                                <SearchOutlined />
                            </Button>
                        }
                        onSearch={handleSearch}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            '& .ant-input': {
                                borderRadius: '8px 0 0 8px'
                            },
                            '& .ant-btn': {
                                borderRadius: '0 8px 8px 0'
                            }
                        }}
                    />
                </div>

                {/* User Actions */}
                <Space size="large" style={{ alignItems: 'center' }}>
                    {/* Shopping Cart */}
                    <div style={{ position: 'relative' }}>
                        <Button
                            type="text"
                            icon={<ShoppingCartOutlined style={{ fontSize: '20px' }} />}
                            size="large"
                            onClick={() => setShowMiniCart(!showMiniCart)}
                            style={{
                                color: 'white',
                                height: '48px',
                                padding: '0 16px',
                                fontSize: '16px',
                                fontWeight: '600',
                                border: 'none',
                                borderRadius: '8px',
                                background: 'transparent',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(255,255,255,0.2)';
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 6px 20px rgba(255,255,255,0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            Giỏ hàng {totalCartItems > 0 && (
                                <Badge
                                    count={totalCartItems}
                                    size="small"
                                    style={{
                                        marginLeft: '8px',
                                        backgroundColor: '#ff4d4f',
                                        boxShadow: '0 2px 8px rgba(255, 77, 79, 0.3)'
                                    }}
                                />
                            )}
                        </Button>

                        {/* Mini Cart */}
                        {showMiniCart && (
                            <MiniCart
                                cartItems={safeCartItems}
                                subtotal={miniCartSubtotal}
                                onClose={handleCloseMiniCart}
                            />
                        )}
                    </div>

                    {/* User Menu */}
                    <Dropdown
                        menu={{ items: isAuthenticated ? userMenuItems : guestMenuItems }}
                        placement="bottomRight"
                        trigger={['click']}
                        arrow
                    >
                        <Button
                            type="text"
                            size="large"
                            style={{
                                color: 'white',
                                height: '48px',
                                padding: '0 16px',
                                fontSize: '16px',
                                fontWeight: '600',
                                border: 'none',
                                borderRadius: '8px',
                                background: 'transparent',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(255,255,255,0.2)';
                                e.target.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.transform = 'translateY(0)';
                            }}
                        >
                            <Space>
                                <Avatar
                                    size={32}
                                    icon={<UserOutlined />}
                                    style={{ backgroundColor: '#1890ff' }}
                                />
                                {isAuthenticated ? user?.name : 'Tài khoản'}
                            </Space>
                        </Button>
                    </Dropdown>
                </Space>
            </Header>

            {/* Navigation Menu */}
            <div style={{
                background: 'linear-gradient(135deg, #237804 0%, #389e0d 100%)',
                display: 'flex',
                justifyContent: 'center',
                padding: '0 24px'
            }}>
                <Menu
                    mode="horizontal"
                    selectedKeys={[getCurrentMenuKey()]}
                    items={menuItems}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        height: '48px',
                        lineHeight: '48px',
                        fontSize: '16px',
                        fontWeight: '500',
                        minWidth: 'auto'
                    }}
                    theme="dark"
                    onClick={({ key }) => navigate(key)}
                />
            </div>

            {/* Main Content */}
            <Content style={{
                minHeight: 'calc(100vh - 128px)',
                background: '#fff'
            }}>
                <Outlet />
            </Content>

            {/* Footer components */}
            <Newsletter />
            <Footer />
        </Layout>
    );
};

export default ClientLayout;
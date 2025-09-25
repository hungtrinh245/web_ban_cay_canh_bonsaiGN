
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    Layout,
    Menu,
    Button,
    Avatar,
    Space,
    Typography,
    Breadcrumb,
    theme
} from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DashboardOutlined,
    ShopOutlined,
    ShoppingOutlined,
    UserOutlined,
    TagOutlined,
    FileTextOutlined,
    SettingOutlined,
    LogoutOutlined,
    HomeOutlined,
    InboxOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const AdminLayout = () => {
    const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    // Bảo vệ route: Chỉ admin mới được vào. Nếu không phải admin, chuyển hướng.
    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated || (user && user.role !== 'admin')) {
                alert('Bạn không có quyền truy cập trang quản trị!');
                logout();
                navigate('/admin/login');
            }
        }
    }, [isAuthenticated, user, authLoading, navigate, logout]);

    // Menu items cho sidebar
    const menuItems = [
        {
            key: '/admin',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: '/admin/products',
            icon: <ShopOutlined />,
            label: 'Quản lý Sản phẩm',
        },
        {
            key: '/admin/orders',
            icon: <ShoppingOutlined />,
            label: 'Quản lý Đơn hàng',
        },
        {
            key: '/admin/users',
            icon: <UserOutlined />,
            label: 'Quản lý Người dùng',
        },
        {
            key: '/admin/coupons',
            icon: <TagOutlined />,
            label: 'Quản lý Mã ưu đãi',
        },
        {
            key: '/admin/posts',
            icon: <FileTextOutlined />,
            label: 'Quản lý Bài viết',
        },
        {
            key: '/admin/inventory',
            icon: <InboxOutlined />,
            label: 'Quản lý Tồn Kho',
        },
        {
            key: '/admin/categories',
            icon: <TagOutlined />,
            label: 'Quản lý Danh Mục',
        },
        {
            key: '/admin/settings',
            icon: <SettingOutlined />,
            label: 'Cài đặt',
        },
    ];

    // Lấy key hiện tại
    const getCurrentKey = () => {
        return location.pathname;
    };

    // Lấy page title dựa trên pathname
    const getPageTitle = () => {
        const titles = {
            '/admin': 'Dashboard',
            '/admin/products': 'Quản lý Sản phẩm',
            '/admin/orders': 'Quản lý Đơn hàng',
            '/admin/users': 'Quản lý Người dùng',
            '/admin/coupons': 'Quản lý Mã ưu đãi',
            '/admin/posts': 'Quản lý Bài viết',
            '/admin/inventory': 'Quản lý Tồn Kho',
            '/admin/settings': 'Cài đặt',
        };
        return titles[location.pathname] || 'Admin Panel';
    };

    // Breadcrumb items
    const getBreadcrumbItems = () => {
        const pathnames = location.pathname.split('/').filter((x) => x);
        const breadcrumbItems = [
            {
                title: <HomeOutlined />,
                href: '/admin',
            }
        ];

        pathnames.forEach((name, index) => {
            if (name !== 'admin') {
                const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;

                breadcrumbItems.push({
                    title: name.charAt(0).toUpperCase() + name.slice(1),
                    href: isLast ? undefined : routeTo,
                });
            }
        });

        return breadcrumbItems;
    };

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };


    if (authLoading) {
        return <p style={{ textAlign: 'center', padding: '100px' }}>Đang kiểm tra quyền truy cập Admin...</p>;
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Sidebar */}
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                }}
            >
                {/* Logo */}
                <div style={{
                    padding: '16px',
                    textAlign: 'center',
                    borderBottom: '1px solid #303030'
                }}>
                    <Title
                        level={4}
                        style={{
                            color: '#fff',
                            margin: 0,
                            fontSize: collapsed ? '16px' : '20px'
                        }}
                    >
                        🌿 {!collapsed && 'BonsaiGN'}
                    </Title>
                    {!collapsed && (
                        <Text style={{ color: '#999', fontSize: '12px' }}>
                            Admin Panel
                        </Text>
                    )}
                </div>

                {/* Menu */}
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[getCurrentKey()]}
                    items={menuItems}
                    onClick={({ key }) => navigate(key)}
                    style={{ borderRight: 0 }}
                />

                {/* Logout button ở cuối sidebar */}
                <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    right: '16px'
                }}>
                    <Button
                        type="primary"
                        danger
                        block
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                        size={collapsed ? 'small' : 'middle'}
                    >
                        {!collapsed && 'Đăng xuất'}
                    </Button>
                </div>
            </Sider>

            {/* Main Layout */}
            <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
                {/* Header */}
                <Header style={{
                    padding: '0 24px',
                    background: colorBgContainer,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #f0f0f0'
                }}>
                    <Space>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                        <Title level={4} style={{ margin: 0 }}>
                            {getPageTitle()}
                        </Title>
                    </Space>

                    <Space>
                        <Text>Xin chào, </Text>
                        <Avatar icon={<UserOutlined />} />
                        <Text strong>{user?.name}</Text>
                    </Space>
                </Header>

                {/* Breadcrumb */}
                <div style={{ padding: '16px 24px 0' }}>
                    <Breadcrumb items={getBreadcrumbItems()} />
                </div>

                {/* Content */}
                <Content style={{
                    margin: '24px',
                    padding: '24px',
                    background: colorBgContainer,
                    borderRadius: '8px',
                    minHeight: 'calc(100vh - 160px)',
                    overflow: 'auto'
                }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
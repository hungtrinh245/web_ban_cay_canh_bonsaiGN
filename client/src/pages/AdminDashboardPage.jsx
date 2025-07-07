// client/src/pages/AdminDashboardPage.jsx
import React from 'react';
import { Routes, Route, Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductManagement from '../components/admin/ProductManagement';

const AdminDashboardPage = () => {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    // Bảo vệ route: Chỉ admin mới được vào
    // Nếu bạn muốn hiển thị spinner khi đang kiểm tra authLoading, có thể thêm vào đây
    if (authLoading) {
        return <p style={{textAlign: 'center', padding: '50px'}}>Đang kiểm tra quyền truy cập...</p>;
    }

    if (!isAuthenticated || user.role !== 'admin') {
        navigate('/login'); // Chuyển hướng về trang đăng nhập nếu không phải admin
        alert('Bạn không có quyền truy cập trang quản trị!');
        return null; // Không render gì
    }

    // --- CÁC STYLE ADMIN DASHBOARD ---
    const dashboardContainerStyle = {
        display: 'flex',
        minHeight: '80vh',
        fontFamily: 'Roboto, sans-serif',
        background: '#f8f9fa',
    };

    const sidebarStyle = {
        width: '250px',
        background: '#343a40', // Màu tối
        color: 'white',
        padding: '20px',
        boxShadow: '2px 0 10px rgba(0,0,0,0.2)',
        flexShrink: 0, 
    };

    const sidebarTitleStyle = {
        fontSize: '1.8em',
        fontWeight: 'bold',
        marginBottom: '30px',
        textAlign: 'center',
        color: '#4CAF50',
    };

    const navListStyle = {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    };

    const navItemStyle = {
        marginBottom: '10px',
    };

    const navLinkStyle = {
        display: 'block',
        padding: '12px 15px',
        color: '#adb5bd', // Màu chữ nhạt
        textDecoration: 'none',
        borderRadius: '5px',
        transition: 'background-color 0.2s, color 0.2s',
        '&:hover': {
            background: '#495057',
            color: 'white',
        },
    };

    const navLinkActiveStyle = {
        background: '#28a745', // Màu xanh lá khi active
        color: 'white',
        fontWeight: 'bold',
    };

    const mainContentStyle = {
        flexGrow: 1, 
        padding: '30px',
        background: '#fff',
    };

    return (
        <div style={dashboardContainerStyle}>
            <div style={sidebarStyle}>
                <h1 style={sidebarTitleStyle}>Admin Panel</h1>
                <ul style={navListStyle}>
                    <li style={navItemStyle}>
                        <Link to="/admin/products" style={navLinkStyle} 
                            onMouseOver={(e) => Object.assign(e.currentTarget.style, navLinkStyle['&:hover'])}
                            onMouseOut={(e) => Object.assign(e.currentTarget.style, navLinkStyle)}
                          
                        >
                            Quản lý Sản phẩm
                        </Link>
                    </li>
                    <li style={navItemStyle}>
                        <Link to="/admin/orders" style={navLinkStyle} 
                             onMouseOver={(e) => Object.assign(e.currentTarget.style, navLinkStyle['&:hover'])}
                            onMouseOut={(e) => Object.assign(e.currentTarget.style, navLinkStyle)}
                        >
                            Quản lý Đơn hàng
                        </Link>
                    </li>
                    <li style={navItemStyle}>
                        <Link to="/admin/users" style={navLinkStyle} 
                            onMouseOver={(e) => Object.assign(e.currentTarget.style, navLinkStyle['&:hover'])}
                            onMouseOut={(e) => Object.assign(e.currentTarget.style, navLinkStyle)}
                        >
                            Quản lý Người dùng
                        </Link>
                    </li>
                    <li style={navItemStyle}>
                        <Link to="/admin/coupons" style={navLinkStyle} 
                            onMouseOver={(e) => Object.assign(e.currentTarget.style, navLinkStyle['&:hover'])}
                            onMouseOut={(e) => Object.assign(e.currentTarget.style, navLinkStyle)}
                        >
                            Quản lý Mã ưu đãi
                        </Link>
                    </li>
                     <li style={navItemStyle}>
                        <Link to="/admin/posts" style={navLinkStyle} 
                            onMouseOver={(e) => Object.assign(e.currentTarget.style, navLinkStyle['&:hover'])}
                            onMouseOut={(e) => Object.assign(e.currentTarget.style, navLinkStyle)}
                        >
                            Quản lý Bài viết
                        </Link>
                    </li>
                </ul>
            </div>
            <div style={mainContentStyle}>
                {/* Outlet sẽ render các component con dựa trên route */}
                <Outlet /> 
            </div>
        </div>
    );
};

export default AdminDashboardPage;
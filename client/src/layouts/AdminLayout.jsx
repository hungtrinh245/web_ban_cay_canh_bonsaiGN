
import React, { useEffect } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaLeaf, FaHome, FaBox, FaUsers, FaTag, FaClipboardList, FaNewspaper, FaCog } from 'react-icons/fa'; 

const AdminLayout = () => {
    const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
    const navigate = useNavigate();

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

    // --- HÀM handleLogout ---
    const handleLogout = () => {
        logout(); 
        navigate('/admin/login');
    };

    const dashboardContainerStyle = {
        display: 'flex',
        minHeight: '100vh', 
        fontFamily: 'Roboto, sans-serif',
        background: '#f0f2f5', 
    };

    const sidebarStyle = {
        width: '280px', 
        background: '#2c3e50',
        color: 'white',
        padding: '25px',
        boxShadow: '4px 0 15px rgba(0,0,0,0.2)',
        flexShrink: 0, 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', 
    };

    const sidebarLogoContainerStyle = {
        marginBottom: '40px',
        paddingBottom: '20px',
        borderBottom: '1px solid rgba(255,255,255,0.1)', 
        textAlign: 'center',
    };

    const sidebarLogoStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        color: '#4CAF50', 
        textDecoration: 'none',
        fontSize: '1.5em', 
        fontWeight: 'bold',
        textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
    };

    const sidebarSubtitleStyle = {
        fontSize: '0.85em', 
        color: '#b0c4de',
        textAlign: 'center',
        marginTop: '10px', 
        lineHeight: '1.4',
    };

    const navListStyle = {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        flexGrow: 1, 
    };

    const navItemStyle = {
        marginBottom: '8px',
    };

    const navLinkBaseStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 20px',
        color: '#b0c4de', 
        textDecoration: 'none',
        borderRadius: '8px',
        transition: 'background-color 0.2s ease, transform 0.1s ease, color 0.2s', 
        fontSize: '1.05em',
        fontWeight: '500',
    };

    const navLinkHoverStyle = {
        background: '#3a5068', 
        transform: 'translateX(5px)',
        color: 'white',
    };

    const navLinkActiveStyle = {
        background: '#4CAF50', 
        color: 'white',
        fontWeight: 'bold',
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
        transform: 'translateX(5px)', 
    };

    const adminLogoutButtonStyle = {
        background: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '12px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1em',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: '30px',
        transition: 'background-color 0.3s ease, transform 0.2s',
        '&:hover': {
            backgroundColor: '#c82333',
            transform: 'translateY(-2px)',
        }
    };

    const mainContentAreaStyle = {
        flexGrow: 1,
        padding: '30px',
        background: '#f8f9fa', 
        overflowY: 'auto', 
    };

    const getNavLinkStyle = ({ isActive }) => {
        return {
            ...navLinkBaseStyle,
            ...(isActive ? navLinkActiveStyle : {}),
        };
    };

    const applyHover = (e, hoverStyle) => Object.assign(e.currentTarget.style, hoverStyle);
    const removeHover = (e, baseStyle) => Object.assign(e.currentTarget.style, baseStyle);


    if (authLoading) {
        return <p style={{textAlign: 'center', padding: '100px'}}>Đang kiểm tra quyền truy cập Admin...</p>;
    }
    
    return (
        <div style={dashboardContainerStyle}>
            <div style={sidebarStyle}>
                <div> 
                    <div style={sidebarLogoContainerStyle}>
                        <Link to="/admin" style={sidebarLogoStyle}>
                            <FaLeaf size={32} style={{ color: '#4CAF50' }} /> 
                            BonsaiGN <br/> 
                        </Link>
                    
                    </div>

                    <ul style={navListStyle}>
                        <li style={navItemStyle}>
                            <NavLink 
                                to="/admin" 
                                style={getNavLinkStyle}
                                onMouseOver={(e) => applyHover(e, navLinkHoverStyle)}
                                onMouseOut={(e) => removeHover(e, navLinkBaseStyle)}
                            >
                                <FaHome /> Dashboard
                            </NavLink>
                        </li>
                        <li style={navItemStyle}>
                            <NavLink 
                                to="/admin/products" 
                                style={getNavLinkStyle}
                                onMouseOver={(e) => applyHover(e, navLinkHoverStyle)}
                                onMouseOut={(e) => removeHover(e, navLinkBaseStyle)}
                            >
                                <FaBox /> Quản lý Sản phẩm
                            </NavLink>
                        </li>
                        <li style={navItemStyle}>
                            <NavLink 
                                to="/admin/orders" 
                                style={getNavLinkStyle}
                                onMouseOver={(e) => applyHover(e, navLinkHoverStyle)}
                                onMouseOut={(e) => removeHover(e, navLinkBaseStyle)}
                            >
                                <FaClipboardList /> Quản lý Đơn hàng
                            </NavLink>
                        </li>
                        <li style={navItemStyle}>
                            <NavLink 
                                to="/admin/users" 
                                style={getNavLinkStyle}
                                onMouseOver={(e) => applyHover(e, navLinkHoverStyle)}
                                onMouseOut={(e) => removeHover(e, navLinkBaseStyle)}
                            >
                                <FaUsers /> Quản lý Người dùng
                            </NavLink>
                        </li>
                        <li style={navItemStyle}>
                            <NavLink 
                                to="/admin/coupons" 
                                style={getNavLinkStyle}
                                onMouseOver={(e) => applyHover(e, navLinkHoverStyle)}
                                onMouseOut={(e) => removeHover(e, navLinkBaseStyle)}
                            >
                                <FaTag /> Quản lý Mã ưu đãi
                            </NavLink>
                        </li>
                        <li style={navItemStyle}>
                            <NavLink 
                                to="/admin/posts" 
                                style={getNavLinkStyle}
                                onMouseOver={(e) => applyHover(e, navLinkHoverStyle)}
                                onMouseOut={(e) => removeHover(e, navLinkBaseStyle)}
                            >
                                <FaNewspaper /> Quản lý Bài viết
                            </NavLink>
                        </li>
                      
                        <li style={navItemStyle}>
                            <NavLink 
                                to="/admin/settings" 
                                style={getNavLinkStyle}
                                onMouseOver={(e) => applyHover(e, navLinkHoverStyle)}
                                onMouseOut={(e) => removeHover(e, navLinkBaseStyle)}
                            >
                                <FaCog /> Cài đặt
                            </NavLink>
                        </li>
                    </ul>
                </div>
              
                <button 
                    onClick={handleLogout} 
                    style={adminLogoutButtonStyle}
                    onMouseOver={(e) => applyHover(e, adminLogoutButtonStyle['&:hover'])}
                    onMouseOut={(e) => removeHover(e, adminLogoutButtonStyle)}
                >
                    Đăng xuất
                </button>
            </div>
            <div style={mainContentAreaStyle}>
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
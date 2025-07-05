// client/src/App.jsx
import React, { useState } from 'react';
import { Routes, Route, Link, NavLink, useNavigate } from 'react-router-dom'; 
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage'; 
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage' 


import Newsletter from './components/layout/Newsletter';
import Footer from './components/layout/Footer';
import MiniCart from './components/layout/MiniCart'; 


import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';


import BlogDetailPage from './pages/BlogDetailPage';
import AboutPage from './pages/AboutPage'; 
import ContactPage from './pages/ContactPage';

import { FaShoppingCart, FaUserCircle, FaHome, FaStore, FaInfoCircle, FaPhone, FaNewspaper, FaSearch } from 'react-icons/fa';

function App() {
    const { isAuthenticated, user, logout } = useAuth();
    const { cartItems } = useCart();
    const navigate = useNavigate();

    const [showMiniCart, setShowMiniCart] = useState(false);

    const totalCartItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
    const miniCartSubtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleCloseMiniCart = () => {
        setShowMiniCart(false);
    };

    const handleAddToCartSuccess = () => {
        setShowMiniCart(true); 
        // Optional: Tự động đóng mini-cart sau vài giây
        // setTimeout(() => setShowMiniCart(false), 3000); 
    };



    const headerTopStyle = { 
        background: '#1a1a1a', 
        color: 'white',
        padding: '0.8rem 2.5rem', 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        fontFamily: 'Roboto, sans-serif',
        width: '100%', 
        boxSizing: 'border-box' 
    };

    const logoStyle = {
        color: '#4CAF50', 
        textDecoration: 'none',
        fontSize: '1.8rem',
        fontWeight: 'bold',
        letterSpacing: '1px',
        display: 'flex',
        alignItems: 'center'
    };

    const logoSpanStyle = {
        color: 'white',
        marginLeft: '5px'
    };

    const userActionsStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
    };

    const navLinkStyle = {
        color: 'white',
        textDecoration: 'none',
        fontSize: '1rem',
        padding: '8px 12px',
        borderRadius: '5px',
        transition: 'background-color 0.3s ease, color 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
    };

    const navLinkHoverStyle = {
        backgroundColor: '#4CAF50',
        color: 'white',
    };

    const headerCartLinkStyle = {
        ...navLinkStyle, 
        position: 'relative', 
        display: 'flex',
        alignItems: 'center',
        gap: '10px', 
        background: '#444', 
        padding: '8px 15px', 
        borderRadius: '25px', 
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, transform 0.2s',
    };

    const headerCartLinkHoverStyle = {
        backgroundColor: '#555', 
        transform: 'scale(1.02)'
    };

    const cartBadgeStyle = {
        position: 'absolute',
        top: '-8px',
        right: '-8px', 
        background: '#FF5722',
        borderRadius: '50%',
        minWidth: '22px', 
        height: '22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        color: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    };

    const cartTextStyle = {
        fontSize: '1rem',
        fontWeight: 'bold',
        color: 'white',
        whiteSpace: 'nowrap' 
    };

    const cartPriceStyle = {
        fontSize: '0.9em', 
        color: '#f0f0f0', 
        marginLeft: '5px',
        whiteSpace: 'nowrap' 
    };

    const buttonStyle = {
        padding: '8px 15px',
        background: 'none',
        border: '1px solid #4CAF50',
        color: '#4CAF50',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1rem',
        transition: 'background-color 0.3s ease, color 0.3s ease',
    };

    const buttonHoverStyle = {
        backgroundColor: '#4CAF50',
        color: 'white',
    };

    // --- MAIN NAVIGATION BAR ---
    const mainNavBarStyle = {
        background: '#28a745', 
        padding: '0.8rem 2.5rem', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        fontFamily: 'Roboto, sans-serif',
        width: '100%',
        boxSizing: 'border-box'
    };

    const mainNavLinkContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        gap: '35px',
    };

    const mainNavLinkBaseStyle = {
        color: 'white',
        textDecoration: 'none',
        fontSize: '1.05rem',
        fontWeight: '500',
        padding: '5px 10px',
        position: 'relative',
        transition: 'color 0.3s ease, border-bottom 0.3s ease, padding-bottom 0.3s ease', 
        display: 'flex', 
        alignItems: 'center',
        gap: '5px'
    };

    const mainNavLinkHoverStyle = {
        color: '#f0f0f0',
    };

   
    const mainNavLinkActiveStyle = {
        fontWeight: 'bold',
        color: 'blue', //màu  nổi bật 
        borderBottom: '3px solid blue', 
        paddingBottom: '2px', //gạch chân không quá sát chữ
    };
    
   
    const getNavLinkStyle = ({ isActive }) => {
        return {
            ...mainNavLinkBaseStyle,
            ...(isActive ? mainNavLinkActiveStyle : {}),
           
        };
    };


    const applyHoverStyle = (e, style) => {
        Object.assign(e.currentTarget.style, style);
    };

    const removeHoverStyle = (e, initialStyle) => {
        // Đối với NavLink, cần giữ lại active style nếu đang active
        if (e.currentTarget.dataset && e.currentTarget.dataset.isactive === 'true') {
            Object.assign(e.currentTarget.style, mainNavLinkActiveStyle);
        } else {
            Object.assign(e.currentTarget.style, initialStyle);
        }
    };


    return (
        <>
            {/* Header chính (Top Bar) */}
            <header style={headerTopStyle}>
                <Link to="/" style={logoStyle}>
                    <FaStore size={28} style={{ marginRight: '8px', color: 'white' }} /> Bonsai<span style={logoSpanStyle}>GN</span>
                </Link>
                
                {/* Thanh tìm kiếm */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: 1, maxWidth: '500px', margin: '0 30px' }}>
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm sản phẩm..." 
                        style={{ 
                            width: '100%', 
                            padding: '10px 40px 10px 15px', 
                            borderRadius: '25px', 
                            border: '1px solid #555',
                            background: '#2a2a2a',
                            color: 'white',
                            fontSize: '0.95em',
                            boxSizing: 'border-box'
                        }} 
                    />
                    <FaSearch style={{ 
                        position: 'absolute', 
                        right: '15px', 
                        color: '#aaa' 
                    }} />
                </div>

                <div style={userActionsStyle}>
                    {/* Giỏ hàng và tổng tiền */}
                    <Link
                        to="/cart"
                        style={headerCartLinkStyle} 
                        onMouseOver={(e) => applyHoverStyle(e, headerCartLinkHoverStyle)}
                        onMouseOut={(e) => removeHoverStyle(e, headerCartLinkStyle)}
                        onClick={(e) => { 
                            e.preventDefault(); 
                            setShowMiniCart(!showMiniCart); 
                        }}
                    >
                        <FaShoppingCart size={18} />
                        <span style={cartTextStyle}>
                            Giỏ hàng
                            {totalCartItems > 0 && (
                                <span style={cartBadgeStyle}>{totalCartItems}</span>
                            )}
                        </span>
                        {totalCartItems > 0 && ( 
                            <span style={cartPriceStyle}>
                                / {miniCartSubtotal.toLocaleString('vi-VN')} VNĐ
                            </span>
                        )}
                    </Link>
                    
                    {showMiniCart && (
                        <MiniCart 
                            cartItems={cartItems} 
                            subtotal={miniCartSubtotal} 
                            onClose={handleCloseMiniCart} 
                        />
                    )}

                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/profile" 
                                style={navLinkStyle}
                                onMouseOver={(e) => applyHoverStyle(e, navLinkHoverStyle)}
                                onMouseOut={(e) => removeHoverStyle(e, navLinkStyle)}
                            >
                                <FaUserCircle size={18} /> Chào, {user.name}
                            </Link>
                            <button
                                onClick={handleLogout}
                                style={buttonStyle}
                                onMouseOver={(e) => applyHoverStyle(e, buttonHoverStyle)}
                                onMouseOut={(e) => removeHover(e, buttonStyle)}
                            >
                                Đăng xuất
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                style={navLinkStyle}
                                onMouseOver={(e) => applyHoverStyle(e, navLinkHoverStyle)}
                                onMouseOut={(e) => removeHoverStyle(e, navLinkStyle)}
                            >
                                Đăng nhập
                            </Link>
                            <Link
                                to="/register"
                                style={navLinkStyle}
                                onMouseOver={(e) => applyHoverStyle(e, navLinkHoverStyle)}
                                onMouseOut={(e) => removeHoverStyle(e, navLinkStyle)}
                            >
                                Đăng ký
                            </Link>
                        </>
                    )}
                </div>
            </header>

            {/* Header phụ (Main Navigation Bar) */}
            <nav style={mainNavBarStyle}>
                <div style={mainNavLinkContainerStyle}>
                    {/* DÙNG NavLink VÀ getNavLinkStyle */}
                    <NavLink
                        to="/"
                        style={getNavLinkStyle}
                        onMouseOver={(e) => applyHoverStyle(e, mainNavLinkHoverStyle)}
                        onMouseOut={(e) => removeHoverStyle(e, mainNavLinkBaseStyle)} // Về base style nếu không active
                        data-isactive={location.pathname === '/' || location.pathname === '/home' ? 'true' : 'false'} // Thêm data-attribute để helper nhận biết
                    >
                        <FaHome /> Trang chủ
                    </NavLink>
                    <NavLink
                        to="/shop"
                        style={getNavLinkStyle}
                        onMouseOver={(e) => applyHoverStyle(e, mainNavLinkHoverStyle)}
                        onMouseOut={(e) => removeHoverStyle(e, mainNavLinkBaseStyle)}
                        data-isactive={location.pathname.startsWith('/shop') ? 'true' : 'false'}
                    >
                        <FaStore /> Cửa hàng
                    </NavLink>
                    <NavLink
                        to="/about"
                        style={getNavLinkStyle}
                        onMouseOver={(e) => applyHoverStyle(e, mainNavLinkHoverStyle)}
                        onMouseOut={(e) => removeHoverStyle(e, mainNavLinkBaseStyle)}
                        data-isactive={location.pathname === '/about' ? 'true' : 'false'}
                    >
                        <FaInfoCircle /> Giới thiệu
                    </NavLink>
                    <NavLink
                        to="/contact"
                        style={getNavLinkStyle}
                        onMouseOver={(e) => applyHoverStyle(e, mainNavLinkHoverStyle)}
                        onMouseOut={(e) => removeHoverStyle(e, mainNavLinkBaseStyle)}
                        data-isactive={location.pathname === '/contact' ? 'true' : 'false'}
                    >
                        <FaPhone /> Liên hệ
                    </NavLink>
                    <NavLink
                        to="/blog" 
                        style={getNavLinkStyle}
                        onMouseOver={(e) => applyHoverStyle(e, mainNavLinkHoverStyle)}
                        onMouseOut={(e) => removeHoverStyle(e, mainNavLinkBaseStyle)}
                        data-isactive={location.pathname.startsWith('/blog') ? 'true' : 'false'}
                    >
                        <FaNewspaper /> Tin tức
                    </NavLink>
                </div>
            </nav>


            <main style={{ minHeight: '60vh', padding: '0px 0', overflowX: 'hidden' }}>
                <Routes>
                    <Route path="/" element={<HomePage />} /> 
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage onAddToCartSuccess={handleAddToCartSuccess} />} />
                    <Route path="/shop/category/:categoryName" element={<ShopPage onAddToCartSuccess={handleAddToCartSuccess} />} />
                    <Route path="/products/:id" element={<ProductDetailPage onAddToCartSuccess={handleAddToCartSuccess} />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/about" element={<AboutPage />} /> 

                     <Route path="/contact" element={<ContactPage />} /> 
                    {/* ROUTES CHO BLOG */}
                    <Route path="/blog" element={<HomePage />} /> 
                    <Route path="/blog/:id" element={<BlogDetailPage />} /> 
                    
                    <Route path="/profile" element={<div><h1>Hồ sơ của bạn</h1><p>Trang này sẽ hiển thị thông tin cá nhân của bạn.</p></div>} />
                    <Route path="/checkout" element={<CheckoutPage />} /> 
                    <Route path="/order-success" element={<div><h1>Đặt hàng thành công!</h1><p>Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đang được xử lý.</p><Link to="/">Tiếp tục mua sắm</Link></div>} /> 

                    
                    <Route path="/privacy-policy" element={<div><h1>Chính sách bảo mật</h1><p>Nội dung chính sách bảo mật...</p></div>} />
                    <Route path="/warranty" element={<div><h1>Chính sách bảo hành</h1><p>Nội dung chính sách bảo hành...</p></div>} />
                    <Route path="/payment" element={<div><h1>Phương thức thanh toán</h1><p>Nội dung phương thức thanh toán...</p></div>} />
                </Routes>
            </main>

            <Newsletter />
            <Footer />
        </>
    );
}

export default App;
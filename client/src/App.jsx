// client/src/App.jsx
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';

import Newsletter from './components/layout/Newsletter';
import Footer from './components/layout/Footer';


import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';

import { FaShoppingCart, FaUserCircle, FaHome, FaStore, FaInfoCircle, FaPhone, FaNewspaper } from 'react-icons/fa';

function App() {
    const { isAuthenticated, user, logout } = useAuth();
    const { cartItems } = useCart();
    const navigate = useNavigate();

    const totalCartItems = cartItems.reduce((sum, item) => sum + item.qty, 0);

    const handleLogout = () => {
        logout();
        navigate('/login');
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

    const cartIconStyle = {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
    };

    const cartBadgeStyle = {
        position: 'absolute',
        top: '-8px',
        right: '-12px',
        background: '#FF5722',
        borderRadius: '50%',
        width: '22px',
        height: '22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        color: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
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

    const mainNavLinkStyle = {
        color: 'white',
        textDecoration: 'none',
        fontSize: '1.05rem',
        fontWeight: '500',
        padding: '5px 10px',
        position: 'relative',
        transition: 'color 0.3s ease',
    };

    const mainNavLinkHoverStyle = {
        color: '#f0f0f0',
    };

    const mainNavLinkActiveStyle = {
        fontWeight: 'bold',
        color: '#1a1a1a',
    };
    
    const applyHoverStyle = (e, style) => {
        Object.assign(e.currentTarget.style, style);
    };

    const removeHoverStyle = (e, initialStyle) => {
        Object.assign(e.currentTarget.style, initialStyle);
    };

    return (
        <>
            {/* Header chính (Top Bar) */}
            <header style={headerTopStyle}>
                <Link to="/" style={logoStyle}>
                    <FaStore size={28} style={{ marginRight: '8px', color: 'white' }} /> Bonsai<span style={logoSpanStyle}>GN</span>
                </Link>
                
                <div style={userActionsStyle}>
                    {/* Giỏ hàng */}
                    <Link
                        to="/cart"
                        style={navLinkStyle}
                        onMouseOver={(e) => applyHoverStyle(e, navLinkHoverStyle)}
                        onMouseOut={(e) => removeHoverStyle(e, navLinkStyle)}
                    >
                        <FaShoppingCart size={18} />
                        <span style={cartIconStyle}>
                            Giỏ hàng
                            {totalCartItems > 0 && (
                                <span style={cartBadgeStyle}>{totalCartItems}</span>
                            )}
                        </span>
                    </Link>

                    {/* Hiển thị tùy theo trạng thái đăng nhập */}
                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/profile" // Thêm link đến trang profile 
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
                                onMouseOut={(e) => removeHoverStyle(e, buttonStyle)}
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
                    <Link
                        to="/" // Trang chủ
                        style={mainNavLinkStyle}
                        onMouseOver={(e) => applyHoverStyle(e, mainNavLinkHoverStyle)}
                        onMouseOut={(e) => removeHoverStyle(e, mainNavLinkStyle)}
                    >
                        <FaHome style={{ marginRight: '5px' }} /> Trang chủ
                    </Link>
                    <Link
                        to="/shop" // Cửa hàng / Sản phẩm
                        style={mainNavLinkStyle}
                        onMouseOver={(e) => applyHoverStyle(e, mainNavLinkHoverStyle)}
                        onMouseOut={(e) => removeHoverStyle(e, mainNavLinkStyle)}
                    >
                        <FaStore style={{ marginRight: '5px' }} /> Cửa hàng
                    </Link>
                    <Link
                        to="/about" // Giới thiệu
                        style={mainNavLinkStyle}
                        onMouseOver={(e) => applyHoverStyle(e, mainNavLinkHoverStyle)}
                        onMouseOut={(e) => removeHoverStyle(e, mainNavLinkStyle)}
                    >
                        <FaInfoCircle style={{ marginRight: '5px' }} /> Giới thiệu
                    </Link>
                    <Link
                        to="/contact" // Liên hệ 
                        style={mainNavLinkStyle}
                        onMouseOver={(e) => applyHoverStyle(e, mainNavLinkHoverStyle)}
                        onMouseOut={(e) => removeHoverStyle(e, mainNavLinkStyle)}
                    >
                        <FaPhone style={{ marginRight: '5px' }} /> Liên hệ
                    </Link>
                    <Link
                        to="/blog" // Tin tức / Blog 
                        style={mainNavLinkStyle}
                        onMouseOver={(e) => applyHoverStyle(e, mainNavLinkHoverStyle)}
                        onMouseOut={(e) => removeHoverStyle(e, mainNavLinkStyle)}
                    >
                        <FaNewspaper style={{ marginRight: '5px' }} /> Tin tức
                    </Link>
                </div>
            </nav>


            <main style={{ minHeight: '60vh', padding: '0px 0', overflowX: 'hidden' }}> 
                <Routes>
                    <Route path="/" element={<HomePage />} /> 
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/shop/category/:categoryName" element={<ShopPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/cart" element={<CartPage />} />


                    <Route path="/about" element={<div><h1>Giới thiệu</h1><p>Đây là trang giới thiệu.</p></div>} />
                    <Route path="/contact" element={<div><h1>Liên hệ</h1><p>Đây là trang liên hệ.</p></div>} />
                    <Route path="/blog" element={<div><h1>Tin tức</h1><p>Đây là trang tin tức.</p></div>} />
                    <Route path="/profile" element={<div><h1>Hồ sơ của bạn</h1><p>Trang này sẽ hiển thị thông tin cá nhân của bạn.</p></div>} />
                    
                    {/* Các route chính sách từ Footer */}
                    <Route path="/privacy-policy" element={<div><h1>Chính sách bảo mật</h1><p>Nội dung chính sách bảo mật...</p></div>} />
                    <Route path="/warranty" element={<div><h1>Chính sách bảo hành</h1><p>Nội dung chính sách bảo hành...</p></div>} />
                    <Route path="/payment" element={<div><h1>Phương thức thanh toán</h1><p>Nội dung phương thức thanh toán...</p></div>} />
                </Routes>
            </main>

            {/* Newsletter và Footer sẽ cần điều chỉnh tương tự nếu muốn full width và không có khoảng trống */}
            <Newsletter />
            <Footer />
        </>
    );
}

export default App;
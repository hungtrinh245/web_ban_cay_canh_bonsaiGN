// client/src/App.jsx
import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage'

// Import các component layout
import Newsletter from './components/layout/Newsletter';
import Footer from './components/layout/Footer';
import MiniCart from './components/layout/MiniCart'; 

// Import các Context Hook
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';

// Import icons
import { FaShoppingCart, FaUserCircle, FaHome, FaStore, FaInfoCircle, FaPhone, FaNewspaper, FaSearch } from 'react-icons/fa';

function App() {
    const { isAuthenticated, user, logout } = useAuth();
    const { cartItems } = useCart();
    const navigate = useNavigate();

    const [showMiniCart, setShowMiniCart] = useState(false);

    // Tính tổng số lượng và tổng tiền cho mini-cart (được sử dụng cả ở header)
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

    // Style cho Link chung (ví dụ: Đăng nhập, Đăng ký)
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

    // Style riêng cho phần Giỏ hàng 
    const headerCartLinkStyle = {
        ...navLinkStyle, // Kế thừa style chung
        position: 'relative', // Để badge số lượng có thể định vị
        display: 'flex',
        alignItems: 'center',
        gap: '10px', // Khoảng cách giữa icon và chữ/giá
        background: '#444', // Nền hơi xám cho vùng giỏ hàng
        padding: '8px 15px', // Padding rộng hơn
        borderRadius: '25px', // Bo tròn hơn
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, transform 0.2s',
    };

    const headerCartLinkHoverStyle = {
        backgroundColor: '#555', // Đậm hơn khi hover
        transform: 'scale(1.02)'
    };

    const cartBadgeStyle = {
        position: 'absolute',
        top: '-8px',
        right: '-8px', // Điều chỉnh vị trí badge
        background: '#FF5722',
        borderRadius: '50%',
        minWidth: '22px', // Đảm bảo đủ rộng cho số 2 chữ số
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
        whiteSpace: 'nowrap' // Ngăn không cho chữ xuống dòng
    };

    const cartPriceStyle = {
        fontSize: '0.9em', // Kích thước nhỏ hơn một chút
        color: '#f0f0f0', // Màu trắng nhạt
        marginLeft: '5px',
        whiteSpace: 'nowrap' // Ngăn không cho số tiền xuống dòng
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
                        style={headerCartLinkStyle} // Sử dụng style mới cho giỏ hàng
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
                        {totalCartItems > 0 && ( // Chỉ hiện giá khi có sản phẩm
                            <span style={cartPriceStyle}>
                                / {miniCartSubtotal.toLocaleString('vi-VN')} VNĐ
                            </span>
                        )}
                    </Link>
                    
                    {/* Render MiniCart nếu showMiniCart là true */}
                    {showMiniCart && (
                        <MiniCart 
                            cartItems={cartItems} 
                            subtotal={miniCartSubtotal} 
                            onClose={handleCloseMiniCart} 
                        />
                    )}

                    {/* Hiển thị tùy theo trạng thái đăng nhập */}
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
                        to="/"
                        style={mainNavLinkStyle}
                        onMouseOver={(e) => applyHoverStyle(e, mainNavLinkHoverStyle)}
                        onMouseOut={(e) => removeHoverStyle(e, mainNavLinkStyle)}
                    >
                        <FaHome style={{ marginRight: '5px' }} /> Trang chủ
                    </Link>
                    <Link
                        to="/shop"
                        style={mainNavLinkStyle}
                        onMouseOver={(e) => applyHoverStyle(e, mainNavLinkHoverStyle)}
                        onMouseOut={(e) => removeHoverStyle(e, mainNavLinkStyle)}
                    >
                        <FaStore style={{ marginRight: '5px' }} /> Cửa hàng
                    </Link>
                    <Link
                        to="/about"
                        style={mainNavLinkStyle}
                        onMouseOver={(e) => applyHoverStyle(e, mainNavLinkHoverStyle)}
                        onMouseOut={(e) => removeHoverStyle(e, mainNavLinkStyle)}
                    >
                        <FaInfoCircle style={{ marginRight: '5px' }} /> Giới thiệu
                    </Link>
                    <Link
                        to="/contact"
                        style={mainNavLinkStyle}
                        onMouseOver={(e) => applyHoverStyle(e, mainNavLinkHoverStyle)}
                        onMouseOut={(e) => removeHoverStyle(e, mainNavLinkStyle)}
                    >
                        <FaPhone style={{ marginRight: '5px' }} /> Liên hệ
                    </Link>
                    <Link
                        to="/blog"
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
                    <Route path="/shop" element={<ShopPage onAddToCartSuccess={handleAddToCartSuccess} />} />
                    <Route path="/shop/category/:categoryName" element={<ShopPage onAddToCartSuccess={handleAddToCartSuccess} />} />
                    <Route path="/products/:id" element={<ProductDetailPage onAddToCartSuccess={handleAddToCartSuccess} />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/about" element={<div><h1>Giới thiệu</h1><p>Đây là trang giới thiệu.</p></div>} />
                    <Route path="/contact" element={<div><h1>Liên hệ</h1><p>Đây là trang liên hệ.</p></div>} />
                    <Route path="/blog" element={<div><h1>Tin tức</h1><p>Đây là trang tin tức.</p></div>} />
                    <Route path="/profile" element={<div><h1>Hồ sơ của bạn</h1><p>Trang này sẽ hiển thị thông tin cá nhân của bạn.</p></div>} />
                    {/* <Route path="/checkout" element={<div><h1>Trang Thanh Toán</h1><p>Đây là trang thanh toán.</p></div>} /> */}
                    <Route path="/checkout" element={<CheckoutPage />} /> {/* <-- THÊM ROUTE NÀY */}
                    <Route path="/order-success" element={<div><h1>Đặt hàng thành công!</h1><p>Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đang được xử lý.</p><Link to="/">Tiếp tục mua sắm</Link></div>} /> {/* Trang xác nhận đơn hàng */}

                    
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
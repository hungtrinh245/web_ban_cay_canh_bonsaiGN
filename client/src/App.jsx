// client/src/App.jsx
import React, { useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'; 

import ClientLayout from './layouts/ClientLayout'; 
import AdminLayout from './layouts/AdminLayout';   

import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import BlogDetailPage from './pages/BlogDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import AdminLoginPage from './pages/AdminLoginPage';

import ProductManagement from './components/admin/ProductManagement'; 
import OrderDetailPage from './pages/OrderDetailPage';


import { useAuth } from './context/AuthContext';


// Component bảo vệ route Admin
const AdminProtectedRoute = ({ children }) => {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated || (user && user.role !== 'admin')) { 
                if (!location.pathname.startsWith('/admin/login')) {
                    alert('Bạn không có quyền truy cập trang quản trị! Vui lòng đăng nhập với tài khoản Admin.');
                    navigate('/admin/login');
                }
            }
        }
    }, [isAuthenticated, user, authLoading, navigate, location.pathname]);

    if (authLoading) {
        return <p style={{textAlign: 'center', padding: '100px'}}>Đang kiểm tra quyền truy cập...</p>;
    }

    if (!isAuthenticated || (user && user.role !== 'admin')) {
        return null; 
    }

    return children; 
};

// Component bảo vệ route chung (yêu cầu đăng nhập) ---
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            alert('Bạn cần đăng nhập để truy cập trang này.');
            navigate('/login', { state: { from: location.pathname } }); // Chuyển hướng đến trang login, 
        }
    }, [isAuthenticated, authLoading, navigate, location.pathname]);

    if (authLoading) {
        return <p style={{textAlign: 'center', padding: '100px'}}>Đang tải...</p>;
    }

    if (!isAuthenticated) {
        return null; 
    }

    return children; 
};


function App() {
    return (
        <>
            <Routes>
                {/* --- ROUTES CLIENT LAYOUT --- */}
                <Route path="/" element={<ClientLayout />}>
                    <Route index element={<HomePage />} /> 
                    <Route path="home" element={<HomePage />} /> 
                    <Route path="shop" element={<ShopPage />} />
                    <Route path="shop/category/:categoryName" element={<ShopPage />} />
                    <Route path="products/:id" element={<ProductDetailPage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="contact" element={<ContactPage />} />
                    <Route path="blog" element={<HomePage />} /> 
                    <Route path="blog/:id" element={<BlogDetailPage />} />
                    <Route path="search" element={<SearchPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    
                    {/* BẢO VỆ ROUTE CHECKOUT: YÊU CẦU ĐĂNG NHẬP */}
                     <Route path="order/:id" element={<OrderDetailPage />} /> 
                    <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} /> 
                    <Route path="order-success" element={<ProtectedRoute><div><h1>Đặt hàng thành công!</h1><p>Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đang được xử lý.</p><Link to="/">Tiếp tục mua sắm</Link></div></ProtectedRoute>} />

                    <Route path="privacy-policy" element={<div><h1>Chính sách bảo mật</h1><p>Nội dung chính sách bảo mật...</p></div>} />
                    <Route path="warranty" element={<div><h1>Chính sách bảo hành</h1><p>Nội dung chính sách bảo hành...</p></div>} />
                    <Route path="payment" element={<div><h1>Phương thức thanh toán</h1><p>Nội dung phương thức thanh toán...</p></div>} />
                </Route>

                {/* --- ROUTES CHO ADMIN --- */}
                <Route path="/admin/login" element={<AdminLoginPage />} /> 

                <Route path="/admin/*" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
                    <Route index element={<div><h2 style={{fontSize:'1.8em', textAlign:'center', marginTop:'50px'}}>Chào mừng bạn đến với Admin Dashboard!</h2><p style={{textAlign:'center', fontSize:'1.1em', color:'#666'}}>Chọn một chức năng từ menu bên trái để bắt đầu quản lý.</p></div>} /> 
                    <Route path="products" element={<ProductManagement />} />
                </Route>

                {/* Catch-all route cho 404 Not Found */}
                <Route path="*" element={<div><h1>404 - Không tìm thấy trang</h1><p>Trang bạn đang tìm không tồn tại.</p><Link to="/">Về trang chủ</Link></div>} />
            </Routes>
        </>
    );
}

export default App;
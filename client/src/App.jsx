// src/App.jsx
// Import useNavigate ở đây vì App đã được Router bọc bên ngoài file main.jsx
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { useAuth } from './context/AuthContext';
import Newsletter from './components/layout/Newsletter';
import Footer from './components/layout/Footer';
import ShopPage from './pages/ShopPage';

function App() {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
           <header style={{ background: '#333', color: 'white', padding: '1rem' }}>
                <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: 'auto' }}>
                    <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem' }}>BonsaiGN Shop</Link>
                    <div>
                        <Link to="/cart" style={{ color: 'white', textDecoration: 'none', marginLeft: '1rem' }}>Giỏ hàng</Link>
                        {isAuthenticated ? (
                            <>
                                <span style={{ marginLeft: '1rem' }}>Chào, {user.name}</span>
                                <button onClick={handleLogout} style={{ marginLeft: '1rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1rem' }}>
                                    Đăng xuất
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" style={{ color: 'white', textDecoration: 'none', marginLeft: '1rem' }}>Đăng nhập</Link>
                                <Link to="/register" style={{ color: 'white', textDecoration: 'none', marginLeft: '1rem' }}>Đăng ký</Link>
                            </>
                        )}
                    </div>
                </nav>
            </header>

            <main style={{ minHeight: '60vh' }}>
                <Routes>
                 <Route path="/shop" element={<ShopPage />} />
                    <Route path="/shop/category/:categoryName" element={<ShopPage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Routes>
            </main>

            <Newsletter />
            <Footer />
        </>
    );
}

export default App;
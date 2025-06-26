import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';

// Import các component layout
import Newsletter from './components/layout/Newsletter';
import Footer from './components/layout/Footer';

// Import các Context Hook
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext'; // <-- Import useCart

function App() {
    // Lấy trạng thái từ các Context
    const { isAuthenticated, user, logout } = useAuth();
    const { cartItems } = useCart(); // <-- Lấy dữ liệu giỏ hàng
    const navigate = useNavigate();

    // Tính tổng số lượng sản phẩm trong giỏ hàng
    const totalCartItems = cartItems.reduce((sum, item) => sum + item.qty, 0);

    // Hàm xử lý đăng xuất
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        // Không cần <Router> ở đây vì đã có ở main.jsx
        <>
            <header style={{ background: '#333', color: 'white', padding: '1rem', position: 'sticky', top: 0, zIndex: 100 }}>
                <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: 'auto', padding: '0 20px' }}>
                    
                    {/* Link đến Trang chủ (dùng path="/") */}
                    <Link to="/home" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem' }}>BonsaiGN Shop</Link>
                    
                    {/* Khu vực các link điều hướng */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Link to="/shop" style={{ color: 'white', textDecoration: 'none', marginLeft: '1rem' }}>Cửa Hàng</Link>
                        
                        {/* Link đến Giỏ hàng (chỉ có 1 link duy nhất) */}
                        <Link to="/cart" style={{ color: 'white', textDecoration: 'none', marginLeft: '1rem', position: 'relative', padding: '5px' }}>
                            Giỏ hàng
                            {/* Chỉ hiển thị huy hiệu số lượng khi có sản phẩm */}
                            {totalCartItems > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-10px',
                                    background: 'red',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                }}>{totalCartItems}</span>
                            )}
                        </Link>
                        
                        {/* Hiển thị tùy theo trạng thái đăng nhập */}
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
                    {/* Sửa lại route Trang chủ là "/" */}
                    <Route path="/home" element={<HomePage />} /> 
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/shop/category/:categoryName" element={<ShopPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/cart" element={<CartPage />} />
                </Routes>
            </main>

            <Newsletter />
            <Footer />
        </>
    );
}

export default App;

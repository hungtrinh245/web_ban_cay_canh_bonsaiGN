// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { useAuth } from './context/AuthContext';

function App() {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate(); // Hook này phải được dùng bên trong component được bọc bởi Router

    const handleLogout = () => {
        logout();
        navigate('/login'); // Chuyển hướng về trang login sau khi logout
    };

    // Cần tạo một component riêng để chứa thanh điều hướng
    // vì useNavigate không thể dùng trong cùng component định nghĩa Router
    const Navigation = () => {
         const { isAuthenticated, user, logout } = useAuth();
         const navigate = useNavigate();

         const handleLogout = () => {
            logout();
            navigate('/login');
         };

        return (
             <header style={{ background: '#333', color: 'white', padding: '1rem', marginBottom: '1rem' }}>
                <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1100px', margin: 'auto' }}>
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
        )
    }

    return (
        <Router>
            <Navigation />
            <main style={{ maxWidth: '1100px', margin: 'auto', padding: '0 1rem' }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    {/* Chúng ta sẽ thêm các route cho /cart, /profile sau */}
                </Routes>
            </main>
            <footer style={{ background: '#f4f4f4', textAlign: 'center', padding: '1rem', marginTop: '1rem' }}>
                <p>Copyright &copy; 2025 BonsaiGN Shop</p>
            </footer>
        </Router>
    );
}

export default App;
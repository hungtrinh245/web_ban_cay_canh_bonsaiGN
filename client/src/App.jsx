// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/Homepage';
import ProductDetailPage from './pages/ProductDetailPage';

function App() {
  return (
    <Router>
      <header style={{ background: '#333', color: 'white', padding: '1rem', marginBottom: '1rem' }}>
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1100px', margin: 'auto' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem' }}>BonsaiGN Shop</Link>
          <div>
            <Link to="/cart" style={{ color: 'white', textDecoration: 'none', marginLeft: '1rem' }}>Giỏ hàng</Link>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none', marginLeft: '1rem' }}>Đăng nhập</Link>
          </div>
        </nav>
      </header>

      <main style={{ maxWidth: '1100px', margin: 'auto', padding: '0 1rem' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          {/* Chúng ta sẽ thêm các route cho /cart, /login sau */}
        </Routes>
      </main>

      <footer style={{ background: '#f4f4f4', textAlign: 'center', padding: '1rem', marginTop: '1rem' }}>
        <p>Copyright &copy; 2025 BonsaiGN Shop</p>
      </footer>
    </Router>
  );
}

export default App;
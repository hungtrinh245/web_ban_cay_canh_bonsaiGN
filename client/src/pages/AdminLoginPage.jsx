
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginService } from '../services/authService';

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login: authLogin, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Nếu đã đăng nhập và là admin, chuyển hướng ngay
        if (isAuthenticated && user && user.role === 'admin') {
            navigate('/admin/products'); 
        } else if (isAuthenticated && user && user.role !== 'admin') {
            // Nếu đã đăng nhập nhưng không phải admin, thông báo và chuyển hướng về trang chủ
            alert('Tài khoản này không có quyền truy cập quản trị. Bạn sẽ được chuyển hướng về trang chủ.');
            navigate('/');
        }
    }, [isAuthenticated, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await loginService({ email, password });
            authLogin(data, data.token); // Lưu thông tin user và token vào context
            
            if (data.role === 'admin') {
                navigate('/admin/products'); 
            } else {
                // Nếu tài khoản không phải admin, thông báo và xóa token (nếu có)
                setError('Tài khoản này không có quyền truy cập quản trị. Vui lòng đăng nhập bằng tài khoản Admin hợp lệ.');
                authLogin(null, null); // Xóa context
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        } catch (err) {
            setError(err.message || 'Đăng nhập Admin thất bại.');
        }
    };

    //Style
    const loginContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f0f2f5',
        fontFamily: 'Roboto, sans-serif',
    };

    const loginBoxStyle = {
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
        maxWidth: '450px',
        width: '100%',
        textAlign: 'center',
        border: '1px solid #eee',
    };

    const titleStyle = {
        fontSize: '2em',
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: '30px',
        position: 'relative',
        paddingBottom: '15px',
        '&::after': {
            content: '""',
            width: '60px',
            height: '3px',
            background: '#28a745',
            position: 'absolute',
            bottom: '0',
            left: '50%',
            transform: 'translateX(-50%)',
        }
    };

    const formGroupStyle = {
        marginBottom: '20px',
        textAlign: 'left',
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '8px',
        fontWeight: 'bold',
        color: '#555',
        fontSize: '0.9em',
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '1em',
        boxSizing: 'border-box',
    };

    const submitButtonStyle = {
        width: '100%',
        padding: '15px',
        background: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1.1em',
        fontWeight: 'bold',
        marginTop: '20px',
        transition: 'background-color 0.3s ease, transform 0.2s',
        '&:hover': {
            backgroundColor: '#218838',
            transform: 'translateY(-2px)',
        },
    };

    const errorMessageStyle = {
        color: 'red',
        marginBottom: '15px',
        fontSize: '0.9em',
    };

    const pseudoElementStyle = `
        .admin-login-title::after {
            content: "";
            width: 60px;
            height: 3px;
            background: #28a745;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;

    return (
        <div style={loginContainerStyle}>
            <div style={loginBoxStyle}>
                <h2 style={titleStyle} className="admin-login-title">Đăng nhập Admin</h2>
                {error && <p style={errorMessageStyle}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div style={formGroupStyle}>
                        <label htmlFor="email" style={labelStyle}>Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={inputStyle}
                            required
                        />
                    </div>
                    <div style={formGroupStyle}>
                        <label htmlFor="password" style={labelStyle}>Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                            required
                        />
                    </div>
                    <button type="submit" style={submitButtonStyle}
                        onMouseOver={(e) => Object.assign(e.currentTarget.style, submitButtonStyle['&:hover'])}
                        onMouseOut={(e) => Object.assign(e.currentTarget.style, submitButtonStyle)}
                    >
                        Đăng nhập
                    </button>
                </form>
                <style>{pseudoElementStyle}</style> 
            </div>
        </div>
    );
};

export default AdminLoginPage;
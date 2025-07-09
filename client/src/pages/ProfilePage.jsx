// client/src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // <-- ĐẢM BẢO Link ĐƯỢC IMPORT
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/authService'; 
import { getMyOrders } from '../services/productService'; 

const ProfilePage = () => {
    const { user, token, logout, login } = useAuth(); 
    // Khởi tạo state với giá trị mặc định từ user nếu có
    const [name, setName] = useState(user ? user.name : '');
    const [email, setEmail] = useState(user ? user.email : '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(''); // Thông báo cho người dùng
    const [profileLoading, setProfileLoading] = useState(false); // Loading cho form profile

    // States cho lịch sử đơn hàng
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [ordersError, setOrdersError] = useState(null);

    // Fetch orders when component mounts or token changes
    useEffect(() => {
        if (token) { // Chỉ fetch nếu có token (người dùng đã đăng nhập)
            const fetchOrders = async () => {
                try {
                    setOrdersLoading(true);
                    const userOrders = await getMyOrders(token);
                    setOrders(userOrders);
                } catch (err) {
                    console.error("Lỗi khi tải đơn hàng:", err);
                    setOrdersError(err.message || 'Không thể tải lịch sử đơn hàng.');
                } finally {
                    setOrdersLoading(false);
                }
            };
            fetchOrders();
        } else {
            // Nếu không có token, reset orders và thông báo
            setOrders([]);
            setOrdersLoading(false);
            setOrdersError('Vui lòng đăng nhập để xem lịch sử đơn hàng.');
        }
    }, [token]); // Dependency: chạy lại khi token thay đổi

    // Xử lý cập nhật hồ sơ
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setMessage(''); // Reset thông báo

        if (password !== confirmPassword) {
            setMessage('Mật khẩu xác nhận không khớp!');
            return;
        }

        try {
            setProfileLoading(true);
            const updatedUserData = { name, email };
            if (password) { // Chỉ gửi password nếu người dùng nhập
                updatedUserData.password = password;
            }
            
            const data = await updateProfile(updatedUserData, token);
            login(data, data.token); // Cập nhật AuthContext với thông tin mới (quan trọng để header cập nhật tên)
            setMessage('Cập nhật hồ sơ thành công!');
            // Xóa mật khẩu sau khi cập nhật
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            setMessage(err.message || 'Cập nhật hồ sơ thất bại!');
            console.error("Update profile error:", err);
        } finally {
            setProfileLoading(false);
        }
    };

    // --- CÁC STYLE CHO TRANG PROFILE ---
    const profileContainerStyle = {
        maxWidth: '1200px',
        margin: '40px auto',
        padding: '0 20px',
        fontFamily: 'Roboto, sans-serif',
        color: '#333',
    };

    const pageTitleStyle = {
        fontSize: '2.5em',
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: '30px',
        textAlign: 'center',
        position: 'relative',
        paddingBottom: '15px',
    };

    const pageTitleUnderlineStyle = {
        width: '80px',
        height: '4px',
        background: '#28a745',
        margin: '0 auto',
        position: 'absolute',
        bottom: '0',
        left: '50%',
        transform: 'translateX(-50%)',
    };

    const contentWrapperStyle = {
        display: 'flex',
        gap: '40px',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    };

    const profileFormColumnStyle = {
        flex: '1 1 400px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        padding: '30px',
        border: '1px solid #eee',
    };

    const ordersColumnStyle = {
        flex: '2 1 600px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        padding: '30px',
        border: '1px solid #eee',
    };

    const sectionTitleStyle = {
        fontSize: '1.5em',
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: '25px',
        paddingBottom: '10px',
        borderBottom: '2px solid #ddd',
        marginTop: '0',
    };

    const formGroupStyle = {
        marginBottom: '15px',
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
        color: '#555',
        fontSize: '0.95em',
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '1em',
        boxSizing: 'border-box',
    };

    const updateProfileButtonStyle = {
        width: '100%',
        padding: '12px',
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

    const messageStyle = {
        textAlign: 'center',
        marginTop: '15px',
        padding: '8px',
        borderRadius: '5px',
        fontSize: '0.9em',
        fontWeight: 'bold',
    };

    const successMessageStyle = {
        ...messageStyle,
        background: '#d4edda',
        color: '#155724',
    };

    const errorMessageStyle = {
        ...messageStyle,
        background: '#f8d7da',
        color: '#721c24',
    };

    const orderTableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '20px',
    };

    const orderTableHeaderStyle = {
        background: '#f2f2f2',
        borderBottom: '1px solid #ddd',
        padding: '12px 8px',
        textAlign: 'left',
        fontWeight: 'bold',
        color: '#555',
        fontSize: '0.9em',
    };

    const orderTableRowStyle = {
        borderBottom: '1px solid #eee',
        '&:hover': {
            backgroundColor: '#f9f9f9',
        }
    };

    const orderTableCellLinkStyle = {
        padding: '10px 8px',
        textAlign: 'left',
        color: '#007bff',
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        }
    };

    const orderTableCellStyle = {
        padding: '10px 8px',
        textAlign: 'left',
        color: '#333',
    };

    const noOrdersStyle = {
        textAlign: 'center',
        color: '#777',
        padding: '30px',
        fontSize: '1.1em',
    };


    // Helper functions for hover effects
    const applyHover = (e, hoverStyle) => Object.assign(e.currentTarget.style, hoverStyle);
    const removeHover = (e, baseStyle) => Object.assign(e.currentTarget.style, baseStyle);


    return (
        <div style={profileContainerStyle}>
            <h1 style={pageTitleStyle}>
                Hồ sơ của bạn
                <div style={pageTitleUnderlineStyle}></div>
            </h1>

            <div style={contentWrapperStyle}>
                {/* Cột trái: Cập nhật hồ sơ */}
                <div style={profileFormColumnStyle}>
                    <h2 style={sectionTitleStyle}>Cập nhật thông tin</h2>
                    <form onSubmit={handleUpdateProfile}>
                        {message && (
                            <p style={message.includes('thành công') ? successMessageStyle : errorMessageStyle}>{message}</p>
                        )}
                        <div style={formGroupStyle}>
                            <label htmlFor="profileName" style={labelStyle}>Tên hiển thị</label>
                            <input type="text" id="profileName" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
                        </div>
                        <div style={formGroupStyle}>
                            <label htmlFor="profileEmail" style={labelStyle}>Email</label>
                            <input type="email" id="profileEmail" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} disabled /> {/* Email thường không cho sửa */}
                        </div>
                        <div style={formGroupStyle}>
                            <label htmlFor="profilePassword" style={labelStyle}>Mật khẩu mới (để trống nếu không đổi)</label>
                            <input type="password" id="profilePassword" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} placeholder="Nhập mật khẩu mới" />
                        </div>
                        <div style={formGroupStyle}>
                            <label htmlFor="confirmPassword" style={labelStyle}>Xác nhận mật khẩu mới</label>
                            <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={inputStyle} placeholder="Xác nhận mật khẩu mới" />
                        </div>
                        <button
                            type="submit"
                            style={updateProfileButtonStyle}
                            onMouseOver={(e) => applyHover(e, updateProfileButtonStyle['&:hover'])}
                            onMouseOut={(e) => removeHover(e, updateProfileButtonStyle)}
                            disabled={profileLoading}
                        >
                            {profileLoading ? 'Đang cập nhật...' : 'CẬP NHẬT HỒ SƠ'}
                        </button>
                    </form>
                </div>

                {/* Cột phải: Lịch sử đơn hàng */}
                <div style={ordersColumnStyle}>
                    <h2 style={sectionTitleStyle}>Lịch sử đơn hàng</h2>
                    {ordersLoading ? (
                        <p style={noOrdersStyle}>Đang tải đơn hàng...</p>
                    ) : ordersError ? (
                        <p style={{...noOrdersStyle, color: 'red'}}>{ordersError}</p>
                    ) : orders.length === 0 ? (
                        <p style={noOrdersStyle}>Bạn chưa có đơn hàng nào.</p>
                    ) : (
                        <table style={orderTableStyle}>
                            <thead>
                                <tr>
                                    <th style={orderTableHeaderStyle}>Mã Đơn hàng</th>
                                    <th style={orderTableHeaderStyle}>Ngày Đặt</th>
                                    <th style={orderTableHeaderStyle}>Tổng Tiền</th>
                                    <th style={orderTableHeaderStyle}>Thanh Toán</th>
                                    <th style={orderTableHeaderStyle}>Giao Hàng</th>
                                    <th style={orderTableHeaderStyle}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id} style={orderTableRowStyle}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = orderTableRowStyle['&:hover'].backgroundColor}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <td style={orderTableCellLinkStyle}>
                                            <Link to={`/order/${order._id}`}>
                                                {order._id.slice(-6).toUpperCase()}
                                            </Link>
                                        </td>
                                        <td style={orderTableCellStyle}>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                                        <td style={orderTableCellStyle}>{order.totalPrice.toLocaleString('vi-VN')} VNĐ</td>
                                        <td style={orderTableCellStyle}>
                                            {order.isPaid ? 
                                                <span style={{color: 'green', fontWeight: 'bold'}}>Đã thanh toán</span> : 
                                                <span style={{color: 'orange', fontWeight: 'bold'}}>Chờ TT</span>
                                            }
                                        </td>
                                        <td style={orderTableCellStyle}>
                                            {order.isDelivered ? 
                                                <span style={{color: 'green', fontWeight: 'bold'}}>Đã giao</span> : 
                                                <span style={{color: 'orange', fontWeight: 'bold'}}>Đang xử lý</span>
                                            }
                                        </td>
                                        <td style={orderTableCellLinkStyle}>
                                            <Link to={`/order/${order._id}`}>Chi tiết</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
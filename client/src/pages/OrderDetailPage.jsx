// client/src/pages/OrderDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom'; // Import useLocation
import { useAuth } from '../context/AuthContext';
import { getOrderById } from '../services/productService'; 

const OrderDetailPage = () => {
    const { id } = useParams(); // Lấy ID đơn hàng từ URL
    const { user, token, isAuthenticated, loading: authLoading } = useAuth(); 
    const location = useLocation(); // Lấy state từ navigate

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            // Ưu tiên lấy từ navigate state nếu có (dùng cho sau khi đặt hàng thành công)
            if (location.state && location.state.order && location.state.order._id === id) {
                setOrder(location.state.order);
                setLoading(false);
                return;
            }

            // Nếu không có trong state, hoặc state không khớp ID, thì fetch từ API
            if (!token) { 
                setError('Vui lòng đăng nhập để xem chi tiết đơn hàng.');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const orderData = await getOrderById(id, token);
                setOrder(orderData);
            } catch (err) {
                console.error("Lỗi khi tải chi tiết đơn hàng:", err);
                setError(err.message || 'Không thể tải chi tiết đơn hàng.');
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated && !authLoading) { 
            fetchOrder();
        } else if (!isAuthenticated && !authLoading && !location.state?.order) {
            // Nếu không xác thực, không loading auth, và không có order trong state,
            // thì thông báo lỗi và không fetch
            setError('Bạn cần đăng nhập để xem chi tiết đơn hàng này.');
            setLoading(false);
        }
        window.scrollTo(0, 0);
    }, [id, isAuthenticated, authLoading, token, location.state]); // Dependencies


    // --- CÁC STYLE CHO TRANG CHI TIẾT ĐƠN HÀNG ---
    const pageContainerStyle = {
        maxWidth: '900px',
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

    const sectionStyle = {
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        padding: '30px',
        marginBottom: '30px',
        border: '1px solid #eee',
    };

    const sectionTitleStyle = {
        fontSize: '1.5em',
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: '20px',
        paddingBottom: '10px',
        borderBottom: '2px solid #ddd',
        marginTop: '0',
    };

    const infoRowStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
        fontSize: '1em',
        color: '#555',
    };

    const orderItemTableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
    };

    const tableHeaderCell = {
        background: '#f2f2f2',
        border: '1px solid #ddd',
        padding: '10px 8px',
        textAlign: 'left',
        fontWeight: 'bold',
        color: '#555',
        fontSize: '0.9em',
    };

    const tableCell = {
        border: '1px solid #eee',
        padding: '8px',
        textAlign: 'left',
        fontSize: '0.9em',
        verticalAlign: 'top', 
    };

    const itemImageStyle = {
        width: '60px',
        height: '60px',
        objectFit: 'cover',
        borderRadius: '4px',
        marginRight: '10px',
    };

    const totalPriceStyle = {
        fontSize: '1.4em',
        fontWeight: 'bold',
        color: '#28a745',
        textAlign: 'right',
        marginTop: '20px',
        paddingTop: '15px',
        borderTop: '1px dashed #ccc',
    };


    if (loading) return <p style={{ textAlign: 'center', padding: '50px' }}>Đang tải chi tiết đơn hàng...</p>;
    if (error) return <p style={{ color: 'red', textAlign: 'center', padding: '50px' }}>{error}</p>;
    if (!order) return <p style={{ textAlign: 'center', padding: '50px' }}>Không tìm thấy đơn hàng hoặc bạn không có quyền xem.</p>;

    return (
        <div style={pageContainerStyle}>
            <h1 style={pageTitleStyle}>
                Chi tiết đơn hàng #{order._id.slice(-6).toUpperCase()}
                <div style={pageTitleUnderlineStyle}></div>
            </h1>

            {/* Thông tin đơn hàng chung */}
            <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>Thông tin đơn hàng</h2>
                <div style={infoRowStyle}>
                    <span>Mã đơn hàng:</span>
                    <strong>{order._id}</strong>
                </div>
                <div style={infoRowStyle}>
                    <span>Ngày đặt:</span>
                    <span>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
                {order.user && ( // Hiển thị thông tin người dùng nếu có
                    <div style={infoRowStyle}>
                        <span>Người đặt:</span>
                        <span>{order.user.name} ({order.user.email})</span>
                    </div>
                )}
                <div style={infoRowStyle}>
                    <span>Phương thức thanh toán:</span>
                    <span>{order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng'}</span>
                </div>
                <div style={infoRowStyle}>
                    <span>Trạng thái thanh toán:</span>
                    <span style={{ color: order.isPaid ? 'green' : 'orange', fontWeight: 'bold' }}>
                        {order.isPaid ? `Đã thanh toán vào ${new Date(order.paidAt).toLocaleDateString('vi-VN')}` : 'Chưa thanh toán'}
                    </span>
                </div>
                <div style={infoRowStyle}>
                    <span>Trạng thái giao hàng:</span>
                    <span style={{ color: order.isDelivered ? 'green' : 'orange', fontWeight: 'bold' }}>
                        {order.isDelivered ? `Đã giao vào ${new Date(order.deliveredAt).toLocaleDateString('vi-VN')}` : 'Đang xử lý'}
                    </span>
                </div>
                {order.notes && (
                    <div style={infoRowStyle}>
                        <span>Ghi chú:</span>
                        <span>{order.notes}</span>
                    </div>
                )}
            </div>

            {/* Thông tin giao hàng */}
            <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>Địa chỉ giao hàng</h2>
                <p><strong>Họ và tên:</strong> {order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p><strong>Địa chỉ:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}</p>
                <p><strong>Số điện thoại:</strong> {order.shippingAddress.phone}</p>
                <p><strong>Email:</strong> {order.shippingAddress.email}</p>
                {order.shippingAddress.company && <p><strong>Công ty:</strong> {order.shippingAddress.company}</p>}
                {order.shippingAddress.postalCode && <p><strong>Mã bưu điện:</strong> {order.shippingAddress.postalCode}</p>}
                <p><strong>Quốc gia:</strong> {order.shippingAddress.country}</p>
            </div>

            {/* Danh sách sản phẩm trong đơn hàng */}
            <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>Sản phẩm trong đơn hàng</h2>
                <table style={orderItemTableStyle}>
                    <thead>
                        <tr>
                            <th style={{ ...tableHeaderCell, width: '80px' }}>Ảnh</th>
                            <th style={tableHeaderCell}>Tên sản phẩm</th>
                            <th style={tableHeaderCell}>Số lượng</th>
                            <th style={tableHeaderCell}>Giá/SP</th>
                            <th style={tableHeaderCell}>Tổng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.orderItems.map((item, index) => (
                            <tr key={item.product || index}>
                                <td style={tableCell}>
                                    <img src={item.image || 'https://via.placeholder.com/60?text=No+Image'} alt={item.name} style={itemImageStyle} />
                                </td>
                                <td style={tableCell}>
                                    <Link to={`/products/${item.product}`} style={{ textDecoration: 'none', color: '#007bff' }}>{item.name}</Link>
                                </td>
                                <td style={tableCell}>{item.qty}</td>
                                <td style={tableCell}>{item.price.toLocaleString('vi-VN')} VNĐ</td>
                                <td style={{ ...tableCell, fontWeight: 'bold' }}>{(item.qty * item.price).toLocaleString('vi-VN')} VNĐ</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Tổng kết đơn hàng */}
            <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>Tổng kết</h2>
                <div style={infoRowStyle}>
                    <span>Tổng tiền sản phẩm:</span>
                    <span>{order.itemsPrice.toLocaleString('vi-VN')} VNĐ</span>
                </div>
                <div style={infoRowStyle}>
                    <span>Phí vận chuyển:</span>
                    <span>{order.shippingPrice === 0 ? 'Miễn phí' : order.shippingPrice.toLocaleString('vi-VN') + ' VNĐ'}</span>
                </div>
                {order.taxPrice > 0 && (
                    <div style={infoRowStyle}>
                        <span>Thuế:</span>
                        <span>{order.taxPrice.toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                )}
                <div style={totalPriceStyle}>
                    Tổng cộng: {order.totalPrice.toLocaleString('vi-VN')} VNĐ
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
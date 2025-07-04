// client/src/pages/CheckoutPage.jsx
import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
// import { placeOrder } from '../services/orderService'; // Sẽ dùng khi có API đặt hàng

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cartItems, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();

    // States cho thông tin giao hàng & thanh toán
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [company, setCompany] = useState('');
    const [country, setCountry] = useState('Việt Nam'); // Mặc định Việt Nam
    const [address, setAddress] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const [createAccount, setCreateAccount] = useState(false);
    const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false);
    const [notes, setNotes] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Logic tính toán giảm giá (dù không hiển thị input trên UI này)
    const [discountAmount] = useState(0); // Giả định 0 cho trang này

    // Tính toán tổng tiền và phí vận chuyển
    const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
    const shippingFee = subtotal > 500000 ? 0 : 30000;
    let finalTotal = subtotal + shippingFee - discountAmount;
    if (finalTotal < 0) finalTotal = 0;

    // Redirect nếu giỏ hàng trống hoặc pre-fill thông tin
    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/cart');
            return; // Quan trọng: return để dừng useEffect nếu redirect
        }
        if (isAuthenticated && user) {
            setEmail(user.email || ''); // Thêm || '' để tránh undefined
            if (user.name) {
                const nameParts = user.name.split(' ');
                setLastName(nameParts.pop() || '');
                setFirstName(nameParts.join(' ') || '');
            }
        }
    }, [cartItems, navigate, isAuthenticated, user]);


    // --- ĐỊNH NGHĨA TẤT CẢ CÁC BIẾN STYLE TẠI ĐÂY ---
    const checkoutContainerStyle = {
        maxWidth: '1200px',
        margin: '40px auto',
        padding: '0 20px',
        fontFamily: 'Roboto, sans-serif',
        color: '#333',
    };

    const pageTitleStyle = { // Style cho tiêu đề trang "Thanh toán"
        fontSize: '2.8em',
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: '40px',
        textAlign: 'center',
        position: 'relative',
        paddingBottom: '15px',
    };

    const pageTitleUnderlineStyle = { // Style cho đường gạch dưới tiêu đề trang
        width: '80px',
        height: '4px',
        background: '#28a745',
        margin: '0 auto',
        position: 'absolute',
        bottom: '0',
        left: '50%',
        transform: 'translateX(-50%)',
    };

    const mainContentWrapperStyle = {
        display: 'flex',
        gap: '40px',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    };

    const formColumnStyle = {
        flex: '1.5 1 550px',
        padding: '0',
    };

    const orderSummaryColumnStyle = {
        flex: '1 1 350px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        padding: '30px',
        height: 'fit-content',
        position: 'sticky',
        top: '120px',
        border: '1px solid #eee',
    };

    const sectionStyle = {
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        padding: '30px',
        marginBottom: '30px',
        border: '1px solid #eee',
    };

    const sectionTitleStyle = { // Style cho tiêu đề từng phần trong form (VD: "Thông tin thanh toán")
        fontSize: '1.5em',
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: '20px',
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
        padding: '12px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '1em',
        boxSizing: 'border-box',
    };

    const selectStyle = {
        ...inputStyle,
        background: 'white',
        cursor: 'pointer',
    };

    const checkboxGroupStyle = {
        marginTop: '25px',
        marginBottom: '25px',
    };

    const checkboxItemStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
        cursor: 'pointer',
        fontSize: '0.95em',
        color: '#555',
    };

    const checkboxInputStyle = {
        marginRight: '10px',
        transform: 'scale(1.2)',
    };

    const summaryListTitleStyle = {
        fontSize: '1em',
        fontWeight: 'bold',
        color: '#555',
        paddingBottom: '10px',
        borderBottom: '1px solid #eee',
        marginBottom: '15px',
    };

    const summaryItemRowStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '8px',
        fontSize: '0.95em',
        color: '#333',
    };

    const summaryTotalsDividerStyle = {
        borderTop: '1px dashed #ccc',
        paddingTop: '15px',
        marginTop: '15px',
        marginBottom: '15px',
    };

    const summaryRowStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
        fontSize: '1.1em',
        color: '#555',
    };

    const summaryTotalRowStyle = {
        ...summaryRowStyle,
        marginTop: '15px',
        paddingTop: '15px',
        borderTop: '2px solid #28a745',
        fontSize: '1.4em',
        fontWeight: 'bold',
        color: '#28a745',
    };

    const placeOrderButtonStyle = {
        width: '100%',
        padding: '18px',
        background: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1.2em',
        fontWeight: 'bold',
        marginTop: '30px',
        transition: 'background-color 0.3s ease, transform 0.2s',
        '&:hover': {
            backgroundColor: '#218838',
            transform: 'translateY(-2px)',
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
    };

    const errorStyle = {
        color: 'red',
        marginBottom: '15px',
        textAlign: 'center',
        fontSize: '0.9em',
    };

    const disclaimerTextStyle = {
        fontSize: '0.85em',
        color: '#777',
        marginTop: '20px',
        textAlign: 'center',
        lineHeight: '1.5',
    };

    // Helper functions for hover effects
    const applyHover = (e, hoverStyle) => Object.assign(e.currentTarget.style, hoverStyle);
    const removeHover = (e, baseStyle) => Object.assign(e.currentTarget.style, baseStyle);


    // --- Hàm xử lý đặt hàng (bọc trong useCallback) ---
    const handleSubmitOrder = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (cartItems.length === 0) {
            setError('Giỏ hàng trống, không thể đặt hàng.');
            setLoading(false);
            return;
        }

        if (!firstName || !lastName || !address || !city || !phone || !email) {
            setError('Vui lòng điền đầy đủ các trường bắt buộc (Họ, Tên, Địa chỉ, Tỉnh/TP, SĐT, Email).');
            setLoading(false);
            return;
        }
        
        try {
            const orderData = {
                orderItems: cartItems.map(item => ({
                    product: item._id, 
                    name: item.name,
                    image: item.images && item.images.length > 0 ? item.images[0] : 'no-image.jpg',
                    qty: item.qty,
                    price: item.price,
                })),
                shippingAddress: {
                    firstName,
                    lastName,
                    company,
                    country,
                    address,
                    postalCode,
                    city,
                    phone,
                    email,
                },
                paymentMethod: 'cod', // Tạm thời mặc định COD
                itemsPrice: subtotal,
                shippingPrice: shippingFee,
                totalPrice: finalTotal,
                notes,
                createAccount, // Thông tin tạo tài khoản
                shipToDifferentAddress, // Thông tin giao hàng địa chỉ khác
                userId: isAuthenticated ? user._id : null, // Gửi userId nếu đăng nhập
            };

            // TODO: GỌI API ĐẶT HÀNG THỰC TẾ Ở ĐÂY
            // const response = await placeOrder(orderData); // placeOrder là hàm service mới
            // console.log("Order placed successfully:", response);

            alert('Đặt hàng thành công! Cảm ơn bạn đã mua sắm.');
            clearCart();
            navigate('/order-success');

        } catch (err) {
            console.error("Lỗi khi đặt hàng:", err);
            setError('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    }, [
        cartItems,
        firstName,
        lastName,
        company,
        country,
        address,
        postalCode,
        city,
        phone,
        email,
        createAccount,
        shipToDifferentAddress,
        notes,
        subtotal,
        shippingFee,
        finalTotal,
        isAuthenticated,
        user,
        clearCart,
        navigate,
    ]); // Dependencies cho useCallback


    return (
        <div style={checkoutContainerStyle}>
            <h1 style={pageTitleStyle}>
                Thanh toán
                <div style={pageTitleUnderlineStyle}></div>
            </h1>

            {error && <p style={errorStyle}>{error}</p>}

            <form onSubmit={handleSubmitOrder}>
                <div style={mainContentWrapperStyle}>
                    {/* Cột trái: Thông tin thanh toán */}
                    <div style={formColumnStyle}>
                        <div style={sectionStyle}> {/* Hộp cho thông tin thanh toán */}
                            <h2 style={sectionTitleStyle}>Thông tin thanh toán</h2>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div style={{ ...formGroupStyle, flex: 1 }}>
                                    <label htmlFor="firstName" style={labelStyle}>Họ <span style={{color: 'red'}}>*</span></label>
                                    <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={inputStyle} required />
                                </div>
                                <div style={{ ...formGroupStyle, flex: 1 }}>
                                    <label htmlFor="lastName" style={labelStyle}>Tên <span style={{color: 'red'}}>*</span></label>
                                    <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} style={inputStyle} required />
                                </div>
                            </div>
                           
                            <div style={formGroupStyle}>
                                <label htmlFor="country" style={labelStyle}>Quốc gia <span style={{color: 'red'}}>*</span></label>
                                <select id="country" value={country} onChange={(e) => setCountry(e.target.value)} style={selectStyle} required>
                                    <option value="Việt Nam">Việt Nam</option>
                                    {/* Thêm các quốc gia khác nếu cần */}
                                </select>
                            </div>
                            <div style={formGroupStyle}>
                                <label htmlFor="address" style={labelStyle}>Địa chỉ <span style={{color: 'red'}}>*</span></label>
                                <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} style={inputStyle} placeholder="Số nhà, tên đường, thôn, xóm..." required />
                            </div>
                            <div style={{ display: 'flex', gap: '20px' }}>
                               
                                <div style={{ ...formGroupStyle, flex: 1 }}>
                                    <label htmlFor="city" style={labelStyle}>Tỉnh / Thành phố <span style={{color: 'red'}}>*</span></label>
                                    <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} style={inputStyle} required />
                                </div>
                            </div>
                            <div style={formGroupStyle}>
                                <label htmlFor="phone" style={labelStyle}>Số điện thoại <span style={{color: 'red'}}>*</span></label>
                                <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} required />
                            </div>
                            <div style={formGroupStyle}>
                                <label htmlFor="email" style={labelStyle}>Địa chỉ email <span style={{color: 'red'}}>*</span></label>
                                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
                            </div>
                        </div> {/* End Thông tin thanh toán section */}

                        {/* Các checkboxes */}
                        <div style={checkboxGroupStyle}>
                            <label style={checkboxItemStyle}>
                                <input type="checkbox" checked={createAccount} onChange={(e) => setCreateAccount(e.target.checked)} style={checkboxInputStyle} />
                                Tạo tài khoản mới?
                            </label>
                          
                        </div>

                        {/* Phần ghi chú đơn hàng */}
                        <div style={sectionStyle}> {/* Hộp cho ghi chú */}
                            <h2 style={sectionTitleStyle}>Ghi chú đơn hàng (tùy chọn)</h2>
                            <textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                style={{ ...inputStyle, minHeight: '100px' }}
                                placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                            />
                        </div>
                    </div>

                    {/* Cột phải: Đơn hàng của bạn */}
                    <div style={orderSummaryColumnStyle}>
                        <h2 style={sectionTitleStyle}>Đơn hàng của bạn</h2>
                        {/* Headers của bảng tóm tắt sản phẩm trong cột này */}
                        <div style={{
                            display: 'flex', justifyContent: 'space-between', paddingBottom: '10px',
                            borderBottom: '1px solid #eee', marginBottom: '15px', fontWeight: 'bold', fontSize: '1em', color: '#555'
                        }}>
                            <span style={{flex: 2, textAlign: 'left'}}>SẢN PHẨM</span>
                            <span style={{flex: 1, textAlign: 'right'}}>TỔNG CỘNG</span>
                        </div>
                        {/* Danh sách sản phẩm rút gọn */}
                        {cartItems.map((item, index) => (
                            <div key={item._id || item.id} style={summaryItemRowStyle}>
                                <span style={{textAlign: 'left', flex: 2, color: '#333'}}>{item.name} × {item.qty}</span>
                                <span style={{textAlign: 'right', flex: 1, fontWeight: 'bold', color: '#555'}}>{(item.qty * item.price || 0).toLocaleString('vi-VN')} VNĐ</span>
                            </div>
                        ))}
                        {/* Các dòng tổng phụ */}
                        <div style={summaryTotalsDividerStyle}></div> {/* Đường gạch ngang mảnh */}
                        <div style={summaryRowStyle}>
                            <span>Tổng phụ:</span>
                            <span style={{ fontWeight: 'bold' }}>{subtotal.toLocaleString('vi-VN')} VNĐ</span>
                        </div>
                        <div style={summaryRowStyle}>
                            <span>Phí vận chuyển:</span>
                            <span style={{ fontWeight: 'bold', color: shippingFee === 0 ? '#28a745' : '#555' }}>
                                {shippingFee === 0 ? 'Giao hàng miễn phí' : shippingFee.toLocaleString('vi-VN') + ' VNĐ'}
                            </span>
                        </div>
                        {/* Nếu có logic giảm giá, sẽ hiển thị ở đây */}
                        {/* <div style={{...summaryRowStyle, color: '#28a745', fontWeight: 'bold'}}>
                            <span>Giảm giá:</span>
                            <span>- {discountAmount.toLocaleString('vi-VN')} VNĐ</span>
                        </div> */}
                        <div style={summaryTotalRowStyle}>
                            <span>Tổng cộng:</span>
                            <span>{finalTotal.toLocaleString('vi-VN')} VNĐ</span>
                        </div>
                        
                        <button 
                            type="submit" 
                            style={placeOrderButtonStyle}
                            onMouseOver={(e) => applyHover(e, placeOrderButtonStyle['&:hover'])}
                            onMouseOut={(e) => removeHover(e, placeOrderButtonStyle)}
                            disabled={loading}
                        >
                            {loading ? 'Đang xử lý...' : 'ĐẶT HÀNG'}
                            {loading && <div style={{marginLeft: '10px', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', width: '16px', height: '16px', animation: 'spin 1s linear infinite'}}></div>}
                        </button>
                        
                        <p style={disclaimerTextStyle}>
                            Rất tiếc, có vẻ như không có phương thức thanh toán nào phù hợp với khu vực bạn hiện tại của bạn. Vui lòng liên hệ với chúng tôi nếu bạn cần hỗ trợ sắp xếp phương án thay thế.
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CheckoutPage;
// client/src/pages/CheckoutPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; 
// THÊM CÁC HÀM MỚI TỪ SERVICE
import { createOrder, getActiveCoupons, applyCoupon } from '../services/productService'; 
// THÊM CÁC COMPONENT TỪ ANT DESIGN
import { Input, Button, List, Tag, Typography, message as AntMessage, Spin } from 'antd';

const { Title, Text } = Typography;

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cartItems, clearCart } = useCart(); 
    const { user, isAuthenticated, token } = useAuth(); 

    // States cho thông tin giao hàng & thanh toán
    const [firstName, setFirstName] = useState(user ? (user.name ? user.name.split(' ')[0] : '') : ''); 
    const [lastName, setLastName] = useState(user ? (user.name ? user.name.split(' ').slice(1).join(' ') : '') : ''); 
    const [company, setCompany] = useState('');     
    const [country, setCountry] = useState('Việt Nam'); 
    const [address, setAddress] = useState('');     
    const [postalCode, setPostalCode] = useState(''); 
    const [city, setCity] = useState(''); 
    const [phone, setPhone] = useState(''); 
    const [email, setEmail] = useState(user ? user.email : '');

    const [createAccount, setCreateAccount] = useState(false); 
    const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false); 
    const [notes, setNotes] = useState(''); 

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [paymentMethod, setPaymentMethod] = useState('cod'); 

    // --- STATE MỚI CHO TÍNH NĂNG MÃ ƯU ĐÃI ---
    const [couponCode, setCouponCode] = useState('');
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const [loadingCoupons, setLoadingCoupons] = useState(true);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0); // State này giờ sẽ được cập nhật động

    // Tính toán lại giá trị đơn hàng
    const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
    const shippingFee = subtotal > 500000 ? 0 : 30000;
    let finalTotal = subtotal + shippingFee - discountAmount; 
    if (finalTotal < 0) finalTotal = 0; 

    // Effect để lấy thông tin người dùng và kiểm tra giỏ hàng
    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/cart'); 
            return; 
        }
        if (isAuthenticated && user) {
            setEmail(user.email || ''); 
            if (user.name) {
                const nameParts = user.name.split(' ');
                setLastName(nameParts.pop() || '');
                setFirstName(nameParts.join(' ') || '');
            }
        }
    }, [cartItems, navigate, isAuthenticated, user]);

    // --- EFFECT MỚI: LẤY DANH SÁCH MÃ ƯU ĐÃI KHI TẢI TRANG ---
    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                setLoadingCoupons(true);
                const coupons = await getActiveCoupons();
                setAvailableCoupons(coupons);
            } catch (error) {
                console.error("Không thể tải danh sách mã ưu đãi:", error);
                // Không cần hiển thị lỗi cho người dùng vì đây không phải tính năng cốt lõi
            } finally {
                setLoadingCoupons(false);
            }
        };
        fetchCoupons();
    }, []);

    // --- HÀM MỚI: XỬ LÝ ÁP DỤNG MÃ ƯU ĐÃI ---
    const handleApplyCoupon = async () => {
        if (!couponCode) {
            AntMessage.warning('Vui lòng nhập mã ưu đãi.');
            return;
        }
        try {
            // Gọi API để xác thực và lấy thông tin giảm giá
            const response = await applyCoupon(couponCode, subtotal);
            setAppliedCoupon(response.coupon);
            setDiscountAmount(response.discountAmount);
            AntMessage.success(`Áp dụng mã "${response.coupon.code}" thành công!`);
        } catch (error) {
            setAppliedCoupon(null);
            setDiscountAmount(0); // Reset giảm giá nếu mã không hợp lệ
            AntMessage.error(error.message || 'Mã không hợp lệ hoặc không thể áp dụng.');
        }
    };

    // --- HÀM MỚI: TỰ ĐỘNG ĐIỀN MÃ KHI BẤM VÀO DANH SÁCH ---
    const handleApplyFromList = (code) => {
        setCouponCode(code);
        AntMessage.info(`Đã chọn mã "${code}". Bấm "Áp dụng" để xác nhận.`);
    };

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
            setError('Vui lòng điền đầy đủ các trường bắt buộc.');
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
                shippingAddress: { firstName, lastName, company, country, address, postalCode, city, phone, email },
                paymentMethod, 
                itemsPrice: subtotal,
                shippingPrice: shippingFee,
                taxPrice: 0, // Thêm taxPrice nếu cần
                totalPrice: finalTotal,
                notes,
                createAccount,
                shipToDifferentAddress,
                userId: isAuthenticated ? user._id : null, 
                // Thêm thông tin mã giảm giá vào đơn hàng để lưu trữ
                couponCode: appliedCoupon ? appliedCoupon.code : null,
                discount: discountAmount,
            };

            const response = await createOrder(orderData, token); 
            clearCart(); 
            navigate(`/order/${response._id}`, { state: { order: response } }); 

        } catch (err) {
            console.error("Lỗi khi đặt hàng:", err);
            setError(err.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    }, [
        cartItems, firstName, lastName, company, country, address, postalCode, city, phone, email,
        paymentMethod, createAccount, shipToDifferentAddress, notes, subtotal, shippingFee, finalTotal,
        isAuthenticated, user, clearCart, navigate, token, appliedCoupon, discountAmount
    ]); 

    // --- Định nghĩa các biến style (giữ nguyên) ---
    const checkoutContainerStyle = { maxWidth: '1200px', margin: '40px auto', padding: '0 20px', fontFamily: 'Roboto, sans-serif', color: '#333' };
    const pageTitleStyle = { fontSize: '2.8em', fontWeight: 'bold', color: '#2c3e50', marginBottom: '40px', textAlign: 'center', position: 'relative', paddingBottom: '15px' };
    const pageTitleUnderlineStyle = { width: '80px', height: '4px', background: '#28a745', margin: '0 auto', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' };
    const mainContentWrapperStyle = { display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'flex-start' };
    const formColumnStyle = { flex: '1.5 1 550px', padding: '0' };
    const orderSummaryColumnStyle = { flex: '1 1 350px', background: 'white', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', padding: '30px', height: 'fit-content', position: 'sticky', top: '120px', border: '1px solid #eee' };
    const sectionStyle = { background: 'white', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', padding: '30px', marginBottom: '30px', border: '1px solid #eee' };
    const sectionTitleStyle = { fontSize: '1.5em', fontWeight: 'bold', color: '#2c3e50', marginBottom: '20px', paddingBottom: '10px', borderBottom: '2px solid #ddd', marginTop: '0' };
    const formGroupStyle = { marginBottom: '15px' };
    const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555', fontSize: '0.95em' };
    const inputStyle = { width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1em', boxSizing: 'border-box' };
    const selectStyle = { ...inputStyle, background: 'white', cursor: 'pointer' };
    const radioGroupStyle = { display: 'flex', flexDirection: 'column', gap: '10px' };
    const radioItemStyle = { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 15px', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.2s, border-color 0.2s' };
    const radioCheckedStyle = { background: '#e9f5e9', borderColor: '#28a745' };
    const summaryItemRowStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.95em', color: '#333' };
    const summaryTotalsDividerStyle = { borderTop: '1px dashed #ccc', paddingTop: '15px', marginTop: '15px', marginBottom: '15px' };
    const summaryRowStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '1.1em', color: '#555' };
    const summaryTotalRowStyle = { ...summaryRowStyle, marginTop: '15px', paddingTop: '15px', borderTop: '2px solid #28a745', fontSize: '1.4em', fontWeight: 'bold', color: '#28a745' };
    const placeOrderButtonStyle = { width: '100%', padding: '18px', background: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.2em', fontWeight: 'bold', marginTop: '30px', transition: 'background-color 0.3s ease, transform 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' };
    const errorStyle = { color: 'red', marginBottom: '15px', textAlign: 'center', fontSize: '0.9em' };
    const disclaimerTextStyle = { fontSize: '0.85em', color: '#777', marginTop: '20px', textAlign: 'center', lineHeight: '1.5' };
    const couponSectionStyle = { marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' };

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
                        <div style={sectionStyle}>
                            <h2 style={sectionTitleStyle}>Thông tin thanh toán</h2>
                            {/* ... các input thông tin ... */}
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
                                <label htmlFor="address" style={labelStyle}>Địa chỉ <span style={{color: 'red'}}>*</span></label>
                                <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} style={inputStyle} placeholder="Số nhà, tên đường..." required />
                            </div>
                             <div style={{ display: 'flex', gap: '20px' }}>
                                <div style={{ ...formGroupStyle, flex: 1 }}>
                                    <label htmlFor="city" style={labelStyle}>Tỉnh / Thành phố <span style={{color: 'red'}}>*</span></label>
                                    <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} style={inputStyle} required />
                                </div>
                                <div style={{ ...formGroupStyle, flex: 1 }}>
                                    <label htmlFor="phone" style={labelStyle}>Số điện thoại <span style={{color: 'red'}}>*</span></label>
                                    <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} required />
                                </div>
                            </div>
                            <div style={formGroupStyle}>
                                <label htmlFor="email" style={labelStyle}>Địa chỉ email <span style={{color: 'red'}}>*</span></label>
                                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
                            </div>
                        </div>

                        <div style={sectionStyle}>
                            <h2 style={sectionTitleStyle}>Phương thức thanh toán</h2>
                            {/* ... các radio button thanh toán ... */}
                            <div style={radioGroupStyle}>
                                <label style={{ ...radioItemStyle, ...(paymentMethod === 'cod' ? radioCheckedStyle : {}) }}>
                                    <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} />
                                    Thanh toán khi nhận hàng (COD)
                                </label>
                                <label style={{ ...radioItemStyle, ...(paymentMethod === 'bank_transfer' ? radioCheckedStyle : {}) }}>
                                    <input type="radio" name="paymentMethod" value="bank_transfer" checked={paymentMethod === 'bank_transfer'} onChange={(e) => setPaymentMethod(e.target.value)} />
                                    Chuyển khoản ngân hàng
                                </label>
                            </div>
                        </div>

                        <div style={sectionStyle}>
                            <h2 style={sectionTitleStyle}>Ghi chú đơn hàng (tùy chọn)</h2>
                            <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} style={{ ...inputStyle, minHeight: '100px' }} placeholder="Ghi chú về đơn hàng..." />
                        </div>
                    </div>

                    {/* Cột phải: Đơn hàng của bạn */}
                    <div style={orderSummaryColumnStyle}>
                        <h2 style={sectionTitleStyle}>Đơn hàng của bạn</h2>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #eee', marginBottom: '15px', fontWeight: 'bold' }}>
                            <span>SẢN PHẨM</span>
                            <span>TỔNG CỘNG</span>
                        </div>
                        {cartItems.map((item) => (
                            <div key={item._id} style={summaryItemRowStyle}>
                                <span>{item.name} × {item.qty}</span>
                                <span style={{ fontWeight: 'bold' }}>{(item.qty * item.price).toLocaleString('vi-VN')} VNĐ</span>
                            </div>
                        ))}
                        
                        {/* --- PHẦN MÃ ƯU ĐÃI MỚI --- */}
                        <div style={couponSectionStyle}>
                            <Title level={5}>Mã ưu đãi</Title>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                                <Input placeholder="Nhập mã" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} />
                                <Button type="primary" onClick={handleApplyCoupon}>Áp dụng</Button>
                            </div>
                            <List
                                size="small"
                                loading={loadingCoupons}
                                dataSource={availableCoupons}
                                renderItem={item => (
                                    <List.Item
                                        actions={[ <Button type="link" onClick={() => handleApplyFromList(item.code)}>Áp dụng</Button> ]}
                                    >
                                        <List.Item.Meta
                                            avatar={<Tag color="green">{item.code}</Tag>}
                                            title={<Text strong>{`Giảm ${item.type === 'percentage' ? `${item.value}%` : `${item.value.toLocaleString('vi-VN')} VNĐ`}`}</Text>}
                                            description={`Đơn tối thiểu: ${item.minAmount.toLocaleString('vi-VN')} VNĐ`}
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>
                        {/* --- KẾT THÚC PHẦN MÃ ƯU ĐÃI --- */}

                        <div style={summaryTotalsDividerStyle}></div>
                        <div style={summaryRowStyle}>
                            <span>Tổng phụ:</span>
                            <span style={{ fontWeight: 'bold' }}>{subtotal.toLocaleString('vi-VN')} VNĐ</span>
                        </div>
                        <div style={summaryRowStyle}>
                            <span>Phí vận chuyển:</span>
                            <span style={{ fontWeight: 'bold', color: shippingFee === 0 ? '#28a745' : '#555' }}>
                                {shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString('vi-VN')} VNĐ`}
                            </span>
                        </div>
                        {/* --- HIỂN THỊ SỐ TIỀN ĐƯỢC GIẢM --- */}
                        {discountAmount > 0 && (
                            <div style={{...summaryRowStyle, color: '#28a745'}}>
                                <span>Giảm giá ({appliedCoupon?.code}):</span>
                                <span style={{ fontWeight: 'bold' }}>- {discountAmount.toLocaleString('vi-VN')} VNĐ</span>
                            </div>
                        )}
                        <div style={summaryTotalRowStyle}>
                            <span>Tổng cộng:</span>
                            <span>{finalTotal.toLocaleString('vi-VN')} VNĐ</span>
                        </div>
                        
                        <button type="submit" style={placeOrderButtonStyle} disabled={loading}>
                            {loading ? 'Đang xử lý...' : 'ĐẶT HÀNG'}
                            {loading && <Spin style={{ marginLeft: '10px' }} />}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CheckoutPage;

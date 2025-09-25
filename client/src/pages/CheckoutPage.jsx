// client/src/pages/CheckoutPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
// THÊM CÁC HÀM MỚI TỪ SERVICE
import { createOrder } from '../services/productService';
// THÊM CÁC COMPONENT TỪ ANT DESIGN
import { Spin } from 'antd';
import AddressSelector from '../components/common/AddressSelector';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cartItems, clearCart } = useCart();
    const { user, isAuthenticated, token } = useAuth();

    // Nhận dữ liệu từ CartPage
    const selectedItems = location.state?.selectedItems || cartItems;
    const appliedDiscount = location.state?.appliedDiscount || { couponCode: null, discountAmount: 0 };

    // States cho thông tin giao hàng & thanh toán
    const [firstName, setFirstName] = useState(user ? (user.name ? user.name.split(' ')[0] : '') : '');
    const [lastName, setLastName] = useState(user ? (user.name ? user.name.split(' ').slice(1).join(' ') : '') : '');
    const [company, setCompany] = useState('');
    const [country, setCountry] = useState('Việt Nam');
    const [address, setAddress] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState(user ? user.email : '');

    // State cho địa chỉ được chọn từ AddressSelector
    const [selectedAddress, setSelectedAddress] = useState({
        province: '',
        district: '',
        ward: '',
        fullAddress: ''
    });

    const [createAccount, setCreateAccount] = useState(false);
    const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false);
    const [notes, setNotes] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [paymentMethod, setPaymentMethod] = useState('cod');

    // Sử dụng dữ liệu từ Cart
    const discountAmount = appliedDiscount.discountAmount;

    // Tính toán lại giá trị đơn hàng dựa trên selectedItems
    const subtotal = selectedItems.reduce((acc, item) => acc + item.qty * item.price, 0);
    const shippingFee = subtotal > 500000 ? 0 : 30000;
    let finalTotal = subtotal + shippingFee - discountAmount;
    if (finalTotal < 0) finalTotal = 0;

    // Effect để lấy thông tin người dùng và kiểm tra sản phẩm được chọn
    useEffect(() => {
        if (selectedItems.length === 0) {
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

        // Validate selected items on page load
        validateSelectedItems();
    }, [selectedItems, navigate, isAuthenticated, user]);

    // Function to validate selected items
    const validateSelectedItems = async () => {
        const invalidItems = [];
        for (const item of selectedItems) {
            const productId = item._id || item.id;
            if (!productId) {
                invalidItems.push(item);
                continue;
            }

            try {
                const response = await fetch(`http://localhost:5001/api/bonsais/${productId}`);
                if (!response.ok) {
                    invalidItems.push(item);
                }
            } catch (error) {
                console.error('Error validating item:', item, error);
                invalidItems.push(item);
            }
        }

        if (invalidItems.length > 0) {
            console.warn('Found invalid items:', invalidItems);
            setError(`Một số sản phẩm trong giỏ hàng không còn tồn tại. Vui lòng làm mới trang và thử lại.`);
        }
    };

    // Xử lý thay đổi địa chỉ từ AddressSelector
    const handleAddressChange = (addressInfo) => {
        setSelectedAddress(addressInfo);
    };



    const handleSubmitOrder = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (selectedItems.length === 0) {
            setError('Không có sản phẩm nào được chọn để đặt hàng.');
            setLoading(false);
            return;
        }

        if (!firstName || !lastName || !address || !selectedAddress.province || !phone || !email) {
            setError('Vui lòng điền đầy đủ các trường bắt buộc (bao gồm địa chỉ chi tiết và tỉnh/thành phố).');
            setLoading(false);
            return;
        }

        try {
            // Validate selected items before creating order
            const validatedItems = [];
            for (const item of selectedItems) {
                try {
                    // Try to get product from API to validate it exists
                    const productId = item._id || item.id;
                    if (!productId) {
                        console.error('Item missing ID:', item);
                        setError(`Sản phẩm "${item.name}" không có ID hợp lệ.`);
                        setLoading(false);
                        return;
                    }

                    // Validate product exists by making API call
                    const response = await fetch(`http://localhost:5001/api/bonsais/${productId}`);
                    if (!response.ok) {
                        console.error(`Product ${productId} not found:`, response.status);
                        setError(`Không tìm thấy sản phẩm "${item.name}" với ID: ${productId}`);
                        setLoading(false);
                        return;
                    }

                    validatedItems.push({
                        product: productId,
                        name: item.name,
                        image: item.images && item.images.length > 0 ? item.images[0] : 'no-image.jpg',
                        qty: item.qty,
                        price: item.price,
                    });
                } catch (error) {
                    console.error('Error validating item:', item, error);
                    setError(`Lỗi khi xác thực sản phẩm "${item.name}": ${error.message}`);
                    setLoading(false);
                    return;
                }
            }

            const orderData = {
                orderItems: validatedItems,
                shippingAddress: {
                    firstName,
                    lastName,
                    company,
                    country,
                    address,
                    postalCode,
                    city: selectedAddress.fullAddress, // Sử dụng địa chỉ đầy đủ từ selector
                    province: selectedAddress.province,
                    district: selectedAddress.district,
                    ward: selectedAddress.ward,
                    phone,
                    email
                },
                paymentMethod,
                itemsPrice: subtotal,
                shippingPrice: shippingFee,
                taxPrice: 0,
                totalPrice: finalTotal,
                notes,
                createAccount,
                shipToDifferentAddress,
                userId: isAuthenticated ? user._id : null,
                // Thêm thông tin mã giảm giá từ Cart
                couponCode: appliedDiscount.couponCode,
                discount: discountAmount,
            };

            if (paymentMethod === 'vnpay') {
                try {
                    const resp = await fetch('http://localhost:5001/api/payment/vnpay/create', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            amount: finalTotal,
                            orderId: 'ORDER_' + Date.now(),
                            orderInfo: `Thanh toan don hang ${user?.name || 'Khach'}`
                        })
                    });
                    const data = await resp.json();
                    if (data.paymentUrl) {
                        window.location.href = data.paymentUrl;
                        return;
                    } else {
                        throw new Error('Không tạo được URL thanh toán VNPay');
                    }
                } catch (e) {
                    console.error(e);
                    setError(e.message || 'Không thể tạo thanh toán VNPay');
                    setLoading(false);
                    return;
                }
            } else {
                const response = await createOrder(orderData, token);
                clearCart();
                navigate(`/order/${response._id}`, { state: { order: response } });
            }

        } catch (err) {
            console.error("Lỗi khi đặt hàng:", err);
            setError(err.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    }, [
        selectedItems, firstName, lastName, company, country, address, postalCode, selectedAddress, phone, email,
        paymentMethod, createAccount, shipToDifferentAddress, notes, subtotal, shippingFee, finalTotal,
        isAuthenticated, user, clearCart, navigate, token, appliedDiscount, discountAmount
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

    return (
        <div style={checkoutContainerStyle}>
            <h1 style={pageTitleStyle}>
                Thanh toán
                <div style={pageTitleUnderlineStyle}></div>
            </h1>

            {error && (
                <div style={{
                    ...errorStyle,
                    backgroundColor: '#ffe6e6',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '1px solid #ffcccc',
                    marginBottom: '20px'
                }}>
                    <p style={{ margin: '0 0 10px 0' }}>{error}</p>
                    <button
                        onClick={() => {
                            // Clear cart and redirect to cart page
                            clearCart();
                            navigate('/cart');
                        }}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        🔄 Làm mới giỏ hàng
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmitOrder}>
                <div style={mainContentWrapperStyle}>
                    {/* Cột trái: Thông tin thanh toán */}
                    <div style={formColumnStyle}>
                        <div style={sectionStyle}>
                            <h2 style={sectionTitleStyle}>Thông tin thanh toán</h2>
                            {/* ... các input thông tin ... */}
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div style={{ ...formGroupStyle, flex: 1 }}>
                                    <label htmlFor="firstName" style={labelStyle}>Họ <span style={{ color: 'red' }}>*</span></label>
                                    <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={inputStyle} required />
                                </div>
                                <div style={{ ...formGroupStyle, flex: 1 }}>
                                    <label htmlFor="lastName" style={labelStyle}>Tên <span style={{ color: 'red' }}>*</span></label>
                                    <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} style={inputStyle} required />
                                </div>
                            </div>
                            <div style={formGroupStyle}>
                                <label htmlFor="address" style={labelStyle}>Địa chỉ chi tiết <span style={{ color: 'red' }}>*</span></label>
                                <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} style={inputStyle} placeholder="Số nhà, tên đường, ngõ, ngách..." required />
                            </div>

                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Địa chỉ hành chính <span style={{ color: 'red' }}>*</span></label>
                                <AddressSelector
                                    onAddressChange={handleAddressChange}
                                    defaultValues={{}}
                                    disabled={loading}
                                />
                            </div>

                            <div style={formGroupStyle}>
                                <label htmlFor="phone" style={labelStyle}>Số điện thoại <span style={{ color: 'red' }}>*</span></label>
                                <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} required />
                            </div>
                            <div style={formGroupStyle}>
                                <label htmlFor="email" style={labelStyle}>Địa chỉ email <span style={{ color: 'red' }}>*</span></label>
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
                                <label style={{ ...radioItemStyle, ...(paymentMethod === 'vnpay' ? radioCheckedStyle : {}) }}>
                                    <input type="radio" name="paymentMethod" value="vnpay" checked={paymentMethod === 'vnpay'} onChange={(e) => setPaymentMethod(e.target.value)} />
                                    Thanh toán VNPay (ATM nội địa)
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
                        {selectedItems.map((item) => (
                            <div key={item._id} style={summaryItemRowStyle}>
                                <span>{item.name} × {item.qty}</span>
                                <span style={{ fontWeight: 'bold' }}>{(item.qty * item.price).toLocaleString('vi-VN')} VNĐ</span>
                            </div>
                        ))}

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
                        {/* Hiển thị giảm giá từ Cart */}
                        {discountAmount > 0 && (
                            <div style={{ ...summaryRowStyle, color: '#28a745' }}>
                                <span>Giảm giá ({appliedDiscount.couponCode}):</span>
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

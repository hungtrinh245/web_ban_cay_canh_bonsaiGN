// client/src/components/layout/MiniCart.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa'; 

// Props: cartItems, subtotal, onClose (hàm để đóng mini-cart)
const MiniCart = ({ cartItems, subtotal, onClose }) => {
    // Style 
    const miniCartStyle = {
        position: 'absolute',
        top: '60px', // Vị trí dưới header
        right: '20px', // Căn phải
        width: '320px', // Chiều rộng cố định
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.25)', // Shadow mạnh hơn
        zIndex: 1000, // Đảm bảo nổi lên trên cùng
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '450px', // Giới hạn chiều cao
        overflowY: 'auto', // Cuộn nếu quá nhiều sản phẩm
        border: '1px solid #ddd'
    };

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px',
        paddingBottom: '10px',
        borderBottom: '1px solid #eee',
    };

    const closeButtonStyle = {
        background: 'none',
        border: 'none',
        fontSize: '1.2em',
        cursor: 'pointer',
        color: '#aaa',
        transition: 'color 0.2s',
        '&:hover': {
            color: '#333'
        }
    };

    // Style cho mỗi item trong giỏ
    const cartItemStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '15px',
        paddingBottom: '10px',
        borderBottom: '1px dotted #eee', 
    };

    const itemImageStyle = {
        width: '60px',
        height: '60px',
        objectFit: 'cover',
        borderRadius: '5px',
        marginRight: '10px',
    };

    const itemInfoStyle = {
        flexGrow: 1,
        textAlign: 'left',
    };

    const itemNameStyle = {
        margin: '0',
        fontSize: '0.95em',
        fontWeight: 'bold',
        color: '#333',
    };

    const itemQtyPriceStyle = {
        margin: '2px 0 0 0',
        fontSize: '0.85em',
        color: '#666',
    };

    // Style cho tổng cộng
    const totalStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '15px',
        paddingTop: '15px',
        borderTop: '2px solid #28a745',
        fontWeight: 'bold',
        fontSize: '1.1em',
        color: '#333',
    };

    // Style cho các nút hành động
    const buttonGroupStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginTop: '20px',
    };

    const buttonBaseStyle = {
        padding: '12px 15px',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1em',
        fontWeight: 'bold',
        textDecoration: 'none', 
        textAlign: 'center', 
        transition: 'background-color 0.3s ease, color 0.3s ease',
    };

    const viewCartButtonStyle = {
        ...buttonBaseStyle,
        background: '#007bff', 
        color: 'white',
        '&:hover': {
            backgroundColor: '#0056b3'
        }
    };

    const checkoutButtonStyle = {
        ...buttonBaseStyle,
        background: '#28a745',
        color: 'white',
        '&:hover': {
            backgroundColor: '#218838'
        }
    };

    const emptyCartMessageStyle = {
        textAlign: 'center',
        padding: '30px 0',
        color: '#777',
        fontSize: '0.95em',
    };


    return (
        <div style={miniCartStyle}>
            <div style={headerStyle}>
                <h4 style={{ margin: 0, fontSize: '1.1em', color: '#555' }}>GIỎ HÀNG CỦA BẠN</h4>
                <button 
                    onClick={onClose} 
                    style={closeButtonStyle}
                    onMouseOver={(e) => e.currentTarget.style.color = '#333'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#aaa'}
                >
                    <FaTimesCircle />
                </button>
            </div>

            {cartItems.length === 0 ? (
                <p style={emptyCartMessageStyle}>Giỏ hàng trống.</p>
            ) : (
                <>
                    <div style={{ flex: 1, overflowY: 'auto' }}> 
                        {cartItems.map(item => (
                            <div key={item._id} style={cartItemStyle}> 
                                <img src={item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/60?text=No+Image'} alt={item.name} style={itemImageStyle} />
                                <div style={itemInfoStyle}>
                                    <p style={itemNameStyle}>{item.name}</p>
                                    <p style={itemQtyPriceStyle}>{item.qty} x {item.price.toLocaleString('vi-VN')} VNĐ</p>
                                </div>
                                {/* Nút xóa từng sản phẩm (Bạn sẽ cần thêm logic xóa vào đây nếu muốn) */}
                                {/* <button 
                                    style={removeButtonStyle}
                                    // onClick={() => removeFromCart(item)} // Cần truyền removeFromCart prop nếu muốn
                                >
                                    <FaTimesCircle size={14} />
                                </button> */}
                            </div>
                        ))}
                    </div>

                    <div style={totalStyle}>
                        <span>Tổng cộng:</span>
                        <span>{subtotal.toLocaleString('vi-VN')} VNĐ</span>
                    </div>

                    <div style={buttonGroupStyle}>
                        <Link 
                            to="/cart" 
                            onClick={onClose} // Đóng mini-cart khi chuyển trang
                            style={viewCartButtonStyle}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
                        >
                            XEM GIỎ HÀNG
                        </Link>
                        <Link 
                            to="/checkout" 
                            onClick={onClose} // Đóng mini-cart khi chuyển trang
                            style={checkoutButtonStyle}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#218838'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
                        >
                            THANH TOÁN
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default MiniCart;
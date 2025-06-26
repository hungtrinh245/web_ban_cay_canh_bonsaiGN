// client/src/pages/CartPage.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartPage = () => {
    const { cartItems, addToCart, removeFromCart } = useCart();

    const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
    const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

    return (
        <div style={{ maxWidth: '1200px', margin: 'auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ marginBottom: '20px' }}>Giỏ hàng của bạn</h1>
            {cartItems.length === 0 ? (
                <div>
                    Giỏ hàng của bạn đang trống. <Link to="/shop">Bắt đầu mua sắm</Link>
                </div>
            ) : (
                <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap-reverse' }}>
                    <div style={{ flex: 2.5, minWidth: '400px' }}>
                        {cartItems.map(item => (
                            <div key={item._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
                                <img src={item.images[0]} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '15px', borderRadius: '8px' }} />
                                <div style={{ flex: 1 }}>
                                    <Link to={`/products/${item._id}`} style={{ textDecoration: 'none', color: '#333' }}>
                                        <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1em' }}>{item.name}</p>
                                    </Link>
                                    <p style={{ margin: '5px 0', color: '#888' }}>Giá: {item.price.toLocaleString('vi-VN')} VNĐ</p>
                                    <button onClick={() => removeFromCart(item)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '0.9em' }}>Xóa</button>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '5px', margin: '0 20px' }}>
                                    <button onClick={() => addToCart(item, -1)} style={{ padding: '5px 10px', border: 'none', background: '#f4f4f4', cursor: 'pointer' }}>-</button>
                                    <span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{item.qty}</span>
                                    <button onClick={() => addToCart(item, 1)} style={{ padding: '5px 10px', border: 'none', background: '#f4f4f4', cursor: 'pointer' }}>+</button>
                                </div>
                                <div style={{ fontWeight: 'bold', width: '120px', textAlign: 'right' }}>
                                    {(item.qty * item.price).toLocaleString('vi-VN')} VNĐ
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ flex: 1, background: '#f8f9fa', padding: '20px', borderRadius: '8px', height: 'fit-content' }}>
                        <h2>Tổng cộng</h2>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #ddd' }}>
                            <span>Tạm tính ({totalItems} sản phẩm)</span>
                            <span style={{ fontWeight: 'bold' }}>{subtotal.toLocaleString('vi-VN')} VNĐ</span>
                        </div>
                        <button style={{ width: '100%', padding: '15px', background: '#d9534f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1.1em', marginTop: '20px' }}>
                            Tiến hành thanh toán
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
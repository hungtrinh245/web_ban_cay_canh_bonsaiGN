// client/src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const footerStyle = {
        background: '#2c3e50', // Màu xanh đen đậm
        color: '#bdc3c7', // Màu chữ xám nhạt
        padding: '60px 0 20px 0',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
    };

    const containerStyle = {
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        maxWidth: '1200px',
        margin: 'auto',
        padding: '0 20px',
        gap: '30px'
    };

    const columnStyle = {
        flex: 1,
        minWidth: '220px'
    };

    const titleStyle = {
        color: 'white',
        fontSize: '16px',
        marginBottom: '20px',
        textTransform: 'uppercase',
        borderBottom: '1px solid #444',
        paddingBottom: '10px'
    };

    const listStyle = {
        listStyle: 'none',
        padding: 0
    };

    const listItemStyle = {
        marginBottom: '10px'
    };

    const linkStyle = {
        color: '#bdc3c7',
        textDecoration: 'none'
    };

    const bottomBarStyle = {
        textAlign: 'center',
        padding: '20px 0',
        marginTop: '40px',
        borderTop: '1px solid #444'
    };

    return (
        <footer style={footerStyle}>
            <div style={containerStyle}>
                {/* Cột 1: Giới thiệu */}
                <div style={columnStyle}>
                    <h4 style={titleStyle}>BonsaiGN Shop</h4>
                    <p>
                        BonsaiGN Shop mang đến không gian sống xanh, như là một cách để khơi nguồn cảm hứng, cải thiện chất lượng tinh thần, mang lại sự tĩnh tâm, thẩm mỹ cho không gian nội thất.
                    </p>
                    <p><strong>MST:</strong> 0123456789git </p>
                </div>

                {/* Cột 2: Về chúng tôi */}
                <div style={columnStyle}>
                    <h4 style={titleStyle}>Về chúng tôi</h4>
                    <ul style={listStyle}>
                        <li style={listItemStyle}><Link to="/about" style={linkStyle}>Giới thiệu</Link></li>
                        <li style={listItemStyle}><Link to="/privacy-policy" style={linkStyle}>Chính sách bảo mật</Link></li>
                        <li style={listItemStyle}><Link to="/warranty" style={linkStyle}>Chính sách bảo hành</Link></li>
                        <li style={listItemStyle}><Link to="/payment" style={linkStyle}>Phương thức thanh toán</Link></li>
                    </ul>
                </div>

                {/* Cột 3: Liên hệ */}
                <div style={columnStyle}>
                    <h4 style={titleStyle}>Liên hệ</h4>
                    <ul style={listStyle}>
                        <li style={listItemStyle}>Hotline: 09 6688 9393</li>
                        <li style={listItemStyle}>Email: hotro@bonsaigarden.com</li>
                        <li style={listItemStyle}>Địa chỉ:TP Hà Nội</li>
                    </ul>
                </div>

                {/* Cột 4: Mạng xã hội */}
                <div style={columnStyle}>
                    <h4 style={titleStyle}>Mạng xã hội</h4>
                    <ul style={listStyle}>
                        <li style={listItemStyle}><a href="#" style={linkStyle}>Facebook</a></li>
                        <li style={listItemStyle}><a href="#" style={linkStyle}>Instagram</a></li>
                        <li style={listItemStyle}><a href="#" style={linkStyle}>Youtube</a></li>
                    </ul>
                </div>
            </div>
            <div style={bottomBarStyle}>
                Copyright &copy; 2025 BonsaiGN Shop
            </div>
        </footer>
    );
};

export default Footer;
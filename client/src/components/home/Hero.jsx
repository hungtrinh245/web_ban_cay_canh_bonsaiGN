// client/src/components/home/Hero.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
    const heroStyle = {
        position: 'relative',
        height: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white',
        marginBottom: '40px',
    };

    const bgImageStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: -2,
        filter: 'brightness(0.6)'
    };

    const overlayStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.4))',
        zIndex: -1,
    };

    const contentStyle = {
        maxWidth: '800px',
    };

    const titleStyle = {
        fontSize: '4em',
        fontWeight: 'bold',
        textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
        marginBottom: '20px'
    };

    const subtitleStyle = {
        fontSize: '1.5em',
        marginBottom: '30px',
        textShadow: '1px 1px 4px rgba(0,0,0,0.7)',
    };

    const buttonStyle = {
        padding: '15px 35px',
        fontSize: '1.2em',
        color: 'white',
        background: '#28a745',
        border: 'none',
        borderRadius: '50px',
        cursor: 'pointer',
        textDecoration: 'none',
        fontWeight: 'bold',
        transition: 'transform 0.2s'
    };

    return (
        <div style={heroStyle}>
            <img 
                src="/images/sample-sanh-co.jpg"
                alt="Background" 
                style={bgImageStyle} 
            />
            <div style={overlayStyle}></div>
            <div style={contentStyle}>
                <h1 style={titleStyle}>Mang Không Gian Xanh Đến Bên Bạn</h1>
                <p style={subtitleStyle}>Khám phá bộ sưu tập cây cảnh độc đáo và chất lượng nhất.</p>
                <Link to="/shop" style={buttonStyle}>Khám phá ngay</Link>
            </div>
        </div>
    );
};

export default Hero;
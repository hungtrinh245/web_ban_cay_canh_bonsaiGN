// client/src/components/layout/Newsletter.jsx
import React from 'react';

const Newsletter = () => {
    const sectionStyle = {
        background: '#fcfaf5',
        padding: '60px 20px',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif'
    };

    const titleStyle = {
        fontSize: '2em',
        color: '#2c3e50',
        fontWeight: 'normal',
        marginBottom: '40px'
    };

    const formStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '15px',
        flexWrap: 'wrap'
    };

    const inputStyle = {
        padding: '15px',
        width: '280px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '1em'
    };

    const buttonStyle = {
        padding: '15px 30px',
        border: 'none',
        borderRadius: '5px',
        background: '#2c3e50',
        color: 'white',
        fontSize: '1em',
        cursor: 'pointer',
        fontWeight: 'bold'
    };

    return (
        <section style={sectionStyle}>
            <h2 style={titleStyle}>ĐĂNG KÍ ĐỂ NHẬN ƯU ĐÃI</h2>
            <form style={formStyle} onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Nhập họ và tên" style={inputStyle} />
                <input type="email" placeholder="exam@gmail.com" style={inputStyle} />
                <button type="submit" style={buttonStyle}>ĐĂNG KÍ</button>
            </form>
        </section>
    );
};

export default Newsletter;
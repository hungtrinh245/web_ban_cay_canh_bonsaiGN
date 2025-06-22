// client/src/components/home/Services.jsx
import React from 'react';

const Services = () => {
    const containerStyle = {
        display: 'flex',
        justifyContent: 'space-around',
        textAlign: 'center',
        padding: '40px 20px',
        maxWidth: '1200px',
        margin: 'auto',
        gap: '20px',
        flexWrap: 'wrap'
    };

    const serviceItemStyle = {
        flex: 1,
        minWidth: '250px'
    };

    const iconStyle = {
        fontSize: '3em',
        color: '#28a745'
    };

    const titleStyle = {
        fontSize: '1.2em',
        fontWeight: 'bold',
        margin: '15px 0'
    };

    return (
        <div style={containerStyle}>
            <div style={serviceItemStyle}>
                <div style={iconStyle}>🌱</div>
                <h3 style={titleStyle}>Cây Trồng Chất Lượng</h3>
                <p>Tuyển chọn từ những nhà vườn uy tín, đảm bảo sức sống và vẻ đẹp.</p>
            </div>
            <div style={serviceItemStyle}>
                <div style={iconStyle}>🚚</div>
                <h3 style={titleStyle}>Giao Hàng Nhanh Chóng</h3>
                <p>Đóng gói cẩn thận, giao hàng tận nơi, đảm bảo cây luôn tươi tốt.</p>
            </div>
            <div style={serviceItemStyle}>
                <div style={iconStyle}>💬</div>
                <h3 style={titleStyle}>Tư Vấn Tận Tình</h3>
                <p>Đội ngũ chuyên gia sẵn sàng hỗ trợ bạn chọn cây và chăm sóc.</p>
            </div>
        </div>
    );
};

export default Services;
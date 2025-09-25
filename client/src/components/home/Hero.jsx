// client/src/components/home/Hero.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography, Space } from 'antd';
import { ShopOutlined, RightOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Hero = () => {
    return (
        <div style={{
        position: 'relative',
            minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 50%, #f6ffed 100%)',
            overflow: 'hidden'
        }}>
            {/* Decorative elements */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '10%',
                width: '100px',
                height: '100px',
                background: 'linear-gradient(135deg, rgba(47, 106, 55, 0.1), rgba(82, 196, 26, 0.1))',
                borderRadius: '50%',
                filter: 'blur(40px)',
                animation: 'float 6s ease-in-out infinite'
            }} />

            <div style={{
        position: 'absolute',
                top: '60%',
                right: '15%',
                width: '150px',
                height: '150px',
                background: 'linear-gradient(135deg, rgba(82, 196, 26, 0.1), rgba(56, 158, 13, 0.1))',
                borderRadius: '50%',
                filter: 'blur(50px)',
                animation: 'float 8s ease-in-out infinite reverse'
            }} />

            {/* Subtle pattern overlay */}
            <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232F6A37' fill-opacity='0.03'%3E%3Cpath d='M20 20c0 11-9 20-20 20s-20-9-20-20 9-20 20-20 20 9 20 20zm-30 0c0 5.5 4.5 10 10 10s10-4.5 10-10-4.5-10-10-10-10 4.5-10 10z'/%3E%3C/g%3E%3C/svg%3E")`,
                opacity: 0.5
            }} />

            {/* Main content */}
            <div style={{
                maxWidth: '1000px',
                padding: '40px 24px',
                position: 'relative',
                zIndex: 1
            }}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {/* Welcome badge - redesigned */}
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(47, 106, 55, 0.1), rgba(82, 196, 26, 0.1))',
                        backdropFilter: 'blur(10px)',
                        color: '#2F6A37',
                        padding: '12px 24px',
                        borderRadius: '30px',
                        fontSize: '15px',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        border: '1px solid rgba(47, 106, 55, 0.2)',
                        boxShadow: '0 4px 20px rgba(47, 106, 55, 0.1)'
                    }}>
                        <span style={{ fontSize: '18px' }}>🌱</span>
                        Chào mừng đến với BonsaiGN
                    </div>

                    {/* Main heading */}
                    <Title
                        level={1}
                        style={{
                            color: '#1a1a1a',
                            fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
                            margin: '20px 0',
                            fontWeight: 800,
                            lineHeight: 1.1,
                            letterSpacing: '-1px',
                            background: 'linear-gradient(135deg, #1a1a1a 0%, #2F6A37 50%, #52c41a 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}
                    >
                        Mang Không Gian Xanh<br />
                        Đến Bên Bạn
                    </Title>

                    {/* Subtitle */}
                    <Text style={{
                        color: '#595959',
                        fontSize: '1.3rem',
                        lineHeight: 1.6,
                        maxWidth: '700px',
                        margin: '0 auto 30px auto',
                        display: 'block',
                        fontWeight: '400'
                    }}>
                        Khám phá bộ sưu tập cây cảnh độc đáo và chất lượng nhất.
                        Tạo nên không gian sống xanh tràn đầy sức sống cho ngôi nhà của bạn.
                    </Text>

                    {/* Action buttons */}
                    <Space size="large" style={{ marginTop: '30px' }} className="hero-buttons">
                        <Link to="/shop">
                            <Button
                                type="primary"
                                size="large"
                                icon={<ShopOutlined />}
                                style={{
                                    height: '56px',
                                    padding: '0 40px',
                                    fontSize: '17px',
                                    fontWeight: '600',
                                    borderRadius: '28px',
                                    background: 'linear-gradient(135deg, #2F6A37, #52c41a)',
        border: 'none',
                                    boxShadow: '0 6px 24px rgba(47, 106, 55, 0.3)',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Khám phá cửa hàng
                            </Button>
                        </Link>

                        <Link to="/about">
                            <Button
                                size="large"
                                icon={<RightOutlined />}
                                style={{
                                    height: '56px',
                                    padding: '0 40px',
                                    fontSize: '17px',
                                    fontWeight: '600',
                                    borderRadius: '28px',
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    color: '#2F6A37',
                                    border: '2px solid rgba(47, 106, 55, 0.2)',
                                    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.1)',
                                    backdropFilter: 'blur(10px)',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Tìm hiểu thêm
                            </Button>
                        </Link>
                    </Space>

                    {/* Stats */}
                    <div style={{
                        marginTop: '60px',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '60px',
                        flexWrap: 'wrap',
                        padding: '40px 0'
                    }}>
                        {[
                            { number: '500+', label: 'Sản phẩm', icon: '🌿' },
                            { number: '1000+', label: 'Khách hàng', icon: '👥' },
                            { number: '99%', label: 'Hài lòng', icon: '⭐' }
                        ].map((stat, index) => (
                            <div key={index} style={{
                                textAlign: 'center',
                                padding: '20px',
                                background: 'rgba(255, 255, 255, 0.7)',
                                borderRadius: '16px',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                minWidth: '140px',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
                            }}>
                                <div style={{
                                    fontSize: '24px',
                                    marginBottom: '8px'
                                }}>
                                    {stat.icon}
                                </div>
                                <div style={{
                                    color: '#2F6A37',
                                    fontSize: '28px',
                                    fontWeight: '700',
                                    marginBottom: '4px'
                                }}>
                                    {stat.number}
                                </div>
                                <div style={{
                                    color: '#8c8c8c',
                                    fontSize: '15px',
                                    fontWeight: '500'
                                }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </Space>
            </div>
        </div>
    );
};

export default Hero;
// client/src/pages/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Import các API service cần thiết để lấy dữ liệu dashboard
import { getAllBonsais, getAllOrdersAdmin } from '../services/productService'; // Cho sản phẩm và đơn hàng
import { getAllUsers } from '../services/authService'; // Cho người dùng
import { getAllPosts } from '../services/blogService'; // Cho bài viết

// Import Ant Design Components
import { Card, Col, Row, Statistic, Spin, message as AntMessage } from 'antd';
import { ShoppingCartOutlined, UserOutlined, FileTextOutlined, TagsOutlined } from '@ant-design/icons'; // Icons cho các thẻ

const AdminDashboardPage = () => {
    const { token, user } = useAuth(); // Lấy user để chào mừng

    const [summary, setSummary] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalPosts: 0,
    });
    const [loadingSummary, setLoadingSummary] = useState(true);
    const [errorSummary, setErrorSummary] = useState(null);

    // Hàm lấy dữ liệu tổng quan
    const fetchSummaryData = async () => {
        setLoadingSummary(true);
        setErrorSummary(null);
        try {
            const [productsRes, ordersRes, usersRes, postsRes] = await Promise.all([
                getAllBonsais(1, 1), // Chỉ cần 1 sản phẩm/trang để lấy totalDocuments
                getAllOrdersAdmin(token),
                getAllUsers(token),
                getAllPosts(1, 1), // Chỉ cần 1 bài/trang để lấy totalDocuments
            ]);

            setSummary({
                totalProducts: productsRes.totalDocuments || 0,
                totalOrders: ordersRes.length || 0, // getAllOrdersAdmin trả về mảng trực tiếp
                totalUsers: usersRes.length || 0, // getAllUsers trả về mảng trực tiếp
                totalPosts: postsRes.totalDocuments || 0,
            });
        } catch (err) {
            setErrorSummary(err.message || 'Không thể tải dữ liệu tổng quan.');
            AntMessage.error('Lỗi tải Dashboard: ' + (err.message || 'Không xác định'));
            console.error('Dashboard data fetch error:', err);
        } finally {
            setLoadingSummary(false);
        }
    };

    useEffect(() => {
        if (token && user && user.role === 'admin') { // Chỉ fetch nếu có token và là admin
            fetchSummaryData();
        }
    }, [token, user]); // Chạy lại khi token hoặc user thay đổi

    // Styles (tương tự ProductManagement, có thể đưa vào file CSS chung sau này)
    const dashboardHeaderStyle = {
        fontSize: '2em',
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: '20px',
        paddingBottom: '10px',
        borderBottom: '2px solid #28a745',
    };

    const cardStyle = {
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        border: '1px solid #eee',
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={dashboardHeaderStyle}>
                Dashboard
            </h1>
            <p style={{ fontSize: '1.1em', color: '#555', marginBottom: '30px' }}>
                Chào mừng bạn, **{user ? user.name : 'Admin'}**! Đây là tổng quan về cửa hàng của bạn.
            </p>

            {loadingSummary ? (
                <Spin tip="Đang tải dữ liệu Dashboard...">
                    <div style={{ height: '250px', border: '1px solid #f0f0f0', borderRadius: '8px' }} />
                </Spin>
            ) : errorSummary ? (
                <AntMessage type="error" content={errorSummary} style={{ marginBottom: '20px' }} />
            ) : (
                <Row gutter={[16, 16]}> {/* Khoảng cách giữa các cột */}
                    <Col xs={24} sm={12} lg={6}> {/* Responsive columns */}
                        <Card style={cardStyle}>
                            <Statistic
                                title="Tổng sản phẩm"
                                value={summary.totalProducts}
                                formatter={(value) => `${value} sản phẩm`}
                                prefix={<ShoppingCartOutlined />}
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card style={cardStyle}>
                            <Statistic
                                title="Tổng đơn hàng"
                                value={summary.totalOrders}
                                formatter={(value) => `${value} đơn`}
                                prefix={<UserOutlined />}
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card style={cardStyle}>
                            <Statistic
                                title="Tổng người dùng"
                                value={summary.totalUsers}
                                formatter={(value) => `${value} người`}
                                prefix={<FileTextOutlined />}
                                valueStyle={{ color: '#08c' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card style={cardStyle}>
                            <Statistic
                                title="Tổng bài viết"
                                value={summary.totalPosts}
                                formatter={(value) => `${value} bài`}
                                prefix={<TagsOutlined />}
                                valueStyle={{ color: '#d46b08' }}
                            />
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Thêm các phần khác của Dashboard ở đây, ví dụ: biểu đồ, đơn hàng mới nhất */}
            <h2 style={{...dashboardHeaderStyle, marginTop: '50px'}}>Đơn hàng mới nhất</h2>
            {/* Tương tự, bạn có thể fetch và hiển thị 5 đơn hàng mới nhất ở đây */}
            <p>Đây sẽ là nơi hiển thị danh sách các đơn hàng mới nhất.</p>

        </div>
    );
};

export default AdminDashboardPage;
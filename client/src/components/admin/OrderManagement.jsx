// client/src/components/admin/OrderManagement.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
// Đảm bảo các hàm này được export từ productService.js
import { getAllOrdersAdmin, updateOrderToPaid, updateOrderToDelivered } from '../../services/productService'; 

// Import Ant Design Components
import { Table, Button, Modal, Space, Popconfirm, Tag, message as AntMessage, Spin } from 'antd';
// Đảm bảo các icons được import đúng cách (CarOutlined thay vì ShippingPrintOutlined)
import { CheckOutlined, ExclamationCircleOutlined, EyeOutlined, CarOutlined } from '@ant-design/icons'; 

const { confirm } = Modal;

const OrderManagement = () => {
    const { token } = useAuth();
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            // Gửi token xác thực Admin
            const data = await getAllOrdersAdmin(token); 
            setOrders(data);
        } catch (err) {
            // Sử dụng AntMessage utility function để hiển thị lỗi. 
            // Không render <AntMessage /> trực tiếp trong JSX.
            AntMessage.error('Lỗi khi tải dữ liệu đơn hàng: ' + (err.message || 'Không xác định'));
            setError(err.message || 'Không thể tải dữ liệu đơn hàng.');
            console.error("Fetch orders error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Chỉ fetch khi có token (người dùng đã đăng nhập)
        if (token) { 
            fetchOrders();
        } else {
            setLoading(false);
            setError("Bạn cần đăng nhập để xem đơn hàng.");
        }
    }, [token]); 

    const handleUpdatePaid = (orderId) => {
        confirm({
            title: 'Xác nhận đã thanh toán?',
            icon: <ExclamationCircleOutlined />,
            content: 'Đơn hàng này sẽ được đánh dấu là đã thanh toán.',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            async onOk() { 
                try {
                    await updateOrderToPaid(orderId, token); 
                    AntMessage.success('Đơn hàng đã được đánh dấu là đã thanh toán!');
                    fetchOrders(); 
                } catch (err) {
                    AntMessage.error('Lỗi khi cập nhật trạng thái thanh toán: ' + (err.message || 'Lỗi không xác định'));
                    console.error("Update paid status error:", err);
                }
            },
        });
    };

    const handleUpdateDelivered = (orderId) => {
        confirm({
            title: 'Xác nhận đã giao hàng?',
            icon: <ExclamationCircleOutlined />,
            content: 'Đơn hàng này sẽ được đánh dấu là đã giao hàng.',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            async onOk() { 
                try {
                    await updateOrderToDelivered(orderId, token); 
                    AntMessage.success('Đơn hàng đã được đánh dấu là đã giao hàng!');
                    fetchOrders(); 
                } catch (err) {
                    AntMessage.error('Lỗi khi cập nhật trạng thái giao hàng: ' + (err.message || 'Lỗi không xác định'));
                    console.error("Update delivered status error:", err);
                }
            },
        });
    };

    const columns = [
        { title: 'ID Đơn hàng', dataIndex: '_id', key: '_id', render: (text) => text.slice(-6).toUpperCase(), width: 120 },
        { title: 'Người dùng', dataIndex: 'user', key: 'user', render: (user) => (user ? `${user.name} (${user.email})` : 'Khách') },
        { title: 'Ngày đặt', dataIndex: 'createdAt', key: 'createdAt', render: (date) => new Date(date).toLocaleDateString('vi-VN'), sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt) },
        { title: 'Tổng tiền', dataIndex: 'totalPrice', key: 'totalPrice', render: (price) => `${price.toLocaleString('vi-VN')} VNĐ`, sorter: (a, b) => a.totalPrice - b.totalPrice },
        {
            title: 'Thanh toán', dataIndex: 'isPaid', key: 'isPaid',
            render: (isPaid, record) => (<Tag color={isPaid ? 'green' : 'orange'}>{isPaid ? 'Đã TT' : 'Chờ TT'}</Tag>),
            filters: [{ text: 'Đã TT', value: true }, { text: 'Chờ TT', value: false }], onFilter: (value, record) => record.isPaid === value,
        },
        {
            title: 'Giao hàng', dataIndex: 'isDelivered', key: 'isDelivered',
            render: (isDelivered, record) => (<Tag color={isDelivered ? 'blue' : 'gray'}>{isDelivered ? 'Đã giao' : 'Đang XL'}</Tag>),
            filters: [{ text: 'Đã giao', value: true }, { text: 'Đang XL', value: false }], onFilter: (value, record) => record.isDelivered === value,
        },
        {
            title: 'Hành động', key: 'actions', width: 200, align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="default" icon={<EyeOutlined />} onClick={() => navigate(`/order/${record._id}`)}>
                        Xem
                    </Button>
                    {!record.isPaid && ( 
                        <Popconfirm
                            title="Xác nhận đã thanh toán?" onConfirm={() => handleUpdatePaid(record._id)} okText="Có" cancelText="Không"
                            icon={<ExclamationCircleOutlined style={{ color: 'orange' }} />}>
                            <Button icon={<CheckOutlined />} style={{ backgroundColor: '#28a745', borderColor: '#28a745', color: 'white' }}>TT</Button>
                        </Popconfirm>
                    )}
                    {!record.isDelivered && ( 
                        <Popconfirm
                            title="Xác nhận đã giao hàng?" onConfirm={() => handleUpdateDelivered(record._id)} okText="Có" cancelText="Không"
                            icon={<ExclamationCircleOutlined style={{ color: 'blue' }} />}>
                            <Button icon={<CarOutlined />} style={{ backgroundColor: '#007bff', borderColor: '#007bff', color: 'white' }}>Giao</Button>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ fontSize: '2em', fontWeight: 'bold', color: '#2c3e50', marginBottom: '20px', paddingBottom: '10px', borderBottom: '2px solid #28a745' }}>
                Quản lý Đơn hàng
            </h1>

            {/* Sửa lỗi: Xóa dòng render AntMessage trong JSX để tránh lỗi "Element type is invalid" */}
            {/* {error && <AntMessage type="error" content={error} style={{ marginBottom: '20px' }} />} */}

            {loading ? (
                <Spin tip="Đang tải đơn hàng...">
                    <div style={{ height: '300px' }} />
                </Spin>
            ) : (
                <Table
                    dataSource={orders}
                    columns={columns}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }} 
                    bordered
                />
            )}
        </div>
    );
};

export default OrderManagement;
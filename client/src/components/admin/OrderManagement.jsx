// client/src/components/admin/OrderManagement.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAllOrdersAdmin, updateOrderToPaid, updateOrderToDelivered } from '../../services/productService'; 

// Import Ant Design Components
import { Table, Button, Space, Popconfirm, Tag, message as AntMessage, Spin, Modal, Select, Input } from 'antd';
import { CheckOutlined, ExclamationCircleOutlined, EyeOutlined, CarOutlined, MailOutlined, CopyOutlined } from '@ant-design/icons'; 

const { TextArea } = Input;

const OrderManagement = () => {
    const { token } = useAuth();
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State cho tính năng Gemini
    const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [emailType, setEmailType] = useState('delivery_review');
    const [generatedEmail, setGeneratedEmail] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);


    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllOrdersAdmin(token); 
            // Thêm trường 'orderItems' giả nếu không có để tránh lỗi
            const ordersWithItems = data.map(order => ({
                ...order,
                orderItems: order.orderItems || [{ name: 'Sản phẩm mẫu', qty: 1 }]
            }));
            setOrders(ordersWithItems);
        } catch (err) {
            const errorMessage = err.message || 'Không thể tải dữ liệu đơn hàng.';
            AntMessage.error('Lỗi khi tải dữ liệu đơn hàng: ' + errorMessage);
            setError(errorMessage);
            console.error("Fetch orders error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) { 
            fetchOrders();
        } else {
            setLoading(false);
            setError("Bạn cần đăng nhập để xem đơn hàng.");
        }
    }, [token]); 

    const handleUpdatePaid = async (orderId) => {
        try {
            await updateOrderToPaid(orderId, token); 
            AntMessage.success('Đơn hàng đã được đánh dấu là đã thanh toán!');
            fetchOrders();
        } catch (err) {
            AntMessage.error('Lỗi khi cập nhật trạng thái thanh toán: ' + (err.message || 'Lỗi không xác định'));
            console.error("Update paid status error:", err);
        }
    };

    const handleUpdateDelivered = async (orderId) => {
        try {
            await updateOrderToDelivered(orderId, token); 
            AntMessage.success('Đơn hàng đã được đánh dấu là đã giao hàng!');
            fetchOrders();
        } catch (err) {
            AntMessage.error('Lỗi khi cập nhật trạng thái giao hàng: ' + (err.message || 'Lỗi không xác định'));
            console.error("Update delivered status error:", err);
        }
    };

    // --- CÁC HÀM CHO TÍNH NĂNG GEMINI ---

    const showEmailModal = (order) => {
        setCurrentOrder(order);
        setIsEmailModalVisible(true);
        setGeneratedEmail('');
        setEmailType('delivery_review');
    };

    const handleModalCancel = () => {
        setIsEmailModalVisible(false);
        setCurrentOrder(null);
    };

    const handleGenerateEmail = async () => {
        if (!currentOrder || !emailType) return;
        setIsGenerating(true);
        setGeneratedEmail('');

        const customerName = currentOrder.user ? currentOrder.user.name : 'Quý khách';
        const productList = currentOrder.orderItems.map(item => `${item.name} (Số lượng: ${item.qty})`).join(', ');

        let prompt = '';
        if (emailType === 'delivery_review') {
            prompt = `Bạn là một trợ lý chăm sóc khách hàng cho một cửa hàng bán cây cảnh online tên là 'BonsaiGN'. Hãy viết một email chuyên nghiệp và thân thiện cho khách hàng tên là ${customerName}.
Mục đích của email:
1. Thông báo rằng đơn hàng của họ đã được giao thành công.
2. Liệt kê các sản phẩm họ đã mua: ${productList}.
3. Nhẹ nhàng mời họ để lại đánh giá cho sản phẩm trên website.
Giữ email ngắn gọn, chân thành và có lời cảm ơn. Bắt đầu email bằng "Kính gửi ${customerName}," và kết thúc bằng "Trân trọng, Đội ngũ BonsaiGN".`;
        } else if (emailType === 'check_in') {
            prompt = `Bạn là một trợ lý chăm sóc khách hàng cho một cửa hàng bán cây cảnh online tên là 'BonsaiGN'. Hãy viết một email chuyên nghiệp và thân thiện cho khách hàng tên là ${customerName}.
Khách hàng này đã mua các sản phẩm sau đây khoảng một tuần trước: ${productList}.
Mục đích của email:
1. Hỏi thăm xem họ có hài lòng với sản phẩm không.
2. Hỏi xem cây có phát triển tốt không và họ có cần bất kỳ mẹo chăm sóc nào không.
3. Gợi ý rằng họ có thể trả lời email này nếu có bất kỳ câu hỏi nào.
Giữ email ngắn gọn và thể hiện sự quan tâm thực sự đến trải nghiệm của khách hàng. Bắt đầu email bằng "Kính gửi ${customerName}," và kết thúc bằng "Trân trọng, Đội ngũ BonsaiGN".`;
        }

        try {
            const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
            const payload = { contents: chatHistory };
            const apiKey = ""; // API key sẽ được cung cấp tự động trong môi trường thực thi
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API call failed with status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.candidates && result.candidates[0]?.content?.parts[0]) {
                const text = result.candidates[0].content.parts[0].text;
                setGeneratedEmail(text);
            } else {
                throw new Error('Phản hồi từ API không hợp lệ.');
            }

        } catch (error) {
            console.error('Lỗi khi gọi Gemini API:', error);
            AntMessage.error('Không thể tạo nội dung email: ' + error.message);
            setGeneratedEmail('Đã xảy ra lỗi khi tạo nội dung. Vui lòng thử lại.');
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleCopyToClipboard = () => {
        if (!generatedEmail) return;
        const textArea = document.createElement('textarea');
        textArea.value = generatedEmail;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            AntMessage.success('Đã sao chép vào clipboard!');
        } catch (err) {
            AntMessage.error('Không thể sao chép.');
        }
        document.body.removeChild(textArea);
    };


    const columns = [
        { title: 'ID Đơn hàng', dataIndex: '_id', key: '_id', render: (text) => text.slice(-6).toUpperCase(), width: 120 },
        { title: 'Người dùng', dataIndex: 'user', key: 'user', render: (user) => (user ? `${user.name} (${user.email})` : 'Khách') },
        { title: 'Ngày đặt', dataIndex: 'createdAt', key: 'createdAt', render: (date) => new Date(date).toLocaleDateString('vi-VN'), sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt) },
        { title: 'Tổng tiền', dataIndex: 'totalPrice', key: 'totalPrice', render: (price) => `${price.toLocaleString('vi-VN')} VNĐ`, sorter: (a, b) => a.totalPrice - b.totalPrice },
        {
            title: 'Thanh toán', dataIndex: 'isPaid', key: 'isPaid',
            render: (isPaid) => (<Tag color={isPaid ? 'green' : 'orange'}>{isPaid ? 'Đã TT' : 'Chờ TT'}</Tag>),
            filters: [{ text: 'Đã TT', value: true }, { text: 'Chờ TT', value: false }], onFilter: (value, record) => record.isPaid === value,
        },
        {
            title: 'Giao hàng', dataIndex: 'isDelivered', key: 'isDelivered',
            render: (isDelivered) => (<Tag color={isDelivered ? 'blue' : 'gray'}>{isDelivered ? 'Đã giao' : 'Đang XL'}</Tag>),
            filters: [{ text: 'Đã giao', value: true }, { text: 'Đang XL', value: false }], onFilter: (value, record) => record.isDelivered === value,
        },
        {
            title: 'Hành động', key: 'actions', width: 250, align: 'center', // Tăng chiều rộng cột
            render: (_, record) => (
                <Space size="small">
                    <Button type="default" icon={<EyeOutlined />} onClick={() => navigate(`/order/${record._id}`)} />
                    {!record.isPaid && ( 
                        <Popconfirm
                            title="Xác nhận đã thanh toán?" 
                            onConfirm={() => handleUpdatePaid(record._id)} 
                            okText="Có" cancelText="Không"
                            icon={<ExclamationCircleOutlined style={{ color: 'orange' }} />}
                        >
                            <Button icon={<CheckOutlined />} style={{ backgroundColor: '#28a745', color: 'white' }}>TT</Button>
                        </Popconfirm>
                    )}
                    {!record.isDelivered && ( 
                        <Popconfirm
                            title="Xác nhận đã giao hàng?" 
                            onConfirm={() => handleUpdateDelivered(record._id)} 
                            okText="Có" cancelText="Không"
                            icon={<ExclamationCircleOutlined style={{ color: 'blue' }} />}
                        >
                            <Button icon={<CarOutlined />} style={{ backgroundColor: '#007bff', color: 'white' }}>Giao</Button>
                        </Popconfirm>
                    )}
                    {/* Nút mới cho tính năng Gemini */}
                    <Button icon={<MailOutlined />} onClick={() => showEmailModal(record)} title="Tạo email khách hàng" />
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
            <h1 style={{ fontSize: '2em', fontWeight: 'bold', color: '#2c3e50', marginBottom: '20px', paddingBottom: '10px', borderBottom: '2px solid #28a745' }}>
                Quản lý Đơn hàng
            </h1>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Spin size="large" tip="Đang tải đơn hàng..." />
                </div>
            ) : error ? (
                 <div style={{ marginBottom: '20px', color: 'red', textAlign: 'center', padding: '20px', border: '1px solid red', borderRadius: '8px', backgroundColor: '#fff5f5' }}>
                    <p>{error}</p>
                </div>
            ) : (
                <Table
                    dataSource={orders}
                    columns={columns}
                    rowKey="_id"
                    pagination={{ pageSize: 10, showSizeChanger: true, position: ['bottomCenter'] }} 
                    bordered
                    scroll={{ x: 'max-content' }}
                />
            )}

            {/* Modal để tạo Email */}
            <Modal
                title="✨ Soạn thảo Email Chăm sóc Khách hàng"
                visible={isEmailModalVisible}
                onCancel={handleModalCancel}
                footer={[
                    <Button key="back" onClick={handleModalCancel}>
                        Hủy
                    </Button>,
                    <Button key="copy" icon={<CopyOutlined />} onClick={handleCopyToClipboard} disabled={!generatedEmail}>
                        Sao chép
                    </Button>,
                ]}
                width={700}
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Select value={emailType} onChange={(value) => setEmailType(value)} style={{ width: '100%' }}>
                        <Select.Option value="delivery_review">Thông báo đã giao & Xin đánh giá</Select.Option>
                        <Select.Option value="check_in">Hỏi thăm khách hàng sau khi mua</Select.Option>
                    </Select>
                    <Button type="primary" onClick={handleGenerateEmail} loading={isGenerating} style={{ width: '100%' }}>
                        {isGenerating ? 'Đang tạo nội dung...' : 'Tạo nội dung với Gemini ✨'}
                    </Button>
                    <Spin spinning={isGenerating} tip="AI đang soạn thảo...">
                        <TextArea 
                            rows={12} 
                            value={generatedEmail} 
                            placeholder="Nội dung email sẽ được tạo ở đây..."
                            readOnly 
                        />
                    </Spin>
                </Space>
            </Modal>
        </div>
    );
};

export default OrderManagement;

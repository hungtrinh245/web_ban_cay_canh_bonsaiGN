// client/src/components/admin/OrderManagement.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAllOrdersAdmin, updateOrderStatus, updatePaymentStatus } from '../../services/productService';

// Import Ant Design Components
import { Table, Button, Space, Popconfirm, Tag, message as AntMessage, Spin, Modal, Select, Input, Tooltip, Badge } from 'antd';
import {
    CheckOutlined,
    ExclamationCircleOutlined,
    EyeOutlined,
    CarOutlined,
    MailOutlined,
    CopyOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    SyncOutlined,
    StopOutlined,
    UndoOutlined
} from '@ant-design/icons';

const { TextArea } = Input;

// Constants cho trạng thái đơn hàng - Chuẩn E-commerce
const ORDER_STATUS = {
    PENDING: 'pending',           // Chờ xác nhận
    CONFIRMED: 'confirmed',       // Đã xác nhận
    PROCESSING: 'processing',     // Đang xử lý
    PREPARING: 'preparing',       // Đang chuẩn bị hàng
    SHIPPED: 'shipped',          // Đã gửi hàng
    IN_TRANSIT: 'in_transit',     // Đang vận chuyển
    OUT_FOR_DELIVERY: 'out_for_delivery', // Đang giao hàng
    DELIVERED: 'delivered',       // Đã giao hàng thành công
    FAILED_DELIVERY: 'failed_delivery', // Giao hàng thất bại
    CANCELLED: 'cancelled',       // Đã hủy
    RETURNED: 'returned',         // Đã hoàn trả
    REFUNDED: 'refunded'          // Đã hoàn tiền
};

// Constants cho trạng thái thanh toán
const PAYMENT_STATUS = {
    PENDING: 'pending',           // Chờ thanh toán
    PROCESSING: 'processing',     // Đang xử lý thanh toán
    PAID: 'paid',                // Đã thanh toán
    FAILED: 'failed',            // Thanh toán thất bại
    CANCELLED: 'cancelled',       // Thanh toán bị hủy
    REFUNDED: 'refunded',         // Đã hoàn tiền
    PARTIALLY_REFUNDED: 'partially_refunded' // Hoàn tiền một phần
};

// Mapping hiển thị trạng thái đơn hàng với màu sắc và icon phù hợp
const ORDER_STATUS_DISPLAY = {
    [ORDER_STATUS.PENDING]: {
        text: 'Chờ xác nhận',
        color: 'orange',
        icon: <ClockCircleOutlined />,
        description: 'Đơn hàng đang chờ admin xác nhận'
    },
    [ORDER_STATUS.CONFIRMED]: {
        text: 'Đã xác nhận',
        color: 'blue',
        icon: <CheckCircleOutlined />,
        description: 'Đơn hàng đã được xác nhận và đang chuẩn bị'
    },
    [ORDER_STATUS.PROCESSING]: {
        text: 'Đang xử lý',
        color: 'cyan',
        icon: <SyncOutlined spin />,
        description: 'Đơn hàng đang được xử lý'
    },
    [ORDER_STATUS.PREPARING]: {
        text: 'Đang chuẩn bị hàng',
        color: 'purple',
        icon: <SyncOutlined />,
        description: 'Đang đóng gói và chuẩn bị hàng hóa'
    },
    [ORDER_STATUS.SHIPPED]: {
        text: 'Đã gửi hàng',
        color: 'geekblue',
        icon: <CarOutlined />,
        description: 'Hàng đã được gửi đi'
    },
    [ORDER_STATUS.IN_TRANSIT]: {
        text: 'Đang vận chuyển',
        color: 'blue',
        icon: <CarOutlined />,
        description: 'Hàng đang trên đường vận chuyển'
    },
    [ORDER_STATUS.OUT_FOR_DELIVERY]: {
        text: 'Đang giao hàng',
        color: 'lime',
        icon: <CarOutlined />,
        description: 'Shipper đang giao hàng đến bạn'
    },
    [ORDER_STATUS.DELIVERED]: {
        text: 'Đã giao hàng',
        color: 'green',
        icon: <CheckCircleOutlined />,
        description: 'Đã giao hàng thành công'
    },
    [ORDER_STATUS.FAILED_DELIVERY]: {
        text: 'Giao hàng thất bại',
        color: 'red',
        icon: <ExclamationCircleOutlined />,
        description: 'Không thể giao hàng, sẽ thử lại'
    },
    [ORDER_STATUS.CANCELLED]: {
        text: 'Đã hủy',
        color: 'red',
        icon: <CloseCircleOutlined />,
        description: 'Đơn hàng đã bị hủy'
    },
    [ORDER_STATUS.RETURNED]: {
        text: 'Đã hoàn trả',
        color: 'volcano',
        icon: <UndoOutlined />,
        description: 'Khách hàng đã hoàn trả hàng'
    },
    [ORDER_STATUS.REFUNDED]: {
        text: 'Đã hoàn tiền',
        color: 'magenta',
        icon: <UndoOutlined />,
        description: 'Đã hoàn tiền cho khách hàng'
    }
};

// Mapping hiển thị trạng thái thanh toán
const PAYMENT_STATUS_DISPLAY = {
    [PAYMENT_STATUS.PENDING]: {
        text: 'Chờ thanh toán',
        color: 'orange',
        icon: <ClockCircleOutlined />,
        description: 'Chờ khách hàng thanh toán'
    },
    [PAYMENT_STATUS.PROCESSING]: {
        text: 'Đang xử lý',
        color: 'cyan',
        icon: <SyncOutlined spin />,
        description: 'Đang xử lý giao dịch thanh toán'
    },
    [PAYMENT_STATUS.PAID]: {
        text: 'Đã thanh toán',
        color: 'green',
        icon: <CheckCircleOutlined />,
        description: 'Thanh toán thành công'
    },
    [PAYMENT_STATUS.FAILED]: {
        text: 'Thanh toán thất bại',
        color: 'red',
        icon: <CloseCircleOutlined />,
        description: 'Giao dịch thanh toán thất bại'
    },
    [PAYMENT_STATUS.CANCELLED]: {
        text: 'Thanh toán bị hủy',
        color: 'red',
        icon: <StopOutlined />,
        description: 'Giao dịch thanh toán bị hủy'
    },
    [PAYMENT_STATUS.REFUNDED]: {
        text: 'Đã hoàn tiền',
        color: 'volcano',
        icon: <UndoOutlined />,
        description: 'Đã hoàn tiền đầy đủ'
    },
    [PAYMENT_STATUS.PARTIALLY_REFUNDED]: {
        text: 'Hoàn tiền một phần',
        color: 'magenta',
        icon: <UndoOutlined />,
        description: 'Đã hoàn tiền một phần'
    }
};

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

    // State cho modal cập nhật trạng thái
    const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusType, setStatusType] = useState('order'); // 'order' hoặc 'payment'
    const [newOrderStatus, setNewOrderStatus] = useState('');
    const [newPaymentStatus, setNewPaymentStatus] = useState('');
    const [statusNote, setStatusNote] = useState('');


    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllOrdersAdmin(token);
            // Thêm trường 'orderItems' giả nếu không có để tránh lỗi
            const ordersWithItems = data.map(order => ({
                ...order,
                orderItems: order.orderItems || [{ name: 'Sản phẩm mẫu', qty: 1 }],
                orderStatus: order.orderStatus || ORDER_STATUS.PENDING,
                paymentStatus: order.paymentStatus || PAYMENT_STATUS.PENDING
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

    const showStatusModal = (order, type) => {
        setSelectedOrder(order);
        setStatusType(type);
        if (type === 'order') {
            setNewOrderStatus(order.orderStatus || ORDER_STATUS.PENDING);
        } else {
            setNewPaymentStatus(order.paymentStatus || PAYMENT_STATUS.PENDING);
        }
        setStatusNote('');
        setIsStatusModalVisible(true);
    };

    const handleUpdateStatus = async () => {
        if (!selectedOrder) return;

        try {
            if (statusType === 'order') {
                await updateOrderStatus(selectedOrder._id, newOrderStatus, statusNote, token);
                AntMessage.success(`Đã cập nhật trạng thái đơn hàng thành: ${ORDER_STATUS_DISPLAY[newOrderStatus].text}`);
            } else {
                await updatePaymentStatus(selectedOrder._id, newPaymentStatus, statusNote, token);
                AntMessage.success(`Đã cập nhật trạng thái thanh toán thành: ${PAYMENT_STATUS_DISPLAY[newPaymentStatus].text}`);
            }

            setIsStatusModalVisible(false);
            fetchOrders();
        } catch (err) {
            AntMessage.error('Lỗi khi cập nhật trạng thái: ' + (err.message || 'Lỗi không xác định'));
            console.error("Update status error:", err);
        }
    };

    const handleCancelOrder = async (orderId) => {
        try {
            await updateOrderStatus(orderId, ORDER_STATUS.CANCELLED, 'Đơn hàng bị hủy bởi admin', token);
            AntMessage.success('Đã hủy đơn hàng!');
            fetchOrders();
        } catch (err) {
            AntMessage.error('Lỗi khi hủy đơn hàng: ' + (err.message || 'Lỗi không xác định'));
            console.error("Cancel order error:", err);
        }
    };

    // Hàm cập nhật trạng thái nhanh
    const handleQuickStatusUpdate = async (orderId, newStatus, type) => {
        try {
            if (type === 'order') {
                await updateOrderStatus(orderId, newStatus, 'Cập nhật trạng thái tự động', token);
                const statusText = ORDER_STATUS_DISPLAY[newStatus].text;
                AntMessage.success(`Đã cập nhật trạng thái đơn hàng thành: ${statusText}`);
            } else {
                await updatePaymentStatus(orderId, newStatus, 'Cập nhật trạng thái tự động', token);
                const statusText = PAYMENT_STATUS_DISPLAY[newStatus].text;
                AntMessage.success(`Đã cập nhật trạng thái thanh toán thành: ${statusText}`);
            }
            fetchOrders();
        } catch (err) {
            AntMessage.error('Lỗi khi cập nhật trạng thái: ' + (err.message || 'Lỗi không xác định'));
            console.error("Quick status update error:", err);
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
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            render: (text) => text.slice(-6).toUpperCase(),
            width: 120
        },
        {
            title: 'Người dùng',
            dataIndex: 'user',
            key: 'user',
            render: (user) => (user ? `${user.name}` : 'Khách')
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleDateString('vi-VN'),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (price) => `${price.toLocaleString('vi-VN')} VNĐ`,
            sorter: (a, b) => a.totalPrice - b.totalPrice
        },
        {
            title: 'Trạng thái đơn hàng',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            render: (status) => {
                const statusInfo = ORDER_STATUS_DISPLAY[status] || ORDER_STATUS_DISPLAY[ORDER_STATUS.PENDING];
                return (
                    <Tooltip title={statusInfo.description} placement="top">
                        <Tag color={statusInfo.color} icon={statusInfo.icon} style={{ cursor: 'help' }}>
                            {statusInfo.text}
                        </Tag>
                    </Tooltip>
                );
            },
            filters: Object.entries(ORDER_STATUS_DISPLAY).map(([key, value]) => ({
                text: value.text,
                value: key
            })),
            onFilter: (value, record) => record.orderStatus === value,
            width: 180
        },
        {
            title: 'Trạng thái thanh toán',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            render: (status) => {
                const statusInfo = PAYMENT_STATUS_DISPLAY[status] || PAYMENT_STATUS_DISPLAY[PAYMENT_STATUS.PENDING];
                return (
                    <Tooltip title={statusInfo.description} placement="top">
                        <Tag color={statusInfo.color} icon={statusInfo.icon} style={{ cursor: 'help' }}>
                            {statusInfo.text}
                        </Tag>
                    </Tooltip>
                );
            },
            filters: Object.entries(PAYMENT_STATUS_DISPLAY).map(([key, value]) => ({
                text: value.text,
                value: key
            })),
            onFilter: (value, record) => record.paymentStatus === value,
            width: 180
        },
        {
            title: 'Hành động',
            key: 'actions',
            width: 300,
            align: 'center',
            render: (_, record) => (
                <Space size="small" wrap>
                    <Tooltip title="Xem chi tiết đơn hàng">
                        <Button
                            type="default"
                            icon={<EyeOutlined />}
                            onClick={() => navigate(`/order/${record._id}`)}
                            size="small"
                        />
                    </Tooltip>

                    {/* Quick Actions cho các trạng thái phổ biến */}
                    {record.orderStatus === ORDER_STATUS.PENDING && (
                        <Tooltip title="Xác nhận đơn hàng">
                            <Button
                                type="primary"
                                icon={<CheckCircleOutlined />}
                                onClick={() => handleQuickStatusUpdate(record._id, ORDER_STATUS.CONFIRMED, 'order')}
                                size="small"
                                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                            >
                                Xác nhận
                            </Button>
                        </Tooltip>
                    )}

                    {record.orderStatus === ORDER_STATUS.CONFIRMED && (
                        <Tooltip title="Bắt đầu chuẩn bị hàng">
                            <Button
                                type="primary"
                                icon={<SyncOutlined />}
                                onClick={() => handleQuickStatusUpdate(record._id, ORDER_STATUS.PREPARING, 'order')}
                                size="small"
                                style={{ backgroundColor: '#722ed1', borderColor: '#722ed1' }}
                            >
                                Chuẩn bị
                            </Button>
                        </Tooltip>
                    )}

                    {record.orderStatus === ORDER_STATUS.PREPARING && (
                        <Tooltip title="Gửi hàng">
                            <Button
                                type="primary"
                                icon={<CarOutlined />}
                                onClick={() => handleQuickStatusUpdate(record._id, ORDER_STATUS.SHIPPED, 'order')}
                                size="small"
                                style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
                            >
                                Gửi hàng
                            </Button>
                        </Tooltip>
                    )}

                    {record.orderStatus === ORDER_STATUS.OUT_FOR_DELIVERY && (
                        <Tooltip title="Xác nhận giao hàng thành công">
                            <Button
                                type="primary"
                                icon={<CheckCircleOutlined />}
                                onClick={() => handleQuickStatusUpdate(record._id, ORDER_STATUS.DELIVERED, 'order')}
                                size="small"
                                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                            >
                                Hoàn thành
                            </Button>
                        </Tooltip>
                    )}

                    {/* Cập nhật trạng thái thủ công */}
                    <Tooltip title="Cập nhật trạng thái đơn hàng">
                        <Button
                            type="default"
                            icon={<SyncOutlined />}
                            onClick={() => showStatusModal(record, 'order')}
                            size="small"
                        >
                            Đơn hàng
                        </Button>
                    </Tooltip>

                    <Tooltip title="Cập nhật trạng thái thanh toán">
                        <Button
                            type="default"
                            icon={<CheckOutlined />}
                            onClick={() => showStatusModal(record, 'payment')}
                            size="small"
                        >
                            Thanh toán
                        </Button>
                    </Tooltip>

                    {/* Hủy đơn hàng */}
                    {![ORDER_STATUS.CANCELLED, ORDER_STATUS.DELIVERED, ORDER_STATUS.RETURNED].includes(record.orderStatus) && (
                        <Tooltip title="Hủy đơn hàng">
                            <Popconfirm
                                title="Bạn có chắc chắn muốn hủy đơn hàng này?"
                                description="Hành động này không thể hoàn tác!"
                                onConfirm={() => handleCancelOrder(record._id)}
                                okText="Hủy đơn"
                                cancelText="Không"
                                icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                            >
                                <Button
                                    type="primary"
                                    danger
                                    icon={<StopOutlined />}
                                    size="small"
                                >
                                    Hủy
                                </Button>
                            </Popconfirm>
                        </Tooltip>
                    )}

                    {/* Tạo email khách hàng */}
                    <Tooltip title="Tạo email khách hàng">
                        <Button
                            icon={<MailOutlined />}
                            onClick={() => showEmailModal(record)}
                            size="small"
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div style={{
            padding: '24px',
            backgroundColor: '#f5f5f5',
            minHeight: '100vh'
        }}>
            <div style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}>
                <h1 style={{
                    fontSize: '2.2em',
                    fontWeight: 'bold',
                    color: '#2c3e50',
                    marginBottom: '0',
                    paddingBottom: '16px',
                    borderBottom: '3px solid #28a745',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    📋 Quản lý Đơn hàng
                </h1>
                <p style={{
                    marginTop: '12px',
                    color: '#666',
                    fontSize: '1em',
                    marginBottom: '0'
                }}>
                    Quản lý và theo dõi tất cả đơn hàng của khách hàng
                </p>
            </div>

            {/* Thống kê tổng quan - Layout cải thiện */}
            <div style={{
                marginBottom: '30px',
                padding: '20px',
                backgroundColor: '#fff',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}>
                <h3 style={{
                    marginBottom: '20px',
                    color: '#2c3e50',
                    fontSize: '1.3em',
                    fontWeight: '600',
                    borderBottom: '2px solid #f0f0f0',
                    paddingBottom: '10px'
                }}>
                    📊 Thống kê tổng quan đơn hàng
                </h3>

                {/* Thống kê chính - 4 cards lớn */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px',
                    marginBottom: '20px'
                }}>
                    <div style={{
                        padding: '24px',
                        backgroundColor: '#f8f9ff',
                        borderRadius: '12px',
                        textAlign: 'center',
                        border: '2px solid #e8f4fd',
                        transition: 'transform 0.2s ease'
                    }}>
                        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1890ff', marginBottom: '8px' }}>
                            {orders.length}
                        </div>
                        <div style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>📦 Tổng đơn hàng</div>
                    </div>

                    <div style={{
                        padding: '24px',
                        backgroundColor: '#f6ffed',
                        borderRadius: '12px',
                        textAlign: 'center',
                        border: '2px solid #e6f7ff'
                    }}>
                        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#52c41a', marginBottom: '8px' }}>
                            {orders.filter(order => order.paymentStatus === PAYMENT_STATUS.PAID).length}
                        </div>
                        <div style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>💰 Đã thanh toán</div>
                    </div>

                    <div style={{
                        padding: '24px',
                        backgroundColor: '#fff7e6',
                        borderRadius: '12px',
                        textAlign: 'center',
                        border: '2px solid #fff7e6'
                    }}>
                        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#faad14', marginBottom: '8px' }}>
                            {orders.filter(order => order.orderStatus === ORDER_STATUS.PENDING).length}
                        </div>
                        <div style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>⏳ Chờ xác nhận</div>
                    </div>

                    <div style={{
                        padding: '24px',
                        backgroundColor: '#f6ffed',
                        borderRadius: '12px',
                        textAlign: 'center',
                        border: '2px solid #f6ffed'
                    }}>
                        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#13c2c2', marginBottom: '8px' }}>
                            {orders.filter(order =>
                                [ORDER_STATUS.SHIPPED, ORDER_STATUS.IN_TRANSIT, ORDER_STATUS.OUT_FOR_DELIVERY].includes(order.orderStatus)
                            ).length}
                        </div>
                        <div style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>🚚 Đang vận chuyển</div>
                    </div>
                </div>

                {/* Thống kê chi tiết - 5 cards nhỏ */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '16px'
                }}>
                    <div style={{
                        padding: '18px',
                        backgroundColor: '#f9f0ff',
                        borderRadius: '10px',
                        textAlign: 'center',
                        border: '1px solid #f0f0f0',
                        transition: 'all 0.2s ease'
                    }}>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#722ed1', marginBottom: '6px' }}>
                            {orders.filter(order => order.orderStatus === ORDER_STATUS.PREPARING).length}
                        </div>
                        <div style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>📦 Đang chuẩn bị</div>
                    </div>

                    <div style={{
                        padding: '18px',
                        backgroundColor: '#e6fffb',
                        borderRadius: '10px',
                        textAlign: 'center',
                        border: '1px solid #f0f0f0'
                    }}>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#13c2c2', marginBottom: '6px' }}>
                            {orders.filter(order => order.orderStatus === ORDER_STATUS.DELIVERED).length}
                        </div>
                        <div style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>✅ Đã giao hàng</div>
                    </div>

                    <div style={{
                        padding: '18px',
                        backgroundColor: '#fff2f0',
                        borderRadius: '10px',
                        textAlign: 'center',
                        border: '1px solid #f0f0f0'
                    }}>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f5222d', marginBottom: '6px' }}>
                            {orders.filter(order => order.orderStatus === ORDER_STATUS.CANCELLED).length}
                        </div>
                        <div style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>❌ Đã hủy</div>
                    </div>

                    <div style={{
                        padding: '18px',
                        backgroundColor: '#fff7e6',
                        borderRadius: '10px',
                        textAlign: 'center',
                        border: '1px solid #f0f0f0'
                    }}>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fa8c16', marginBottom: '6px' }}>
                            {orders.filter(order => order.orderStatus === ORDER_STATUS.RETURNED).length}
                        </div>
                        <div style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>🔄 Hoàn trả</div>
                    </div>

                    <div style={{
                        padding: '18px',
                        backgroundColor: '#fff0f6',
                        borderRadius: '10px',
                        textAlign: 'center',
                        border: '1px solid #f0f0f0'
                    }}>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#eb2f96', marginBottom: '6px' }}>
                            {orders.filter(order =>
                                [PAYMENT_STATUS.REFUNDED, PAYMENT_STATUS.PARTIALLY_REFUNDED].includes(order.paymentStatus)
                            ).length}
                        </div>
                        <div style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>💸 Hoàn tiền</div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Spin size="large" tip="Đang tải đơn hàng..." />
                </div>
            ) : error ? (
                <div style={{ marginBottom: '20px', color: 'red', textAlign: 'center', padding: '20px', border: '1px solid red', borderRadius: '8px', backgroundColor: '#fff5f5' }}>
                    <p>{error}</p>
                </div>
            ) : (
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}>
                    <Table
                        dataSource={orders}
                        columns={columns}
                        rowKey="_id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            position: ['bottomCenter'],
                            showQuickJumper: true,
                            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`
                        }}
                        bordered
                        scroll={{ x: 'max-content' }}
                        size="middle"
                        style={{
                            fontSize: '14px'
                        }}
                    />
                </div>
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

            {/* Modal cập nhật trạng thái */}
            <Modal
                title={
                    <div>
                        <SyncOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                        {statusType === 'order' ? 'Cập nhật trạng thái đơn hàng' : 'Cập nhật trạng thái thanh toán'}
                    </div>
                }
                visible={isStatusModalVisible}
                onCancel={() => setIsStatusModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setIsStatusModalVisible(false)}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleUpdateStatus}>
                        Cập nhật
                    </Button>,
                ]}
                width={600}
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    {statusType === 'order' ? (
                        <>
                            <div>
                                <strong>Trạng thái hiện tại:</strong>
                                <Tag
                                    color={ORDER_STATUS_DISPLAY[selectedOrder?.orderStatus || ORDER_STATUS.PENDING]?.color}
                                    style={{ marginLeft: '8px' }}
                                >
                                    {ORDER_STATUS_DISPLAY[selectedOrder?.orderStatus || ORDER_STATUS.PENDING]?.text}
                                </Tag>
                            </div>
                            <div>
                                <strong>Chọn trạng thái mới:</strong>
                                <Select
                                    value={newOrderStatus}
                                    onChange={setNewOrderStatus}
                                    style={{ width: '100%', marginTop: '8px' }}
                                    placeholder="Chọn trạng thái mới"
                                >
                                    {Object.entries(ORDER_STATUS_DISPLAY).map(([key, value]) => (
                                        <Select.Option key={key} value={key}>
                                            <Space>
                                                {value.icon}
                                                {value.text}
                                            </Space>
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <strong>Trạng thái hiện tại:</strong>
                                <Tag
                                    color={PAYMENT_STATUS_DISPLAY[selectedOrder?.paymentStatus || PAYMENT_STATUS.PENDING]?.color}
                                    style={{ marginLeft: '8px' }}
                                >
                                    {PAYMENT_STATUS_DISPLAY[selectedOrder?.paymentStatus || PAYMENT_STATUS.PENDING]?.text}
                                </Tag>
                            </div>
                            <div>
                                <strong>Chọn trạng thái mới:</strong>
                                <Select
                                    value={newPaymentStatus}
                                    onChange={setNewPaymentStatus}
                                    style={{ width: '100%', marginTop: '8px' }}
                                    placeholder="Chọn trạng thái mới"
                                >
                                    {Object.entries(PAYMENT_STATUS_DISPLAY).map(([key, value]) => (
                                        <Select.Option key={key} value={key}>
                                            <Space>
                                                {value.icon}
                                                {value.text}
                                            </Space>
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>
                        </>
                    )}

                    <div>
                        <strong>Ghi chú (tùy chọn):</strong>
                        <TextArea
                            value={statusNote}
                            onChange={(e) => setStatusNote(e.target.value)}
                            placeholder="Nhập ghi chú về việc thay đổi trạng thái..."
                            rows={3}
                            style={{ marginTop: '8px' }}
                        />
                    </div>
                </Space>
            </Modal>
        </div>
    );
};

export default OrderManagement;

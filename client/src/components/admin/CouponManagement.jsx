// client/src/components/admin/CouponManagement.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
// Đảm bảo getCoupons, createCoupon, updateCoupon, deleteCoupon được import từ productService.js
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from '../../services/productService';

// Import Ant Design Components
import { Table, Button, Modal, Form, Input, Select, DatePicker, InputNumber, Switch, Space, Popconfirm, Tag, message as AntMessage, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment'; // Đảm bảo moment được cài đặt và import

const { Option } = Select;
const { confirm } = Modal;

const CouponManagement = () => {
    const { token } = useAuth();

    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDetailVisible, setIsDetailVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCoupon, setCurrentCoupon] = useState(null);
    const [form] = Form.useForm();

    const [formLoading, setFormLoading] = useState(false);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getCoupons(token); // Gọi API lấy danh sách coupons
            setCoupons(data);
        } catch (err) {
            // Lỗi 404 (Not Found) sẽ được bắt ở đây
            setError(err.message || 'Không thể tải dữ liệu mã ưu đãi.');
            console.error("Fetch coupons error:", err);
            AntMessage.error('Lỗi: ' + (err.message || 'Không thể tải mã ưu đãi.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchCoupons();
        }
    }, [token]);

    const showAddModal = () => {
        setIsEditing(false);
        setCurrentCoupon(null);
        form.resetFields();
        // Giá trị mặc định cho form mới (maxDiscount và usageLimit là undefined để Antd InputNumber hiển thị placeholder)
        form.setFieldsValue({ type: 'percentage', minAmount: 0, maxDiscount: undefined, usageLimit: undefined, isActive: true });
        setIsModalVisible(true);
    };

    const showEditModal = (coupon) => {
        setIsEditing(true);
        setCurrentCoupon(coupon);
        form.setFieldsValue({
            ...coupon,
            // Chuyển đổi Date sang moment object cho DatePicker (hỗ trợ cả expiresAt và expiryDate)
            expiresAt: coupon.expiresAt ? moment(coupon.expiresAt) : (coupon.expiryDate ? moment(coupon.expiryDate) : null),
            // Nếu maxDiscount là Infinity, đặt là undefined để Antd InputNumber hiển thị placeholder
            maxDiscount: coupon.maxDiscount === Infinity ? undefined : coupon.maxDiscount,
            usageLimit: coupon.usageLimit === Infinity ? undefined : coupon.usageLimit,
        });
        setIsModalVisible(true);
    };

    const showDetailModal = (coupon) => {
        setCurrentCoupon(coupon);
        setIsDetailVisible(true);
    };

    const handleCloseDetail = () => {
        setIsDetailVisible(false);
        setCurrentCoupon(null);
    };

    const handleCancelModal = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleDeleteCoupon = (couponId) => {
        confirm({
            title: 'Bạn có chắc chắn muốn xóa mã ưu đãi này?',
            icon: <ExclamationCircleOutlined />,
            content: 'Hành động này không thể hoàn tác!',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            async onOk() {
                try {
                    await deleteCoupon(couponId, token);
                    AntMessage.success('Mã ưu đãi đã xóa thành công!');
                    fetchCoupons();
                } catch (err) {
                    AntMessage.error('Lỗi khi xóa mã ưu đãi: ' + (err.message || 'Lỗi không xác định'));
                    console.error("Delete coupon error:", err);
                }
            },
        });
    };

    const onFinishForm = async (values) => {
        setFormLoading(true);

        const couponData = {
            ...values,
            code: values.code.toUpperCase(),
            // Gửi cả 2 trường để tương thích backend (expiresAt hoặc expiryDate)
            expiresAt: values.expiresAt ? values.expiresAt.toISOString() : null,
            expiryDate: values.expiresAt ? values.expiresAt.toISOString() : null,
            minAmount: Number(values.minAmount) || 0,
            value: Number(values.value),
            maxDiscount: values.maxDiscount === undefined ? Infinity : Number(values.maxDiscount),
            usageLimit: values.usageLimit === undefined ? Infinity : Number(values.usageLimit),
            isActive: values.isActive !== undefined ? values.isActive : true,
        };

        try {
            if (isEditing && currentCoupon) {
                await updateCoupon(currentCoupon._id, couponData, token);
                AntMessage.success('Cập nhật mã ưu đãi thành công!');
            } else {
                await createCoupon(couponData, token);
                AntMessage.success('Thêm mã ưu đãi mới thành công!');
            }
            setIsModalVisible(false);
            form.resetFields();
            fetchCoupons();
        } catch (err) {
            AntMessage.error('Lỗi: ' + (err.message || 'Không thể lưu mã ưu đãi.'));
            console.error("Save coupon form error:", err);
        } finally {
            setFormLoading(false);
        }
    };

    const columns = [
        {
            title: 'Mã ưu đãi', dataIndex: 'code', key: 'code', sorter: (a, b) => a.code.localeCompare(b.code),
        },
        {
            title: 'Loại', dataIndex: 'type', key: 'type',
            render: (type) => (type === 'percentage' ? 'Phần trăm (%)' : 'Cố định (VNĐ)'),
            filters: [{ text: 'Phần trăm', value: 'percentage' }, { text: 'Cố định', value: 'fixed' }], onFilter: (value, record) => record.type === value,
        },
        {
            title: 'Giá trị', dataIndex: 'value', key: 'value',
            render: (value, record) => (
                record.type === 'percentage'
                    ? `${value}%`
                    : (typeof value === 'number' ? `${value.toLocaleString('vi-VN')} VNĐ` : 'N/A')
            ),
        },
        {
            title: 'Đơn hàng tối thiểu', dataIndex: 'minAmount', key: 'minAmount',
            render: (amount) => `${(amount || 0).toLocaleString('vi-VN')} VNĐ`,
        },
        {
            title: 'Giảm tối đa', dataIndex: 'maxDiscount', key: 'maxDiscount',
            render: (amount) => {
                if (amount === Infinity) return 'Không giới hạn';
                if (typeof amount === 'number' && !isNaN(amount)) { return `${amount.toLocaleString('vi-VN')} VNĐ`; }
                return 'N/A';
            },
        },
        {
            title: 'Giới hạn sử dụng', dataIndex: 'usageLimit', key: 'usageLimit',
            render: (limit) => (
                limit === Infinity || limit === undefined || limit === null
                    ? 'Không giới hạn'
                    : (typeof limit === 'number' ? `${limit.toLocaleString('vi-VN')}` : `${limit}`)
            ),
        },
        {
            title: 'Đã dùng', dataIndex: 'usedCount', key: 'usedCount',
            render: (count) => (typeof count === 'number' ? count.toLocaleString('vi-VN') : 0),
        },
        {
            title: 'Hết hạn', dataIndex: 'expiresAt', key: 'expiresAt',
            render: (_, record) => {
                const date = record.expiresAt || record.expiryDate;
                return date ? new Date(date).toLocaleDateString('vi-VN') : 'Không';
            },
        },
        {
            title: 'Đang hoạt động', dataIndex: 'isActive', key: 'isActive',
            render: (isActive) => (isActive ? <Tag color="green">Có</Tag> : <Tag color="red">Không</Tag>),
            filters: [{ text: 'Có', value: true }, { text: 'Không', value: false }], onFilter: (value, record) => record.isActive === value,
        },
        {
            title: 'Hành động', key: 'actions', width: 240, align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => showDetailModal(record)}>Xem</Button>
                    <Button type="primary" icon={<EditOutlined />} onClick={() => showEditModal(record)}>
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xóa mã ưu đãi" description="Bạn có chắc chắn muốn xóa mã ưu đãi này?"
                        onConfirm={() => handleDeleteCoupon(record._id)} okText="Xóa" cancelText="Hủy"
                        icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}>
                        <Button type="danger" icon={<DeleteOutlined />}>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ fontSize: '2em', fontWeight: 'bold', color: '#2c3e50', marginBottom: '20px', paddingBottom: '10px', borderBottom: '2px solid #28a745' }}>
                Quản lý Mã ưu đãi
            </h1>

            <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal} style={{ marginBottom: '20px' }}>
                Thêm mã ưu đãi mới
            </Button>

            {/* Error message render here. Note: We rely on AntMessage.error utility call, not the component render here */}
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            {loading ? (
                <Spin tip="Đang tải mã ưu đãi...">
                    <div style={{ height: '300px' }} />
                </Spin>
            ) : (
                <Table
                    dataSource={coupons}
                    columns={columns}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                    bordered
                />
            )}

            {/* Modal Thêm/Sửa mã ưu đãi */}
            <Modal
                title={isEditing ? "Sửa mã ưu đãi" : "Thêm mã ưu đãi mới"}
                open={isModalVisible}
                onCancel={handleCancelModal}
                footer={null}
                width={700}
                maskClosable={!formLoading}
                closable={!formLoading}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinishForm}
                    initialValues={isEditing && currentCoupon ? {
                        ...currentCoupon,
                        expiresAt: currentCoupon.expiresAt ? moment(currentCoupon.expiresAt) : null,
                        maxDiscount: currentCoupon.maxDiscount === Infinity ? undefined : currentCoupon.maxDiscount,
                        usageLimit: currentCoupon.usageLimit === Infinity ? undefined : currentCoupon.usageLimit,
                    } : { type: 'percentage', minAmount: 0, maxDiscount: undefined, usageLimit: undefined, isActive: true }}
                >
                    <Form.Item label="Mã ưu đãi" name="code" rules={[{ required: true, message: 'Vui lòng nhập mã ưu đãi!' }]}>
                        <Input placeholder="Ví dụ: SALE10, FREESHIP" disabled={isEditing} />
                    </Form.Item>

                    <Form.Item label="Loại giảm giá" name="type" rules={[{ required: true, message: 'Vui lòng chọn loại giảm giá!' }]}>
                        <Select placeholder="Chọn loại">
                            <Option value="percentage">Phần trăm (%)</Option>
                            <Option value="fixed">Cố định (VNĐ)</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Giá trị giảm" name="value" rules={[{ required: true, message: 'Vui lòng nhập giá trị!' }]}>
                        <InputNumber min={0} style={{ width: '100%' }} placeholder="Giá trị (ví dụ: 10 hoặc 50000)" />
                    </Form.Item>

                    <Form.Item label="Đơn hàng tối thiểu" name="minAmount">
                        <InputNumber min={0} style={{ width: '100%' }} placeholder="0 nếu không có" />
                    </Form.Item>

                    <Form.Item label="Giảm giá tối đa" name="maxDiscount">
                        <InputNumber min={0} style={{ width: '100%' }} placeholder="Không giới hạn nếu bỏ trống" />
                    </Form.Item>

                    <Form.Item label="Ngày hết hạn" name="expiresAt">
                        <DatePicker showTime style={{ width: '100%' }} placeholder="Chọn ngày và giờ hết hạn" />
                    </Form.Item>

                    <Form.Item label="Số lượt sử dụng tối đa" name="usageLimit">
                        <InputNumber min={1} style={{ width: '100%' }} placeholder="Không giới hạn nếu bỏ trống" />
                    </Form.Item>

                    <Form.Item name="isActive" valuePropName="checked" label="Kích hoạt">
                        <Switch />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={formLoading}>
                            {isEditing ? 'Cập nhật' : 'Thêm mã ưu đãi'}
                        </Button>
                        <Button type="default" onClick={handleCancelModal} style={{ marginLeft: '10px' }} disabled={formLoading}>
                            Hủy
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal xem chi tiết mã ưu đãi */}
            <Modal
                title="Chi tiết mã ưu đãi"
                open={isDetailVisible}
                onCancel={handleCloseDetail}
                footer={[
                    <Button key="close" onClick={handleCloseDetail}>Đóng</Button>
                ]}
                width={650}
            >
                {currentCoupon && (
                    <div style={{ lineHeight: 1.9 }}>
                        <div><strong>Mã:</strong> {currentCoupon.code}</div>
                        <div><strong>Loại:</strong> {currentCoupon.type === 'percentage' ? 'Phần trăm (%)' : 'Cố định (VNĐ)'}</div>
                        <div><strong>Giá trị:</strong> {currentCoupon.type === 'percentage' ? `${currentCoupon.value}%` : `${(currentCoupon.value || 0).toLocaleString('vi-VN')} VNĐ`}</div>
                        <div><strong>Đơn hàng tối thiểu:</strong> {(currentCoupon.minAmount || 0).toLocaleString('vi-VN')} VNĐ</div>
                        <div><strong>Giảm tối đa:</strong> {currentCoupon.maxDiscount === Infinity || currentCoupon.maxDiscount === undefined ? 'Không giới hạn' : `${currentCoupon.maxDiscount.toLocaleString('vi-VN')} VNĐ`}</div>
                        <div><strong>Giới hạn sử dụng:</strong> {currentCoupon.usageLimit === Infinity || currentCoupon.usageLimit === undefined ? 'Không giới hạn' : `${currentCoupon.usageLimit}`}</div>
                        <div><strong>Đã dùng:</strong> {typeof currentCoupon.usedCount === 'number' ? currentCoupon.usedCount : 0}</div>
                        <div><strong>Hết hạn:</strong> {currentCoupon.expiresAt || currentCoupon.expiryDate ? new Date(currentCoupon.expiresAt || currentCoupon.expiryDate).toLocaleString('vi-VN') : 'Không'}</div>
                        <div><strong>Trạng thái:</strong> {currentCoupon.isActive ? <Tag color="green">Đang hoạt động</Tag> : <Tag color="red">Không hoạt động</Tag>}</div>
                        <div><strong>Tạo lúc:</strong> {currentCoupon.createdAt ? new Date(currentCoupon.createdAt).toLocaleString('vi-VN') : 'N/A'}</div>
                        <div><strong>Cập nhật lúc:</strong> {currentCoupon.updatedAt ? new Date(currentCoupon.updatedAt).toLocaleString('vi-VN') : 'N/A'}</div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CouponManagement;
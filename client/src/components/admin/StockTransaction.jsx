import React, { useState } from 'react';
import {
    Card,
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    Radio,
    Space,
    Tag,
    Statistic,
    Typography,
    Row,
    Col,
    Alert,
    Avatar,
    Tooltip,
    Badge
} from 'antd';
import {
    PlusOutlined,
    HistoryOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    CalendarOutlined,
    UserOutlined,
    FileTextOutlined,
    ExclamationCircleOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const StockTransaction = ({ products, onTransaction }) => {
    const [showModal, setShowModal] = useState(false);
    const [form] = Form.useForm();
    const [transactions, setTransactions] = useState([
        {
            id: 1,
            type: 'in',
            productId: '1',
            productName: 'Cây Kim Tiền',
            quantity: 10,
            reason: 'Nhập hàng từ nhà cung cấp',
            date: '2024-01-15',
            user: 'Admin'
        },
        {
            id: 2,
            type: 'out',
            productId: '2',
            productName: 'Cây Lưỡi Hổ',
            quantity: 5,
            reason: 'Bán cho khách hàng',
            date: '2024-01-14',
            user: 'Admin'
        },
        {
            id: 3,
            type: 'in',
            productId: '3',
            productName: 'Cây Mai Vàng',
            quantity: 8,
            reason: 'Nhập hàng mới',
            date: '2024-01-13',
            user: 'Admin'
        }
    ]);

    const handleTransaction = async (values) => {
        try {
            const product = products.find(p => p._id === values.productId);
            if (!product) {
                throw new Error('Sản phẩm không tồn tại!');
            }

            const newTransaction = {
                id: Date.now(),
                type: values.type,
                productId: values.productId,
                productName: product.name,
                quantity: parseInt(values.quantity),
                reason: values.reason,
                date: new Date().toISOString().split('T')[0],
                user: 'Admin'
            };

            setTransactions([newTransaction, ...transactions]);

            // Cập nhật tồn kho
            const newQuantity = values.type === 'in'
                ? product.stockQuantity + parseInt(values.quantity)
                : product.stockQuantity - parseInt(values.quantity);

            onTransaction(values.productId, newQuantity);

            // Reset form
            form.resetFields();
            setShowModal(false);
        } catch (error) {
            console.error('Lỗi giao dịch:', error);
        }
    };

    // Cột cho bảng giao dịch
    const columns = [
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            render: (type) => (
                <Space>
                    {type === 'in' ? (
                        <ArrowUpOutlined style={{ color: '#52c41a' }} />
                    ) : (
                        <ArrowDownOutlined style={{ color: '#ff4d4f' }} />
                    )}
                    <Tag color={type === 'in' ? 'green' : 'red'}>
                        {type === 'in' ? 'Nhập' : 'Xuất'}
                    </Tag>
                </Space>
            ),
        },
        {
            title: 'Sản Phẩm',
            dataIndex: 'productName',
            key: 'productName',
            render: (name) => (
                <Space>
                    <Avatar size="small" icon={<FileTextOutlined />} />
                    <Text strong>{name}</Text>
                </Space>
            ),
        },
        {
            title: 'Số Lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (quantity, record) => (
                <Badge
                    count={record.type === 'in' ? `+${quantity}` : `-${quantity}`}
                    color={record.type === 'in' ? 'green' : 'red'}
                    style={{ backgroundColor: record.type === 'in' ? '#52c41a' : '#ff4d4f' }}
                />
            ),
        },
        {
            title: 'Lý Do',
            dataIndex: 'reason',
            key: 'reason',
            render: (reason) => (
                <Tooltip title={reason}>
                    <Text ellipsis style={{ maxWidth: 200 }}>
                        {reason}
                    </Text>
                </Tooltip>
            ),
        },
        {
            title: 'Ngày',
            dataIndex: 'date',
            key: 'date',
            render: (date) => (
                <Space>
                    <CalendarOutlined />
                    <Text>{date}</Text>
                </Space>
            ),
        },
        {
            title: 'Người Thực Hiện',
            dataIndex: 'user',
            key: 'user',
            render: (user) => (
                <Space>
                    <UserOutlined />
                    <Text>{user}</Text>
                </Space>
            ),
        },
    ];

    return (
        <Card
            title={
                <Space>
                    <HistoryOutlined style={{ color: '#1890ff' }} />
                    Lịch Sử Nhập/Xuất Kho
                </Space>
            }
            extra={
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setShowModal(true)}
                >
                    Thêm Giao Dịch
                </Button>
            }
            style={{ marginBottom: '24px' }}
        >
            {/* Thống kê giao dịch */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={8}>
                    <Card size="small">
                        <Statistic
                            title="Tổng Nhập"
                            value={transactions.filter(t => t.type === 'in').reduce((sum, t) => sum + t.quantity, 0)}
                            prefix={<ArrowUpOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card size="small">
                        <Statistic
                            title="Tổng Xuất"
                            value={transactions.filter(t => t.type === 'out').reduce((sum, t) => sum + t.quantity, 0)}
                            prefix={<ArrowDownOutlined />}
                            valueStyle={{ color: '#ff4d4f' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card size="small">
                        <Statistic
                            title="Tổng Giao Dịch"
                            value={transactions.length}
                            prefix={<HistoryOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Bảng lịch sử */}
            <Table
                columns={columns}
                dataSource={transactions}
                rowKey="id"
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} giao dịch`,
                }}
                scroll={{ x: 1000 }}
            />

            {/* Modal thêm giao dịch */}
            <Modal
                title="Thêm Giao Dịch Kho"
                open={showModal}
                onCancel={() => {
                    setShowModal(false);
                    form.resetFields();
                }}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleTransaction}
                >
                    <Form.Item
                        name="type"
                        label="Loại giao dịch"
                        rules={[{ required: true, message: 'Vui lòng chọn loại giao dịch!' }]}
                    >
                        <Radio.Group>
                            <Radio.Button value="in">
                                <ArrowUpOutlined style={{ color: '#52c41a' }} />
                                Nhập kho
                            </Radio.Button>
                            <Radio.Button value="out">
                                <ArrowDownOutlined style={{ color: '#ff4d4f' }} />
                                Xuất kho
                            </Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        name="productId"
                        label="Sản phẩm"
                        rules={[{ required: true, message: 'Vui lòng chọn sản phẩm!' }]}
                    >
                        <Select placeholder="Chọn sản phẩm">
                            {products.map(product => (
                                <Option key={product._id} value={product._id}>
                                    {product.name} (Tồn: {product.stockQuantity})
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="quantity"
                        label="Số lượng"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số lượng!' },
                            { type: 'number', min: 1, message: 'Số lượng phải lớn hơn 0!' }
                        ]}
                    >
                        <Input type="number" min="1" placeholder="Nhập số lượng" />
                    </Form.Item>

                    <Form.Item
                        name="reason"
                        label="Lý do"
                        rules={[{ required: true, message: 'Vui lòng nhập lý do!' }]}
                    >
                        <TextArea
                            rows={3}
                            placeholder="Nhập lý do giao dịch..."
                        />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                Thực hiện giao dịch
                            </Button>
                            <Button onClick={() => {
                                setShowModal(false);
                                form.resetFields();
                            }}>
                                Hủy
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default StockTransaction;

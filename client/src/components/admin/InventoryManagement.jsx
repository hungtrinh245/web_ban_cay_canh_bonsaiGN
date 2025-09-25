import React, { useState, useEffect } from 'react';
import {
    Card,
    Row,
    Col,
    Statistic,
    Table,
    Button,
    Input,
    Select,
    Modal,
    Form,
    Space,
    Tag,
    Progress,
    Alert,
    Divider,
    Typography,
    Tooltip,
    Badge,
    Avatar,
    Image,
    DatePicker,
    Dropdown,
    Menu
} from 'antd';
import {
    PlusOutlined,
    SearchOutlined,
    ReloadOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    DownloadOutlined,
    PrinterOutlined,
    FileExcelOutlined,
    FilePdfOutlined,
    BarChartOutlined,
    PieChartOutlined,
    LineChartOutlined,
    WarningOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    InboxOutlined,
    ShoppingOutlined,
    DollarOutlined,
    UserOutlined
} from '@ant-design/icons';
import InventoryChart from './InventoryChart';
import StockTransaction from './StockTransaction';
import InventoryReport from './InventoryReport';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const InventoryManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterStock, setFilterStock] = useState('all');
    const [editingProduct, setEditingProduct] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [form] = Form.useForm();
    const [addForm] = Form.useForm();

    // Mock data - thay thế bằng API call thực tế
    useEffect(() => {
        const mockProducts = [
            {
                _id: '1',
                name: 'Cây Kim Tiền',
                description: 'Cây phong thủy mang lại tài lộc',
                price: 250000,
                category: 'Cây phong thủy',
                stockQuantity: 15,
                images: ['sample-kim-tien.jpg'],
                isFeatured: true
            },
            {
                _id: '2',
                name: 'Cây Lưỡi Hổ',
                description: 'Cây lọc không khí tốt',
                price: 180000,
                category: 'Cây lọc không khí',
                stockQuantity: 8,
                images: ['sample-luoi-ho.jpg'],
                isFeatured: false
            },
            {
                _id: '3',
                name: 'Cây Mai Vàng',
                description: 'Cây cảnh truyền thống',
                price: 350000,
                category: 'Cây cảnh',
                stockQuantity: 3,
                images: ['sample-mai-vang.jpg'],
                isFeatured: true
            },
            {
                _id: '4',
                name: 'Cây Sanh Cổ',
                description: 'Cây bonsai cổ thụ',
                price: 1200000,
                category: 'Bonsai',
                stockQuantity: 0,
                images: ['sample-sanh-co.jpg'],
                isFeatured: false
            },
            {
                _id: '5',
                name: 'Cây Trầu Bà',
                description: 'Cây dây leo trang trí',
                price: 120000,
                category: 'Cây dây leo',
                stockQuantity: 25,
                images: ['sample-trau-ba.jpg'],
                isFeatured: false
            }
        ];
        setProducts(mockProducts);
        setLoading(false);
    }, []);

    // Tính toán thống kê
    const stats = {
        totalProducts: products.length,
        lowStock: products.filter(p => p.stockQuantity <= 5 && p.stockQuantity > 0).length,
        outOfStock: products.filter(p => p.stockQuantity === 0).length,
        totalValue: products.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0)
    };

    // Lọc sản phẩm
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
        const matchesStock = filterStock === 'all' ||
            (filterStock === 'low' && product.stockQuantity <= 5 && product.stockQuantity > 0) ||
            (filterStock === 'out' && product.stockQuantity === 0) ||
            (filterStock === 'normal' && product.stockQuantity > 5);

        return matchesSearch && matchesCategory && matchesStock;
    });

    // Xử lý cập nhật tồn kho
    const handleUpdateStock = async (values) => {
        try {
            setProducts(products.map(p =>
                p._id === editingProduct._id ? { ...p, stockQuantity: parseInt(values.stockQuantity) } : p
            ));
            setShowEditModal(false);
            setEditingProduct(null);
            form.resetFields();
        } catch (error) {
            console.error('Lỗi cập nhật:', error);
        }
    };

    // Xử lý thêm sản phẩm mới
    const handleAddProduct = async (values) => {
        try {
            const newId = Date.now().toString();
            const productToAdd = {
                _id: newId,
                ...values,
                price: parseInt(values.price),
                stockQuantity: parseInt(values.stockQuantity),
                isFeatured: false
            };
            setProducts([...products, productToAdd]);
            setShowAddModal(false);
            addForm.resetFields();
        } catch (error) {
            console.error('Lỗi thêm sản phẩm:', error);
        }
    };

    // Xử lý giao dịch nhập/xuất kho
    const handleTransaction = (productId, newQuantity) => {
        setProducts(products.map(p =>
            p._id === productId ? { ...p, stockQuantity: parseInt(newQuantity) } : p
        ));
    };

    // Mở modal chỉnh sửa
    const openEditModal = (product) => {
        setEditingProduct(product);
        form.setFieldsValue({
            stockQuantity: product.stockQuantity
        });
        setShowEditModal(true);
    };

    // Đóng modal
    const closeModal = () => {
        setShowEditModal(false);
        setShowAddModal(false);
        setEditingProduct(null);
        form.resetFields();
        addForm.resetFields();
    };

    // Làm mới bộ lọc
    const resetFilters = () => {
        setSearchTerm('');
        setFilterCategory('all');
        setFilterStock('all');
    };

    // Cột cho bảng sản phẩm
    const columns = [
        {
            title: 'Sản Phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Space>
                    <Avatar
                        size={48}
                        src={`/images/${record.images[0]}`}
                        shape="square"
                    />
                    <div>
                        <div style={{ fontWeight: 500 }}>{text}</div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            {record.description}
                        </Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Danh Mục',
            dataIndex: 'category',
            key: 'category',
            render: (category) => (
                <Tag color="blue">{category}</Tag>
            ),
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price) => (
                <Text strong style={{ color: '#52c41a' }}>
                    {price.toLocaleString('vi-VN')}đ
                </Text>
            ),
        },
        {
            title: 'Tồn Kho',
            dataIndex: 'stockQuantity',
            key: 'stockQuantity',
            render: (quantity) => {
                let color = 'green';
                let icon = <CheckCircleOutlined />;

                if (quantity === 0) {
                    color = 'red';
                    icon = <ExclamationCircleOutlined />;
                } else if (quantity <= 5) {
                    color = 'orange';
                    icon = <WarningOutlined />;
                }

                return (
                    <Space>
                        <Badge
                            count={quantity}
                            showZero
                            color={color}
                            style={{ backgroundColor: color }}
                        />
                        {icon}
                    </Space>
                );
            },
        },
        {
            title: 'Trạng Thái',
            key: 'status',
            render: (_, record) => {
                const { stockQuantity } = record;
                let status = 'success';
                let text = 'Còn hàng';
                let icon = <CheckCircleOutlined />;

                if (stockQuantity === 0) {
                    status = 'error';
                    text = 'Hết hàng';
                    icon = <ExclamationCircleOutlined />;
                } else if (stockQuantity <= 5) {
                    status = 'warning';
                    text = 'Sắp hết';
                    icon = <WarningOutlined />;
                }

                return (
                    <Tag icon={icon} color={status}>
                        {text}
                    </Tag>
                );
            },
        },
        {
            title: 'Thao Tác',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Chỉnh sửa tồn kho">
                        <Button
                            type="primary"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => openEditModal(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Xem chi tiết">
                        <Button
                            size="small"
                            icon={<EyeOutlined />}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <div className="ant-spin-dot">
                    <i></i><i></i><i></i><i></i>
                </div>
                <div style={{ marginTop: '16px' }}>Đang tải dữ liệu...</div>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px' }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <Title level={2} style={{ margin: 0 }}>
                    <InboxOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                    Quản Lý Tồn Kho
                </Title>
                <Text type="secondary">
                    Theo dõi và quản lý tồn kho sản phẩm một cách hiệu quả
                </Text>
            </div>

            {/* Dashboard Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Tổng Sản Phẩm"
                            value={stats.totalProducts}
                            prefix={<ShoppingOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Sắp Hết Hàng"
                            value={stats.lowStock}
                            prefix={<WarningOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Hết Hàng"
                            value={stats.outOfStock}
                            prefix={<ExclamationCircleOutlined />}
                            valueStyle={{ color: '#ff4d4f' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Tổng Giá Trị"
                            value={stats.totalValue}
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                            formatter={(value) => `${value.toLocaleString('vi-VN')}đ`}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Cảnh báo tồn kho */}
            {(stats.outOfStock > 0 || stats.lowStock > 0) && (
                <Alert
                    message="Cảnh Báo Tồn Kho"
                    description={
                        <div>
                            {stats.outOfStock > 0 && (
                                <div>• {stats.outOfStock} sản phẩm đã hết hàng</div>
                            )}
                            {stats.lowStock > 0 && (
                                <div>• {stats.lowStock} sản phẩm sắp hết hàng (≤5)</div>
                            )}
                        </div>
                    }
                    type="warning"
                    showIcon
                    style={{ marginBottom: '24px' }}
                />
            )}

            {/* Filters */}
            <Card style={{ marginBottom: '24px' }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={8} md={6}>
                        <Search
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Col xs={24} sm={8} md={6}>
                        <Select
                            placeholder="Chọn danh mục"
                            value={filterCategory}
                            onChange={setFilterCategory}
                            style={{ width: '100%' }}
                            allowClear
                        >
                            <Option value="all">Tất cả danh mục</Option>
                            <Option value="Cây phong thủy">Cây phong thủy</Option>
                            <Option value="Cây lọc không khí">Cây lọc không khí</Option>
                            <Option value="Cây cảnh">Cây cảnh</Option>
                            <Option value="Bonsai">Bonsai</Option>
                            <Option value="Cây dây leo">Cây dây leo</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={8} md={6}>
                        <Select
                            placeholder="Trạng thái tồn kho"
                            value={filterStock}
                            onChange={setFilterStock}
                            style={{ width: '100%' }}
                            allowClear
                        >
                            <Option value="all">Tất cả tồn kho</Option>
                            <Option value="low">Sắp hết hàng (≤5)</Option>
                            <Option value="out">Hết hàng (0)</Option>
                            <Option value="normal">Bình thường (&gt;5)</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={8} md={6}>
                        <Space>
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={resetFilters}
                            >
                                Làm mới
                            </Button>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setShowAddModal(true)}
                            >
                                Thêm Sản Phẩm
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* Products Table */}
            <Card
                title={
                    <Space>
                        <ShoppingOutlined />
                        Danh Sách Sản Phẩm
                        <Badge count={filteredProducts.length} style={{ backgroundColor: '#52c41a' }} />
                    </Space>
                }
                extra={
                    <Space>
                        <Dropdown overlay={
                            <Menu>
                                <Menu.Item key="excel" icon={<FileExcelOutlined />}>
                                    Xuất Excel
                                </Menu.Item>
                                <Menu.Item key="pdf" icon={<FilePdfOutlined />}>
                                    Xuất PDF
                                </Menu.Item>
                                <Menu.Item key="print" icon={<PrinterOutlined />}>
                                    In báo cáo
                                </Menu.Item>
                            </Menu>
                        }>
                            <Button icon={<DownloadOutlined />}>
                                Xuất báo cáo
                            </Button>
                        </Dropdown>
                    </Space>
                }
            >
                <Table
                    columns={columns}
                    dataSource={filteredProducts}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} sản phẩm`,
                    }}
                    scroll={{ x: 1200 }}
                />
            </Card>

            {/* Biểu đồ thống kê */}
            <InventoryChart products={products} />

            {/* Lịch sử nhập/xuất kho */}
            <StockTransaction products={products} onTransaction={handleTransaction} />

            {/* Báo cáo tồn kho */}
            <InventoryReport products={products} />

            {/* Edit Stock Modal */}
            <Modal
                title="Cập Nhật Tồn Kho"
                open={showEditModal}
                onCancel={closeModal}
                footer={null}
                width={500}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleUpdateStock}
                >
                    <Form.Item label="Sản phẩm">
                        <Text strong>{editingProduct?.name}</Text>
                    </Form.Item>
                    <Form.Item label="Tồn kho hiện tại">
                        <Text type="secondary">{editingProduct?.stockQuantity}</Text>
                    </Form.Item>
                    <Form.Item
                        name="stockQuantity"
                        label="Số lượng mới"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số lượng!' },
                            { type: 'number', min: 0, message: 'Số lượng không thể âm!' }
                        ]}
                    >
                        <Input type="number" min="0" placeholder="Nhập số lượng mới" />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                Cập nhật
                            </Button>
                            <Button onClick={closeModal}>
                                Hủy
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Add Product Modal */}
            <Modal
                title="Thêm Sản Phẩm Mới"
                open={showAddModal}
                onCancel={closeModal}
                footer={null}
                width={600}
            >
                <Form
                    form={addForm}
                    layout="vertical"
                    onFinish={handleAddProduct}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Tên sản phẩm"
                                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                            >
                                <Input placeholder="Nhập tên sản phẩm" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="category"
                                label="Danh mục"
                                rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                            >
                                <Select placeholder="Chọn danh mục">
                                    <Option value="Cây phong thủy">Cây phong thủy</Option>
                                    <Option value="Cây lọc không khí">Cây lọc không khí</Option>
                                    <Option value="Cây cảnh">Cây cảnh</Option>
                                    <Option value="Bonsai">Bonsai</Option>
                                    <Option value="Cây dây leo">Cây dây leo</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                    >
                        <Input.TextArea rows={3} placeholder="Nhập mô tả sản phẩm" />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="price"
                                label="Giá (VNĐ)"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập giá!' },
                                    { type: 'number', min: 0, message: 'Giá không thể âm!' }
                                ]}
                            >
                                <Input type="number" min="0" placeholder="Nhập giá" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="stockQuantity"
                                label="Số lượng tồn kho"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số lượng!' },
                                    { type: 'number', min: 0, message: 'Số lượng không thể âm!' }
                                ]}
                            >
                                <Input type="number" min="0" placeholder="Nhập số lượng" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                Thêm sản phẩm
                            </Button>
                            <Button onClick={closeModal}>
                                Hủy
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default InventoryManagement;

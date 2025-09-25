// client/src/components/admin/CategoryManagement.jsx
import React, { useState, useEffect } from 'react';
import {
    Card,
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    Space,
    Tag,
    Tooltip,
    Popconfirm,
    message,
    Row,
    Col,
    Statistic,
    Typography,
    Badge,
    Switch,
    InputNumber,
    Image,
    Alert,
    Divider,
    Dropdown,
    Menu
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    SearchOutlined,
    ReloadOutlined,
    FolderOutlined,
    SortAscendingOutlined,
    SortDescendingOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    WarningOutlined,
    InfoCircleOutlined,
    DownloadOutlined,
    FileExcelOutlined,
    FilePdfOutlined,
    PrinterOutlined,
    SettingOutlined,
    SwapOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [sortBy, setSortBy] = useState('sortOrder');
    const [sortOrder, setSortOrder] = useState('asc');
    const [form] = Form.useForm();

    // Fetch categories
    const fetchCategories = async () => {
        try {
            setLoading(true);
            console.log('Đang gọi API categories...');
            // Sử dụng URL đầy đủ
            const response = await fetch('http://localhost:5001/api/categories/test');

            if (response.ok) {
                const data = await response.json();
                console.log('Data nhận được:', data);
                console.log('Categories data:', data.categories);
                setCategories(data.categories);
                setTotal(data.count);
                console.log('Categories loaded:', data.categories);
            } else {
                console.error('Response không OK:', response.status, response.statusText);
                message.error('Lỗi khi tải danh sách danh mục');
            }
        } catch (error) {
            console.error('Lỗi fetch categories:', error);
            message.error('Lỗi kết nối server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [currentPage, pageSize, searchTerm, sortBy, sortOrder]);

    // Handle form submission
    const handleSubmit = async (values) => {
        try {
            const token = localStorage.getItem('token');
            const url = editingCategory
                ? `http://localhost:5001/api/categories/${editingCategory._id}`
                : 'http://localhost:5001/api/categories/test-create';

            const method = editingCategory ? 'PUT' : 'POST';

            console.log('Submitting category:', values);
            console.log('URL:', url);
            console.log('Method:', method);
            console.log('Token present:', !!token);

            // Chuẩn bị headers
            const headers = {
                'Content-Type': 'application/json'
            };

            // Chỉ thêm Authorization header nếu có token và không phải route test
            if (token && editingCategory) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(url, {
                method,
                headers,
                body: JSON.stringify(values)
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (response.ok) {
                const data = await response.json();
                message.success(data.message);
                setShowModal(false);
                form.resetFields();
                setEditingCategory(null);
                fetchCategories();
            } else {
                // Kiểm tra nếu response có body
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    message.error(errorData.message || 'Có lỗi xảy ra');
                } else {
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    message.error(`Lỗi ${response.status}: ${response.statusText}`);
                }
            }
        } catch (error) {
            console.error('Lỗi submit form:', error);
            message.error('Lỗi kết nối server: ' + error.message);
        }
    };

    // Handle delete category
    const handleDelete = async (categoryId) => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                message.error('Bạn cần đăng nhập để thực hiện thao tác này');
                return;
            }

            const response = await fetch(`http://localhost:5001/api/categories/test-delete/${categoryId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                message.success(data.message);
                fetchCategories();
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Không thể xóa danh mục');
            }
        } catch (error) {
            console.error('Lỗi delete category:', error);
            message.error('Lỗi kết nối server');
        }
    };

    // Handle toggle status
    const handleToggleStatus = async (categoryId, currentStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/categories/${categoryId}/toggle-status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                message.success(data.message);
                fetchCategories();
            } else {
                message.error('Không thể thay đổi trạng thái');
            }
        } catch (error) {
            console.error('Lỗi toggle status:', error);
            message.error('Lỗi kết nối server');
        }
    };

    // Handle sort order change
    const handleSortOrderChange = async (categoryId, newSortOrder) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/categories/${categoryId}/sort-order`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ sortOrder: newSortOrder })
            });

            if (response.ok) {
                message.success('Cập nhật thứ tự thành công');
                fetchCategories();
            } else {
                message.error('Không thể cập nhật thứ tự');
            }
        } catch (error) {
            console.error('Lỗi update sort order:', error);
            message.error('Lỗi kết nối server');
        }
    };

    // Open edit modal
    const openEditModal = (category) => {
        setEditingCategory(category);
        form.setFieldsValue({
            name: category.name,
            description: category.description,
            image: category.image,
            parentCategory: category.parentCategory?._id,
            metaTitle: category.metaTitle,
            metaDescription: category.metaDescription,
            sortOrder: category.sortOrder,
            isActive: category.isActive
        });
        setShowModal(true);
    };

    // Close modal
    const closeModal = () => {
        setShowModal(false);
        setEditingCategory(null);
        form.resetFields();
    };

    // Table columns
    const columns = [
        {
            title: 'Danh Mục',
            dataIndex: 'name',
            key: 'name',
            render: (name, record) => (
                <Space>
                    <FolderOutlined style={{ color: record.isActive ? '#52c41a' : '#d9d9d9' }} />
                    <div>
                        <Text strong>{name}</Text>
                        {record.description && (
                            <div>
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    {record.description}
                                </Text>
                            </div>
                        )}
                    </div>
                </Space>
            ),
        },
        {
            title: 'Số Sản Phẩm',
            dataIndex: 'productCount',
            key: 'productCount',
            render: (count, record) => {
                console.log('Rendering productCount:', count, 'for record:', record.name);
                return (
                    <Badge
                        count={count}
                        showZero
                        color={count === 0 ? 'default' : count <= 5 ? 'warning' : 'success'}
                        style={{ backgroundColor: count === 0 ? '#d9d9d9' : count <= 5 ? '#faad14' : '#52c41a' }}
                    />
                );
            },
        },
        {
            title: 'Thứ Tự',
            dataIndex: 'sortOrder',
            key: 'sortOrder',
            render: (sortOrder, record) => {
                console.log('Rendering sortOrder:', sortOrder, 'for record:', record.name);
                return (
                    <Space>
                        <InputNumber
                            size="small"
                            value={sortOrder}
                            min={0}
                            onChange={(value) => handleSortOrderChange(record._id, value)}
                            style={{ width: 80 }}
                        />
                        <SwapOutlined style={{ color: '#1890ff' }} />
                    </Space>
                );
            },
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive, record) => (
                <Switch
                    checked={isActive}
                    onChange={() => handleToggleStatus(record._id, isActive)}
                    checkedChildren="Kích hoạt"
                    unCheckedChildren="Vô hiệu"
                />
            ),
        },
        {
            title: 'Thao Tác',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Chỉnh sửa">
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
                            onClick={() => openEditModal(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Xác nhận xóa"
                        description={`Bạn có chắc chắn muốn xóa danh mục "${record.name}"?`}
                        onConfirm={() => handleDelete(record._id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        disabled={record.productCount > 0}
                    >
                        <Tooltip title={record.productCount > 0 ? 'Không thể xóa vì có sản phẩm' : 'Xóa danh mục'}>
                            <Button
                                type="primary"
                                danger
                                size="small"
                                icon={<DeleteOutlined />}
                                disabled={record.productCount > 0}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Statistics
    const stats = {
        totalCategories: categories.length,
        activeCategories: categories.filter(c => c.isActive).length,
        inactiveCategories: categories.filter(c => !c.isActive).length,
        categoriesWithProducts: categories.filter(c => c.productCount > 0).length,
        emptyCategories: categories.filter(c => c.productCount === 0).length
    };

    return (
        <div style={{ padding: '24px' }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <Title level={2} style={{ margin: 0 }}>
                    <FolderOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                    Quản Lý Danh Mục
                </Title>
                <Text type="secondary">
                    Quản lý và tổ chức danh mục sản phẩm một cách hiệu quả
                </Text>
            </div>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} lg={4}>
                    <Card size="small">
                        <Statistic
                            title="Tổng Danh Mục"
                            value={stats.totalCategories}
                            prefix={<FolderOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={4}>
                    <Card size="small">
                        <Statistic
                            title="Đang Kích Hoạt"
                            value={stats.activeCategories}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={4}>
                    <Card size="small">
                        <Statistic
                            title="Vô Hiệu Hóa"
                            value={stats.inactiveCategories}
                            prefix={<ExclamationCircleOutlined />}
                            valueStyle={{ color: '#ff4d4f' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={4}>
                    <Card size="small">
                        <Statistic
                            title="Có Sản Phẩm"
                            value={stats.categoriesWithProducts}
                            prefix={<InfoCircleOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={4}>
                    <Card size="small">
                        <Statistic
                            title="Trống"
                            value={stats.emptyCategories}
                            prefix={<WarningOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Search and Actions */}
            <Card style={{ marginBottom: '24px' }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={12} md={8}>
                        <Search
                            placeholder="Tìm kiếm danh mục..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onSearch={() => {
                                setCurrentPage(1);
                                fetchCategories();
                            }}
                            allowClear
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Space>
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={() => {
                                    setSearchTerm('');
                                    setCurrentPage(1);
                                    fetchCategories();
                                }}
                            >
                                Làm mới
                            </Button>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setShowModal(true)}
                            >
                                Thêm Danh Mục
                            </Button>
                        </Space>
                    </Col>
                    <Col xs={24} sm={24} md={8}>
                        <Space>
                            <Text>Sắp xếp theo:</Text>
                            <Select
                                value={sortBy}
                                onChange={setSortBy}
                                style={{ width: 120 }}
                            >
                                <Option value="name">Tên</Option>
                                <Option value="sortOrder">Thứ tự</Option>
                                <Option value="createdAt">Ngày tạo</Option>
                                <Option value="productCount">Số sản phẩm</Option>
                            </Select>
                            <Button
                                icon={sortOrder === 'asc' ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            />
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* Categories Table */}
            <Card
                title={
                    <Space>
                        <FolderOutlined />
                        Danh Sách Danh Mục
                        <Badge count={total} style={{ backgroundColor: '#52c41a' }} />
                    </Space>
                }
                extra={
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
                }
            >
                <Table
                    columns={columns}
                    dataSource={categories}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: total,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} danh mục`,
                        onChange: (page, size) => {
                            setCurrentPage(page);
                            setPageSize(size);
                        }
                    }}
                    scroll={{ x: 1200 }}
                />
            </Card>

            {/* Add/Edit Category Modal */}
            <Modal
                title={editingCategory ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Mới'}
                open={showModal}
                onCancel={closeModal}
                footer={null}
                width={700}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Tên danh mục"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập tên danh mục!' },
                                    { max: 100, message: 'Tên danh mục không được quá 100 ký tự!' }
                                ]}
                            >
                                <Input placeholder="Nhập tên danh mục" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="sortOrder"
                                label="Thứ tự sắp xếp"
                                rules={[
                                    { type: 'number', min: 0, message: 'Thứ tự phải là số dương!' }
                                ]}
                            >
                                <InputNumber
                                    placeholder="0"
                                    min={0}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[
                            { max: 500, message: 'Mô tả không được quá 500 ký tự!' }
                        ]}
                    >
                        <TextArea
                            rows={3}
                            placeholder="Nhập mô tả danh mục..."
                        />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="image"
                                label="Hình ảnh"
                            >
                                <Input placeholder="URL hình ảnh" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="metaTitle"
                                label="Meta Title"
                                rules={[
                                    { max: 60, message: 'Meta title không được quá 60 ký tự!' }
                                ]}
                            >
                                <Input placeholder="Meta title cho SEO" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="isActive"
                                label="Trạng thái"
                                valuePropName="checked"
                            >
                                <Switch
                                    checkedChildren="Kích hoạt"
                                    unCheckedChildren="Vô hiệu"
                                    defaultChecked
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="metaDescription"
                        label="Meta Description"
                        rules={[
                            { max: 160, message: 'Meta description không được quá 160 ký tự!' }
                        ]}
                    >
                        <TextArea
                            rows={2}
                            placeholder="Meta description cho SEO..."
                        />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {editingCategory ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                            <Button onClick={closeModal}>
                                Hủy
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Info Alert */}
            <Alert
                message="Lưu ý quan trọng"
                description={
                    <div>
                        <div>• Chỉ có thể xóa danh mục không có sản phẩm</div>
                        <div>• Tên danh mục phải là duy nhất</div>
                        <div>• Slug sẽ được tạo tự động từ tên danh mục</div>
                    </div>
                }
                type="info"
                showIcon
                style={{ marginTop: '16px' }}
            />
        </div>
    );
};

export default CategoryManagement;
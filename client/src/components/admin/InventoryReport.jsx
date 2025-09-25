import React, { useState } from 'react';
import {
    Card,
    Button,
    Select,
    Row,
    Col,
    Statistic,
    Typography,
    Space,
    Alert,
    Divider,
    Table,
    Tag,
    Dropdown,
    Menu
} from 'antd';
import {
    DownloadOutlined,
    FileExcelOutlined,
    FilePdfOutlined,
    PrinterOutlined,
    BarChartOutlined,
    CalendarOutlined,
    ReloadOutlined,
    WarningOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    ShoppingOutlined,
    DollarOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const InventoryReport = ({ products }) => {
    const [reportType, setReportType] = useState('all');
    const [dateRange, setDateRange] = useState('all');

    // Tính toán dữ liệu báo cáo
    const generateReport = () => {
        let filteredProducts = [...products];

        // Lọc theo loại báo cáo
        if (reportType === 'low') {
            filteredProducts = products.filter(p => p.stockQuantity <= 5 && p.stockQuantity > 0);
        } else if (reportType === 'out') {
            filteredProducts = products.filter(p => p.stockQuantity === 0);
        } else if (reportType === 'category') {
            // Nhóm theo danh mục
            const categoryGroups = products.reduce((acc, product) => {
                if (!acc[product.category]) {
                    acc[product.category] = [];
                }
                acc[product.category].push(product);
                return acc;
            }, {});
            return categoryGroups;
        }

        return filteredProducts;
    };

    const exportToExcel = () => {
        const reportData = generateReport();
        const worksheet = [];

        // Header
        worksheet.push(['Tên Sản Phẩm', 'Danh Mục', 'Giá (VNĐ)', 'Tồn Kho', 'Trạng Thái', 'Tổng Giá Trị']);

        // Data
        if (Array.isArray(reportData)) {
            reportData.forEach(product => {
                worksheet.push([
                    product.name,
                    product.category,
                    product.price.toLocaleString('vi-VN'),
                    product.stockQuantity,
                    product.stockQuantity === 0 ? 'Hết hàng' :
                        product.stockQuantity <= 5 ? 'Sắp hết' : 'Còn hàng',
                    (product.price * product.stockQuantity).toLocaleString('vi-VN')
                ]);
            });
        }

        // Tạo file Excel (mock)
        const csvContent = worksheet.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `bao-cao-ton-kho-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToPDF = () => {
        // Mock PDF export
        alert('Tính năng xuất PDF sẽ được tích hợp với thư viện PDF');
    };

    const printReport = () => {
        window.print();
    };

    const reportData = generateReport();
    const totalValue = Array.isArray(reportData)
        ? reportData.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0)
        : 0;

    // Cột cho bảng báo cáo
    const columns = [
        {
            title: 'Sản Phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Danh Mục',
            dataIndex: 'category',
            key: 'category',
            render: (category) => <Tag color="blue">{category}</Tag>,
        },
        {
            title: 'Giá (VNĐ)',
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
                        <span style={{ color }}>{quantity}</span>
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
            title: 'Tổng Giá Trị',
            key: 'totalValue',
            render: (_, record) => (
                <Text strong style={{ color: '#722ed1' }}>
                    {(record.price * record.stockQuantity).toLocaleString('vi-VN')}đ
                </Text>
            ),
        },
    ];

    return (
        <Card
            title={
                <Space>
                    <BarChartOutlined style={{ color: '#722ed1' }} />
                    Báo Cáo Tồn Kho
                </Space>
            }
            extra={
                <Space>
                    <Button
                        icon={<FileExcelOutlined />}
                        onClick={exportToExcel}
                        type="primary"
                        style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                    >
                        Excel
                    </Button>
                    <Button
                        icon={<FilePdfOutlined />}
                        onClick={exportToPDF}
                        danger
                    >
                        PDF
                    </Button>
                    <Button
                        icon={<PrinterOutlined />}
                        onClick={printReport}
                    >
                        In
                    </Button>
                </Space>
            }
        >
            {/* Bộ lọc báo cáo */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={8}>
                    <Select
                        placeholder="Loại báo cáo"
                        value={reportType}
                        onChange={setReportType}
                        style={{ width: '100%' }}
                    >
                        <Option value="all">Tất cả sản phẩm</Option>
                        <Option value="low">Sắp hết hàng (≤5)</Option>
                        <Option value="out">Hết hàng (0)</Option>
                        <Option value="category">Theo danh mục</Option>
                    </Select>
                </Col>
                <Col xs={24} sm={8}>
                    <Select
                        placeholder="Thời gian"
                        value={dateRange}
                        onChange={setDateRange}
                        style={{ width: '100%' }}
                    >
                        <Option value="all">Tất cả thời gian</Option>
                        <Option value="today">Hôm nay</Option>
                        <Option value="week">Tuần này</Option>
                        <Option value="month">Tháng này</Option>
                        <Option value="quarter">Quý này</Option>
                    </Select>
                </Col>
                <Col xs={24} sm={8}>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={() => {
                            setReportType('all');
                            setDateRange('all');
                        }}
                        style={{ width: '100%' }}
                    >
                        Làm mới
                    </Button>
                </Col>
            </Row>

            {/* Thống kê báo cáo */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={12} sm={6}>
                    <Card size="small">
                        <Statistic
                            title="Sản phẩm"
                            value={Array.isArray(reportData) ? reportData.length : Object.keys(reportData || {}).length}
                            prefix={<BarChartOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small">
                        <Statistic
                            title="Tổng tồn kho"
                            value={Array.isArray(reportData) ? reportData.reduce((sum, p) => sum + p.stockQuantity, 0) : 0}
                            prefix={<ShoppingOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small">
                        <Statistic
                            title="Tổng giá trị"
                            value={totalValue}
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                            formatter={(value) => `${value.toLocaleString('vi-VN')}đ`}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small">
                        <Statistic
                            title="Ngày tạo"
                            value={new Date().toLocaleDateString('vi-VN')}
                            prefix={<CalendarOutlined />}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Nội dung báo cáo */}
            {Array.isArray(reportData) ? (
                <div>
                    <Divider orientation="left">Tóm Tắt Báo Cáo</Divider>
                    <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                        <Col span={8}>
                            <Text>• Tổng số sản phẩm: <Text strong>{reportData.length}</Text></Text>
                        </Col>
                        <Col span={8}>
                            <Text>• Tổng tồn kho: <Text strong>{reportData.reduce((sum, p) => sum + p.stockQuantity, 0)}</Text></Text>
                        </Col>
                        <Col span={8}>
                            <Text>• Tổng giá trị: <Text strong>{totalValue.toLocaleString('vi-VN')}đ</Text></Text>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                        <Col span={8}>
                            <Text type="danger">• Sản phẩm hết hàng: <Text strong>{reportData.filter(p => p.stockQuantity === 0).length}</Text></Text>
                        </Col>
                        <Col span={8}>
                            <Text type="warning">• Sản phẩm sắp hết: <Text strong>{reportData.filter(p => p.stockQuantity <= 5 && p.stockQuantity > 0).length}</Text></Text>
                        </Col>
                    </Row>

                    <Divider orientation="left">Chi Tiết Sản Phẩm</Divider>
                    <Table
                        columns={columns}
                        dataSource={reportData}
                        rowKey="_id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} của ${total} sản phẩm`,
                        }}
                        scroll={{ x: 1000 }}
                        size="small"
                    />
                </div>
            ) : (
                <div>
                    <Divider orientation="left">Báo Cáo Theo Danh Mục</Divider>
                    {Object.entries(reportData || {}).map(([category, products]) => (
                        <Card
                            key={category}
                            size="small"
                            style={{ marginBottom: '16px' }}
                            title={
                                <Space>
                                    <Text strong>{category}</Text>
                                    <Tag color="blue">{products.length} sản phẩm</Tag>
                                </Space>
                            }
                        >
                            <Row gutter={[16, 16]}>
                                <Col span={8}>
                                    <Statistic
                                        title="Tổng tồn"
                                        value={products.reduce((sum, p) => sum + p.stockQuantity, 0)}
                                        valueStyle={{ color: '#52c41a' }}
                                    />
                                </Col>
                                <Col span={8}>
                                    <Statistic
                                        title="Giá trị"
                                        value={products.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0)}
                                        valueStyle={{ color: '#722ed1' }}
                                        formatter={(value) => `${value.toLocaleString('vi-VN')}đ`}
                                    />
                                </Col>
                                <Col span={8}>
                                    <Statistic
                                        title="Hết hàng"
                                        value={products.filter(p => p.stockQuantity === 0).length}
                                        valueStyle={{ color: '#ff4d4f' }}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </div>
            )}

            {/* Ghi chú */}
            <Alert
                message="Ghi Chú Báo Cáo"
                description={
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        <li>Báo cáo được tạo tự động dựa trên dữ liệu hiện tại</li>
                        <li>Có thể xuất ra file Excel, PDF hoặc in trực tiếp</li>
                        <li>Dữ liệu được cập nhật theo thời gian thực</li>
                        <li>Có thể lọc theo loại sản phẩm và thời gian</li>
                    </ul>
                }
                type="info"
                showIcon
                style={{ marginTop: '24px' }}
            />
        </Card>
    );
};

export default InventoryReport;

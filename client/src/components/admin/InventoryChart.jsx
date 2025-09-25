import React from 'react';
import { Card, Row, Col, Progress, Statistic, Alert, Typography, Space, Divider } from 'antd';
import {
    BarChartOutlined,
    PieChartOutlined,
    LineChartOutlined,
    WarningOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    ShoppingOutlined,
    DollarOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const InventoryChart = ({ products }) => {
    // Tính toán dữ liệu cho biểu đồ
    const categoryStats = products.reduce((acc, product) => {
        if (!acc[product.category]) {
            acc[product.category] = {
                count: 0,
                totalStock: 0,
                totalValue: 0
            };
        }
        acc[product.category].count++;
        acc[product.category].totalStock += product.stockQuantity;
        acc[product.category].totalValue += product.price * product.stockQuantity;
        return acc;
    }, {});

    const stockLevels = {
        outOfStock: products.filter(p => p.stockQuantity === 0).length,
        lowStock: products.filter(p => p.stockQuantity <= 5 && p.stockQuantity > 0).length,
        normalStock: products.filter(p => p.stockQuantity > 5).length
    };

    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0);

    // Màu sắc cho biểu đồ
    const colors = {
        outOfStock: '#ff4d4f',
        lowStock: '#faad14',
        normalStock: '#52c41a',
        category1: '#1890ff',
        category2: '#722ed1',
        category3: '#13c2c2',
        category4: '#fa8c16',
        category5: '#a0d911'
    };

    return (
        <div style={{ marginBottom: '24px' }}>
            <Row gutter={[16, 16]}>
                {/* Biểu đồ tròn - Phân bố tồn kho */}
                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <Space>
                                <PieChartOutlined style={{ color: '#1890ff' }} />
                                Phân Bố Tồn Kho
                            </Space>
                        }
                        size="small"
                    >
                        <Row gutter={[16, 16]}>
                            <Col span={8}>
                                <Statistic
                                    title="Còn hàng (>5)"
                                    value={stockLevels.normalStock}
                                    valueStyle={{ color: colors.normalStock }}
                                    suffix={
                                        <Text type="secondary">
                                            {totalProducts > 0 ? Math.round((stockLevels.normalStock / totalProducts) * 100) : 0}%
                                        </Text>
                                    }
                                />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title="Sắp hết (≤5)"
                                    value={stockLevels.lowStock}
                                    valueStyle={{ color: colors.lowStock }}
                                    suffix={
                                        <Text type="secondary">
                                            {totalProducts > 0 ? Math.round((stockLevels.lowStock / totalProducts) * 100) : 0}%
                                        </Text>
                                    }
                                />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title="Hết hàng (0)"
                                    value={stockLevels.outOfStock}
                                    valueStyle={{ color: colors.outOfStock }}
                                    suffix={
                                        <Text type="secondary">
                                            {totalProducts > 0 ? Math.round((stockLevels.outOfStock / totalProducts) * 100) : 0}%
                                        </Text>
                                    }
                                />
                            </Col>
                        </Row>

                        <Divider />

                        <div>
                            <Text type="secondary">Tổng sản phẩm: {totalProducts}</Text>
                            <Progress
                                percent={100}
                                strokeColor={
                                    totalProducts > 0
                                        ? {
                                              '0%': colors.normalStock,
                                              [`${(stockLevels.normalStock / totalProducts) * 100}%`]: colors.lowStock,
                                              [`${((stockLevels.normalStock + stockLevels.lowStock) / totalProducts) * 100}%`]: colors.outOfStock,
                                              '100%': colors.outOfStock
                                          }
                                        : {
                                              '0%': colors.normalStock,
                                              '100%': colors.normalStock
                                          }
                                }
                                showInfo={false}
                            />
                        </div>
                    </Card>
                </Col>

                {/* Biểu đồ cột - Theo danh mục */}
                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <Space>
                                <BarChartOutlined style={{ color: '#722ed1' }} />
                                Tồn Kho Theo Danh Mục
                            </Space>
                        }
                        size="small"
                    >
                        {Object.entries(categoryStats).map(([category, stats], index) => {
                            const colorKeys = Object.keys(colors).filter(key => key.startsWith('category'));
                            const color = colors[colorKeys[index % colorKeys.length]];
                            const maxStock = Math.max(...Object.values(categoryStats).map(s => s.totalStock));
                            const percentage = maxStock > 0 ? (stats.totalStock / maxStock) * 100 : 0;

                            return (
                                <div key={category} style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <Text>{category}</Text>
                                        <Text strong>{stats.totalStock}</Text>
                                    </div>
                                    <Progress
                                        percent={percentage}
                                        strokeColor={color}
                                        showInfo={false}
                                        size="small"
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                            {stats.count} sản phẩm
                                        </Text>
                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                            {stats.totalValue.toLocaleString('vi-VN')}đ
                                        </Text>
                                    </div>
                                </div>
                            );
                        })}
                    </Card>
                </Col>
            </Row>

            {/* Thống kê tổng quan */}
            <Card
                title={
                    <Space>
                        <LineChartOutlined style={{ color: '#52c41a' }} />
                        Thống Kê Tổng Quan
                    </Space>
                }
                style={{ marginTop: '16px' }}
            >
                <Row gutter={[16, 16]}>
                    <Col xs={12} sm={6}>
                        <Statistic
                            title="Tổng sản phẩm"
                            value={totalProducts}
                            prefix={<ShoppingOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Col>
                    <Col xs={12} sm={6}>
                        <Statistic
                            title="Tổng tồn kho"
                            value={products.reduce((sum, p) => sum + p.stockQuantity, 0)}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Col>
                    <Col xs={12} sm={6}>
                        <Statistic
                            title="Tổng giá trị"
                            value={totalValue}
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                            formatter={(value) => `${value.toLocaleString('vi-VN')}đ`}
                        />
                    </Col>
                    <Col xs={12} sm={6}>
                        <Statistic
                            title="Danh mục"
                            value={Object.keys(categoryStats).length}
                            prefix={<BarChartOutlined />}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                    </Col>
                </Row>

                {/* Cảnh báo tồn kho */}
                <Alert
                    message="Cảnh Báo Tồn Kho"
                    description={
                        <div>
                            {stockLevels.outOfStock > 0 && (
                                <div>• {stockLevels.outOfStock} sản phẩm đã hết hàng</div>
                            )}
                            {stockLevels.lowStock > 0 && (
                                <div>• {stockLevels.lowStock} sản phẩm sắp hết hàng (≤5)</div>
                            )}
                            {stockLevels.outOfStock === 0 && stockLevels.lowStock === 0 && (
                                <div>• Tất cả sản phẩm đều có đủ tồn kho</div>
                            )}
                        </div>
                    }
                    type={stockLevels.outOfStock > 0 ? "error" : stockLevels.lowStock > 0 ? "warning" : "success"}
                    showIcon
                    style={{ marginTop: '16px' }}
                />
            </Card>
        </div>
    );
};

export default InventoryChart;

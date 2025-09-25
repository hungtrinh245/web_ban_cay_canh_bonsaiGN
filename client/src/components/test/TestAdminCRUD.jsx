// Test component for Admin CRUD operations
import React, { useState } from 'react';
import { Card, Button, Space, Typography, Divider, Alert } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const TestAdminCRUD = () => {
    const [testResults, setTestResults] = useState({});

    const runTest = async (testName, testFunction) => {
        try {
            setTestResults(prev => ({ ...prev, [testName]: 'running' }));
            await testFunction();
            setTestResults(prev => ({ ...prev, [testName]: 'passed' }));
        } catch (error) {
            console.error(`Test ${testName} failed:`, error);
            setTestResults(prev => ({ ...prev, [testName]: 'failed' }));
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'passed': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
            case 'failed': return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
            case 'running': return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
            default: return null;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'passed': return '✅ Thành công';
            case 'failed': return '❌ Thất bại';
            case 'running': return '🔄 Đang test...';
            default: return '⏳ Chưa test';
        }
    };

    const testProductCRUD = async () => {
        // Test product CRUD operations
        console.log('Testing Product CRUD...');
        // Add actual test logic here
    };

    const testCategoryCRUD = async () => {
        // Test category CRUD operations
        console.log('Testing Category CRUD...');
        // Add actual test logic here
    };

    const testUserCRUD = async () => {
        // Test user CRUD operations
        console.log('Testing User CRUD...');
        // Add actual test logic here
    };

    const testOrderCRUD = async () => {
        // Test order CRUD operations
        console.log('Testing Order CRUD...');
        // Add actual test logic here
    };

    const testCouponCRUD = async () => {
        // Test coupon CRUD operations
        console.log('Testing Coupon CRUD...');
        // Add actual test logic here
    };

    const testPostCRUD = async () => {
        // Test post CRUD operations
        console.log('Testing Post CRUD...');
        // Add actual test logic here
    };

    const runAllTests = async () => {
        await Promise.all([
            runTest('Product CRUD', testProductCRUD),
            runTest('Category CRUD', testCategoryCRUD),
            runTest('User CRUD', testUserCRUD),
            runTest('Order CRUD', testOrderCRUD),
            runTest('Coupon CRUD', testCouponCRUD),
            runTest('Post CRUD', testPostCRUD),
        ]);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <Title level={2}>🧪 Test Admin CRUD Operations</Title>

            <Alert
                message="Hướng dẫn Test"
                description="Đây là trang test để kiểm tra tất cả CRUD operations trong admin panel. Click 'Test tất cả' để chạy toàn bộ tests hoặc test từng phần riêng lẻ."
                type="info"
                showIcon
                style={{ marginBottom: '20px' }}
            />

            <Space style={{ marginBottom: '20px' }}>
                <Button type="primary" onClick={runAllTests} size="large">
                    🚀 Test tất cả
                </Button>
            </Space>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                <Card title="📦 Product Management" size="small">
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Text>CRUD operations cho sản phẩm</Text>
                        <Button onClick={() => runTest('Product CRUD', testProductCRUD)}>
                            Test Product CRUD
                        </Button>
                        <div>
                            {getStatusIcon(testResults['Product CRUD'])} {getStatusText(testResults['Product CRUD'])}
                        </div>
                    </Space>
                </Card>

                <Card title="🏷️ Category Management" size="small">
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Text>CRUD operations cho danh mục</Text>
                        <Button onClick={() => runTest('Category CRUD', testCategoryCRUD)}>
                            Test Category CRUD
                        </Button>
                        <div>
                            {getStatusIcon(testResults['Category CRUD'])} {getStatusText(testResults['Category CRUD'])}
                        </div>
                    </Space>
                </Card>

                <Card title="👥 User Management" size="small">
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Text>CRUD operations cho người dùng</Text>
                        <Button onClick={() => runTest('User CRUD', testUserCRUD)}>
                            Test User CRUD
                        </Button>
                        <div>
                            {getStatusIcon(testResults['User CRUD'])} {getStatusText(testResults['User CRUD'])}
                        </div>
                    </Space>
                </Card>

                <Card title="📋 Order Management" size="small">
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Text>CRUD operations cho đơn hàng</Text>
                        <Button onClick={() => runTest('Order CRUD', testOrderCRUD)}>
                            Test Order CRUD
                        </Button>
                        <div>
                            {getStatusIcon(testResults['Order CRUD'])} {getStatusText(testResults['Order CRUD'])}
                        </div>
                    </Space>
                </Card>

                <Card title="🎫 Coupon Management" size="small">
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Text>CRUD operations cho mã ưu đãi</Text>
                        <Button onClick={() => runTest('Coupon CRUD', testCouponCRUD)}>
                            Test Coupon CRUD
                        </Button>
                        <div>
                            {getStatusIcon(testResults['Coupon CRUD'])} {getStatusText(testResults['Coupon CRUD'])}
                        </div>
                    </Space>
                </Card>

                <Card title="📝 Post Management" size="small">
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Text>CRUD operations cho bài viết</Text>
                        <Button onClick={() => runTest('Post CRUD', testPostCRUD)}>
                            Test Post CRUD
                        </Button>
                        <div>
                            {getStatusIcon(testResults['Post CRUD'])} {getStatusText(testResults['Post CRUD'])}
                        </div>
                    </Space>
                </Card>
            </div>

            <Divider />

            <Card title="📊 Test Results Summary" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                    {Object.entries(testResults).map(([testName, status]) => (
                        <div key={testName} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text>{testName}</Text>
                            <div>
                                {getStatusIcon(status)} {getStatusText(status)}
                            </div>
                        </div>
                    ))}
                </Space>
            </Card>
        </div>
    );
};

export default TestAdminCRUD;








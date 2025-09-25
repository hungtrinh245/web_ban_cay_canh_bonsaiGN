// Test component for Categories API
import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Typography, Alert, List, Tag } from 'antd';
import { getCategories } from '../../services/productService';

const { Title, Text } = Typography;

const TestCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Testing getCategories API...');
            const data = await getCategories();
            console.log('API Response:', data);
            setCategories(data);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError(err.message || 'Lỗi không xác định');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <Title level={2}>🧪 Test Categories API</Title>
            
            <Alert
                message="Hướng dẫn Test"
                description="Đây là trang test để kiểm tra API categories. Kiểm tra console để xem logs."
                type="info"
                showIcon
                style={{ marginBottom: '20px' }}
            />

            <Space style={{ marginBottom: '20px' }}>
                <Button type="primary" onClick={fetchCategories} loading={loading}>
                    🔄 Test lại API
                </Button>
            </Space>

            <Card title="📊 Categories Data" size="small">
                {loading && <Text>Đang tải...</Text>}
                {error && <Alert message="Lỗi" description={error} type="error" />}
                {categories && categories.length > 0 ? (
                    <List
                        dataSource={categories}
                        renderItem={(category) => (
                            <List.Item>
                                <Space>
                                    <Tag color="blue">{category.name}</Tag>
                                    <Text>{category.description}</Text>
                                    {category.image && <Text type="secondary">Image: {category.image}</Text>}
                                </Space>
                            </List.Item>
                        )}
                    />
                ) : (
                    <Text>Không có dữ liệu categories</Text>
                )}
            </Card>

            <Card title="🔍 Debug Info" size="small" style={{ marginTop: '16px' }}>
                <Text>Categories count: {categories.length}</Text>
                <br />
                <Text>Loading: {loading ? 'Yes' : 'No'}</Text>
                <br />
                <Text>Error: {error || 'None'}</Text>
                <br />
                <Text>Raw data: {JSON.stringify(categories, null, 2)}</Text>
            </Card>
        </div>
    );
};

export default TestCategories;








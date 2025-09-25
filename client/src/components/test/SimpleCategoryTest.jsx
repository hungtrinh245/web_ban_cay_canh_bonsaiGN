// Simple test for Categories API
import React, { useState } from 'react';
import { Button, Card, Typography, Alert } from 'antd';
import axios from 'axios';

const { Title, Text } = Typography;

const SimpleCategoryTest = () => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const testAPI = async () => {
        setLoading(true);
        try {
            console.log('Testing categories API directly...');
            const response = await axios.get('http://localhost:5001/api/categories');
            console.log('Direct API response:', response);
            setResult({
                success: true,
                data: response.data,
                count: response.data.length
            });
        } catch (error) {
            console.error('Direct API error:', error);
            setResult({
                success: false,
                error: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <Title level={2}>🧪 Simple Categories API Test</Title>

            <Button type="primary" onClick={testAPI} loading={loading} style={{ marginBottom: '20px' }}>
                Test Categories API
            </Button>

            {result && (
                <Card title="Test Result" size="small">
                    {result.success ? (
                        <Alert
                            message="✅ API Success"
                            description={`Found ${result.count} categories`}
                            type="success"
                            showIcon
                        />
                    ) : (
                        <Alert
                            message="❌ API Failed"
                            description={`Error: ${result.error} (Status: ${result.status})`}
                            type="error"
                            showIcon
                        />
                    )}

                    <div style={{ marginTop: '16px' }}>
                        <Text strong>Raw Response:</Text>
                        <pre style={{ backgroundColor: '#f5f5f5', padding: '8px', borderRadius: '4px', fontSize: '12px' }}>
                            {JSON.stringify(result, null, 2)}
                        </pre>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default SimpleCategoryTest;








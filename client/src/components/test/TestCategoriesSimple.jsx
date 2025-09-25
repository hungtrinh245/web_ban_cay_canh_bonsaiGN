// Simple test for categories
import React, { useState, useEffect } from 'react';
import { Button, Card, Typography, Select } from 'antd';
import axios from 'axios';

const { Option } = Select;
const { Title, Text } = Typography;

const TestCategoriesSimple = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            console.log('Testing categories API...');
            const response = await axios.get('http://localhost:5001/api/categories');
            console.log('API Response:', response.data);

            if (response.data && Array.isArray(response.data)) {
                const names = response.data.map(cat => cat.name);
                console.log('Category names:', names);
                setCategories(names);
            }
        } catch (error) {
            console.error('API Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>🧪 Test Categories Simple</Title>

            <Button onClick={fetchCategories} loading={loading} style={{ marginBottom: '20px' }}>
                Test API
            </Button>

            <Card title="Categories Dropdown" size="small">
                <Select
                    placeholder="Chọn danh mục"
                    style={{ width: '100%' }}
                    loading={loading}
                >
                    {categories.map(cat => (
                        <Option key={cat} value={cat}>{cat}</Option>
                    ))}
                </Select>

                <div style={{ marginTop: '16px' }}>
                    <Text>Count: {categories.length}</Text>
                    <br />
                    <Text>Categories: {categories.join(', ') || 'None'}</Text>
                </div>
            </Card>
        </div>
    );
};

export default TestCategoriesSimple;








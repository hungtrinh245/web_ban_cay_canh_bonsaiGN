// Test component for Category Dropdown
import React, { useState, useEffect } from 'react';
import { Select, Card, Button, Typography, Alert } from 'antd';
import { getCategories } from '../../services/productService';

const { Option } = Select;
const { Title, Text } = Typography;

const TestCategoryDropdown = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [error, setError] = useState(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Testing getCategories...');
            const data = await getCategories();
            console.log('Categories data:', data);
            if (data && Array.isArray(data)) {
                const categoryNames = data.map(cat => cat.name);
                setCategories(categoryNames);
                console.log('Category names:', categoryNames);
            }
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCategoryChange = (value) => {
        console.log('Selected category:', value);
        setSelectedCategory(value);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <Title level={2}>🧪 Test Category Dropdown</Title>

            <Card title="Category Selector" size="small" style={{ marginBottom: '20px' }}>
                <Select
                    placeholder="Chọn danh mục"
                    style={{ width: '100%' }}
                    onChange={handleCategoryChange}
                    loading={loading}
                    showSearch
                    allowClear
                >
                    {categories.map(cat => (
                        <Option key={cat} value={cat}>{cat}</Option>
                    ))}
                </Select>

                {selectedCategory && (
                    <div style={{ marginTop: '16px', padding: '8px', backgroundColor: '#f6ffed', borderRadius: '4px' }}>
                        <Text>Đã chọn: <strong>{selectedCategory}</strong></Text>
                    </div>
                )}
            </Card>

            <Card title="Debug Info" size="small">
                <Text>Categories count: {categories.length}</Text>
                <br />
                <Text>Loading: {loading ? 'Yes' : 'No'}</Text>
                <br />
                <Text>Error: {error || 'None'}</Text>
                <br />
                <Text>Categories: {categories.join(', ') || 'None'}</Text>
                <br />
                <Button onClick={fetchCategories} style={{ marginTop: '8px' }}>
                    🔄 Refresh Categories
                </Button>
            </Card>
        </div>
    );
};

export default TestCategoryDropdown;








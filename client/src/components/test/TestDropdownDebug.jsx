// Test component for debugging dropdown
import React, { useState, useEffect } from 'react';
import { Select, Card, Button, Typography, Space } from 'antd';
import { getCategories } from '../../services/productService';

const { Option } = Select;
const { Title, Text } = Typography;

const TestDropdownDebug = () => {
    const [categories, setCategories] = useState([]);
    const [selectedValue, setSelectedValue] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCategories();
                if (data && Array.isArray(data)) {
                    const names = data.map(cat => cat.name);
                    setCategories(names);
                    console.log('Categories loaded:', names);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (value) => {
        console.log('Selected:', value);
        setSelectedValue(value);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>🧪 Test Dropdown Debug</Title>

            <Card title="Categories Dropdown" size="small" style={{ marginBottom: '20px' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Text>Categories count: {categories.length}</Text>
                    <Text>Categories: {categories.join(', ') || 'None'}</Text>

                    <Select
                        placeholder="Chọn danh mục"
                        style={{ width: '100%' }}
                        onChange={handleChange}
                        value={selectedValue}
                        showSearch
                        allowClear
                        popupClassName="category-dropdown"
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    >
                        {categories.map(cat => (
                            <Option key={cat} value={cat}>{cat}</Option>
                        ))}
                    </Select>

                    {selectedValue && (
                        <Text>Đã chọn: <strong>{selectedValue}</strong></Text>
                    )}
                </Space>
            </Card>

            <Card title="Raw Data" size="small">
                <pre style={{ backgroundColor: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>
                    {JSON.stringify(categories, null, 2)}
                </pre>
            </Card>
        </div>
    );
};

export default TestDropdownDebug;








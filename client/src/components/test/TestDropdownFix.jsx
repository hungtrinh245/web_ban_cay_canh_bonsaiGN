// Simple test for dropdown fix
import React, { useState, useEffect } from 'react';
import { Select, Card, Typography, Button } from 'antd';
import axios from 'axios';

const { Option } = Select;
const { Title, Text } = Typography;

const TestDropdownFix = () => {
    const [categories, setCategories] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/categories');
                const names = response.data.map(cat => cat.name);
                setCategories(names);
                console.log('Categories loaded:', names);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>🧪 Test Dropdown Fix</Title>

            <Card title="Categories Dropdown" size="small">
                <Text>Count: {categories.length}</Text>
                <br />
                <Text>Categories: {categories.join(', ') || 'None'}</Text>

                <div style={{ marginTop: '16px' }}>
                    <Select
                        placeholder="Chọn danh mục"
                        style={{ width: '100%' }}
                        onChange={setSelected}
                        value={selected}
                        showSearch
                        allowClear
                    >
                        {categories.map(cat => (
                            <Option key={cat} value={cat}>{cat}</Option>
                        ))}
                    </Select>
                </div>

                {selected && (
                    <div style={{ marginTop: '16px', padding: '8px', backgroundColor: '#f6ffed', borderRadius: '4px' }}>
                        <Text>Đã chọn: <strong>{selected}</strong></Text>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default TestDropdownFix;








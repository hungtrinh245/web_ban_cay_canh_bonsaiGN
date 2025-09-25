// client/src/components/product/ProductList.jsx
import React from 'react';
import { Row, Col, Empty } from 'antd';
import ProductCard from './ProductCard';

const ProductList = ({ products, onAddToCartSuccess }) => {
    if (!products || products.length === 0) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '300px',
                padding: '40px'
            }}>
                <Empty
                    description="Không có sản phẩm nào"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </div>
        );
    }

    return (
        <Row
            gutter={[16, 24]}
            justify="center"
            style={{
                padding: '20px 0',
                maxWidth: '1400px',
                margin: '0 auto'
            }}
        >
            {products.map(product => (
                <Col
                    key={product._id}
                    xs={24}      // Mobile: 1 cột
                    sm={12}      // Small tablet: 2 cột
                    md={8}       // Medium tablet: 3 cột  
                    lg={6}       // Desktop: 4 cột
                    xl={6}       // Large desktop: 4 cột
                    xxl={4}      // Extra large: 6 cột
                    style={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    <ProductCard
                        product={product}
                        onAddToCartSuccess={onAddToCartSuccess}
                    />
                </Col>
            ))}
        </Row>
    );
};

export default ProductList;
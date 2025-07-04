// client/src/components/product/ProductList.jsx
import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products, onAddToCartSuccess }) => { // Nhận prop onAddToCartSuccess
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
            {products.map(product => (
                <ProductCard 
                    key={product._id} 
                    product={product} 
                    onAddToCartSuccess={onAddToCartSuccess} // Truyền xuống ProductCard
                />
            ))}
        </div>
    );
};

export default ProductList;
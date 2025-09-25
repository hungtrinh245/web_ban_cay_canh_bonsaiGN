// Test component for AddressSelector
import React from 'react';
import AddressSelector from '../common/AddressSelector';

const TestAddressSelector = () => {
    const handleAddressChange = (address) => {
        console.log('Address changed:', address);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2>Test Address Selector</h2>
            <AddressSelector
                onAddressChange={handleAddressChange}
                style={{ marginTop: '20px' }}
            />
        </div>
    );
};

export default TestAddressSelector;








// client/src/components/common/AddressSelector.jsx
import React, { useState, useEffect } from 'react';
import vietnamLocations from '../../data/vietnamLocations';

const AddressSelector = ({
    onAddressChange,
    defaultValues = {},
    disabled = false,
    style = {}
}) => {
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');

    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    console.log('AddressSelector rendered with vietnamLocations length:', vietnamLocations.length);
    console.log('First few provinces:', vietnamLocations.slice(0, 3));

    // Thiết lập giá trị mặc định
    useEffect(() => {
        if (defaultValues.provinceCode) setSelectedProvince(defaultValues.provinceCode);
        if (defaultValues.districtCode) setSelectedDistrict(defaultValues.districtCode);
        if (defaultValues.wardCode) setSelectedWard(defaultValues.wardCode);
    }, [defaultValues]);

    // Cập nhật danh sách quận/huyện khi chọn tỉnh
    useEffect(() => {
        if (selectedProvince) {
            const province = vietnamLocations.find(p => p.value === selectedProvince);
            setDistricts(province?.children || []);
            setSelectedDistrict(''); // Reset district khi chọn tỉnh mới
            setSelectedWard(''); // Reset ward
            setWards([]); // Clear wards
        } else {
            setDistricts([]);
            setSelectedDistrict('');
            setSelectedWard('');
            setWards([]);
        }
    }, [selectedProvince]);

    // Cập nhật danh sách phường/xã khi chọn quận/huyện
    useEffect(() => {
        if (selectedDistrict && selectedProvince) {
            const province = vietnamLocations.find(p => p.value === selectedProvince);
            const district = province?.children?.find(d => d.value === selectedDistrict);
            setWards(district?.children || []);
            setSelectedWard(''); // Reset ward khi chọn district mới
        } else {
            setWards([]);
            setSelectedWard('');
        }
    }, [selectedDistrict, selectedProvince]);

    // Gọi callback khi có thay đổi
    useEffect(() => {
        if (selectedProvince || selectedDistrict || selectedWard) {
            const province = vietnamLocations.find(p => p.value === selectedProvince);
            const district = province?.children?.find(d => d.value === selectedDistrict);
            const ward = district?.children?.find(w => w.value === selectedWard);

            const addressInfo = {
                province: province?.label || '',
                district: district?.label || '',
                ward: ward?.label || '',
                provinceCode: selectedProvince,
                districtCode: selectedDistrict,
                wardCode: selectedWard,
                fullAddress: [province?.label, district?.label, ward?.label].filter(Boolean).join(', ')
            };

            if (onAddressChange) {
                onAddressChange(addressInfo);
            }
        }
    }, [selectedProvince, selectedDistrict, selectedWard, onAddressChange]);

    // Custom styles
    const containerStyle = {
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
        ...style
    };

    const selectGroupStyle = {
        flex: '1',
        minWidth: '200px'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600',
        color: '#333',
        fontSize: '14px'
    };

    const selectStyle = {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '8px',
        border: '2px solid #e0e0e0',
        fontSize: '16px',
        backgroundColor: 'white',
        cursor: 'pointer',
        transition: 'border-color 0.3s ease',
        outline: 'none'
    };

    const disabledSelectStyle = {
        ...selectStyle,
        backgroundColor: '#f5f5f5',
        cursor: 'not-allowed',
        color: '#999'
    };

    const summaryStyle = {
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f8fff8',
        border: '2px solid #e8f5e8',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#28a745',
        fontWeight: '500'
    };

    return (
        <div>
            <div style={containerStyle}>
                {/* Tỉnh/Thành phố */}
                <div style={selectGroupStyle}>
                    <label style={labelStyle}>
                        Tỉnh/Thành phố <span style={{ color: 'red' }}>*</span>
                    </label>
                    <select
                        value={selectedProvince}
                        onChange={(e) => setSelectedProvince(e.target.value)}
                        style={disabled ? disabledSelectStyle : selectStyle}
                        disabled={disabled}
                    >
                        <option value="">Chọn tỉnh/thành phố</option>
                        {vietnamLocations.map(province => (
                            <option key={province.value} value={province.value}>
                                {province.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Quận/Huyện */}
                <div style={selectGroupStyle}>
                    <label style={{
                        ...labelStyle,
                        color: selectedProvince ? '#333' : '#999'
                    }}>
                        Quận/Huyện <span style={{ color: 'red' }}>*</span>
                    </label>
                    <select
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        style={disabled || !selectedProvince ? disabledSelectStyle : selectStyle}
                        disabled={disabled || !selectedProvince}
                    >
                        <option value="">
                            {selectedProvince ? "Chọn quận/huyện" : "Vui lòng chọn tỉnh trước"}
                        </option>
                        {districts.map(district => (
                            <option key={district.value} value={district.value}>
                                {district.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Xã/Phường */}
                <div style={selectGroupStyle}>
                    <label style={{
                        ...labelStyle,
                        color: selectedDistrict ? '#333' : '#999'
                    }}>
                        Xã/Phường <span style={{ color: 'red' }}>*</span>
                    </label>
                    <select
                        value={selectedWard}
                        onChange={(e) => setSelectedWard(e.target.value)}
                        style={disabled || !selectedDistrict ? disabledSelectStyle : selectStyle}
                        disabled={disabled || !selectedDistrict}
                    >
                        <option value="">
                            {selectedDistrict ? "Chọn xã/phường" : "Vui lòng chọn quận/huyện trước"}
                        </option>
                        {wards.map(ward => (
                            <option key={ward.value} value={ward.value}>
                                {ward.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Selected Address Summary */}
            {selectedProvince && selectedDistrict && selectedWard && (
                <div style={summaryStyle}>
                    <strong>📍 Địa chỉ đã chọn:</strong><br />
                    {vietnamLocations.find(p => p.value === selectedProvince)?.label}, {' '}
                    {vietnamLocations.find(p => p.value === selectedProvince)?.children?.find(d => d.value === selectedDistrict)?.label}, {' '}
                    {vietnamLocations.find(p => p.value === selectedProvince)?.children?.find(d => d.value === selectedDistrict)?.children?.find(w => w.value === selectedWard)?.label}
                </div>
            )}
        </div>
    );
};

export default AddressSelector;

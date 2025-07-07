// client/src/components/admin/ProductManagement.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
    getAllBonsais, // Để lấy danh sách sản phẩm (có phân trang)
    createBonsai,
    updateBonsai,
    deleteBonsai,
    getCategories // Để lấy danh mục cho form
} from '../../services/productService';
import Pagination from '../common/Pagination'; // Để dùng phân trang

const ProductManagement = () => {
    const { token } = useAuth(); // Lấy token để gọi API admin
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // States cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const productsPerPage = 8; // Số sản phẩm trên mỗi trang

    // States cho form thêm/sửa
    const [isEditing, setIsEditing] = useState(false); // Chế độ sửa hay thêm mới
    const [currentProduct, setCurrentProduct] = useState(null); // Sản phẩm đang sửa
    const [formName, setFormName] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formPrice, setFormPrice] = useState('');
    const [formCategory, setFormCategory] = useState('');
    const [formStockQuantity, setFormStockQuantity] = useState('');
    const [formIsFeatured, setFormIsFeatured] = useState(false);
    const [formImages, setFormImages] = useState(['']); // Mảng URL hình ảnh

    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');

    const fetchProductsAndCategories = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);
            const productData = await getAllBonsais(page, productsPerPage);
            setProducts(productData.products);
            setCurrentPage(productData.page);
            setTotalPages(productData.totalPages);

            const categoryData = await getCategories();
            setCategories(categoryData);
        } catch (err) {
            setError(err.message || 'Không thể tải dữ liệu sản phẩm hoặc danh mục.');
            console.error("Fetch product/category error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductsAndCategories();
    }, []);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchProductsAndCategories(page);
    };

    const handleAddProductClick = () => {
        setIsEditing(false);
        setCurrentProduct(null);
        setFormName('');
        setFormDescription('');
        setFormPrice('');
        setFormCategory('');
        setFormStockQuantity('');
        setFormIsFeatured(false);
        setFormImages(['']);
        setFormError('');
    };

    const handleEditProductClick = (product) => {
        setIsEditing(true);
        setCurrentProduct(product);
        setFormName(product.name);
        setFormDescription(product.description);
        setFormPrice(product.price);
        setFormCategory(product.category);
        setFormStockQuantity(product.stockQuantity);
        setFormIsFeatured(product.isFeatured);
        setFormImages(product.images && product.images.length > 0 ? product.images : ['']);
        setFormError('');
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                await deleteBonsai(productId, token);
                alert('Sản phẩm đã xóa thành công!');
                fetchProductsAndCategories(currentPage); // Tải lại danh sách
            } catch (err) {
                alert(`Lỗi khi xóa sản phẩm: ${err.message}`);
                console.error("Delete product error:", err);
            }
        }
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError('');

        const productData = {
            name: formName,
            description: formDescription,
            price: Number(formPrice),
            images: formImages.filter(img => img.trim() !== ''), // Lọc bỏ ảnh trống
            category: formCategory,
            stockQuantity: Number(formStockQuantity),
            isFeatured: formIsFeatured,
        };

        try {
            if (isEditing && currentProduct) {
                await updateBonsai(currentProduct._id, productData, token);
                alert('Cập nhật sản phẩm thành công!');
            } else {
                await createBonsai(productData, token);
                alert('Thêm sản phẩm mới thành công!');
            }
            // Reset form và tải lại dữ liệu
            handleAddProductClick(); // Reset form
            fetchProductsAndCategories(currentPage);
        } catch (err) {
            setFormError(err.message || 'Lỗi khi lưu sản phẩm.');
            console.error("Save product form error:", err);
        } finally {
            setFormLoading(false);
        }
    };

    // --- CÁC STYLE CHO QUẢN LÝ SẢN PHẨM ---
    const managementContainerStyle = {
        padding: '20px',
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    };

    const pageTitleStyle = {
        fontSize: '2em',
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: '20px',
        paddingBottom: '10px',
        borderBottom: '2px solid #28a745',
    };

    const formSectionStyle = {
        marginBottom: '40px',
        paddingBottom: '20px',
        borderBottom: '1px dashed #eee',
    };

    const formTitleStyle = {
        fontSize: '1.5em',
        color: '#333',
        marginBottom: '20px',
    };

    const formGroupStyle = {
        marginBottom: '15px',
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
        color: '#555',
        fontSize: '0.9em',
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '0.9em',
        boxSizing: 'border-box',
    };

    const textareaStyle = {
        ...inputStyle,
        minHeight: '80px',
        resize: 'vertical',
    };

    const checkboxGroupStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '15px',
    };

    const submitButtonStyle = {
        padding: '10px 20px',
        background: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1em',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease',
        '&:hover': {
            backgroundColor: '#218838',
        }
    };

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '30px',
    };

    const tableHeaderCell = {
        background: '#f2f2f2',
        border: '1px solid #ddd',
        padding: '10px 8px',
        textAlign: 'left',
        fontWeight: 'bold',
        color: '#555',
        fontSize: '0.9em',
    };

    const tableCell = {
        border: '1px solid #eee',
        padding: '8px',
        textAlign: 'left',
        fontSize: '0.85em',
    };

    const actionButtonStyle = {
        padding: '5px 10px',
        marginRight: '5px',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
        fontSize: '0.8em',
    };

    const editButtonStyle = {
        ...actionButtonStyle,
        background: '#007bff',
        color: 'white',
        '&:hover': {
            background: '#0056b3',
        }
    };

    const deleteButtonStyle = {
        ...actionButtonStyle,
        background: '#dc3545',
        color: 'white',
        '&:hover': {
            background: '#c82333',
        }
    };

    const addImageButtonStyle = {
        padding: '5px 10px',
        background: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
        fontSize: '0.8em',
        marginLeft: '10px',
    };

    const removeImageButtonStyle = {
        padding: '3px 6px',
        background: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
        fontSize: '0.7em',
        marginLeft: '5px',
    };


    return (
        <div style={managementContainerStyle}>
            <h1 style={pageTitleStyle}>Quản lý Sản phẩm</h1>

            {/* Form thêm/sửa sản phẩm */}
            <div style={formSectionStyle}>
                <h2 style={formTitleStyle}>{isEditing ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
                {formError && <p style={{color: 'red', marginBottom: '15px'}}>{formError}</p>}
                <form onSubmit={handleSubmitForm}>
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                        <div style={{ flex: 1 }}>
                            <label htmlFor="formName" style={labelStyle}>Tên sản phẩm</label>
                            <input type="text" id="formName" value={formName} onChange={(e) => setFormName(e.target.value)} style={inputStyle} required />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label htmlFor="formPrice" style={labelStyle}>Giá</label>
                            <input type="number" id="formPrice" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} style={inputStyle} required min="0" />
                        </div>
                    </div>
                    <div style={formGroupStyle}>
                        <label htmlFor="formDescription" style={labelStyle}>Mô tả</label>
                        <textarea id="formDescription" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} style={textareaStyle} required />
                    </div>
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                        <div style={{ ...formGroupStyle, flex: 1 }}>
                            <label htmlFor="formCategory" style={labelStyle}>Danh mục</label>
                            <select id="formCategory" value={formCategory} onChange={(e) => setFormCategory(e.target.value)} style={inputStyle} required>
                                <option value="">Chọn danh mục</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ ...formGroupStyle, flex: 1 }}>
                            <label htmlFor="formStockQuantity" style={labelStyle}>Số lượng tồn kho</label>
                            <input type="number" id="formStockQuantity" value={formStockQuantity} onChange={(e) => setFormStockQuantity(e.target.value)} style={inputStyle} required min="0" />
                        </div>
                    </div>
                    
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Hình ảnh (URL)</label>
                        {formImages.map((imageUrl, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <input 
                                    type="text" 
                                    value={imageUrl} 
                                    onChange={(e) => {
                                        const newImages = [...formImages];
                                        newImages[index] = e.target.value;
                                        setFormImages(newImages);
                                    }} 
                                    style={{ ...inputStyle, marginBottom: '0', flex: 1 }} 
                                    placeholder="URL hình ảnh"
                                />
                                {formImages.length > 1 && (
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            const newImages = formImages.filter((_, i) => i !== index);
                                            setFormImages(newImages);
                                        }} 
                                        style={removeImageButtonStyle}
                                    >
                                        Xóa
                                    </button>
                                )}
                            </div>
                        ))}
                        <button 
                            type="button" 
                            onClick={() => setFormImages([...formImages, ''])} 
                            style={addImageButtonStyle}
                        >
                            Thêm ảnh
                        </button>
                    </div>

                    <div style={checkboxGroupStyle}>
                        <input type="checkbox" id="formIsFeatured" checked={formIsFeatured} onChange={(e) => setFormIsFeatured(e.target.checked)} />
                        <label htmlFor="formIsFeatured" style={{...labelStyle, marginBottom: '0'}}>Sản phẩm nổi bật</label>
                    </div>

                    <button type="submit" style={submitButtonStyle} disabled={formLoading}>
                        {formLoading ? 'Đang lưu...' : (isEditing ? 'CẬP NHẬT' : 'THÊM SẢN PHẨM')}
                    </button>
                    {isEditing && (
                        <button type="button" onClick={handleAddProductClick} style={{...submitButtonStyle, background: '#6c757d', marginLeft: '10px'}} disabled={formLoading}>
                            HỦY
                        </button>
                    )}
                </form>
            </div>

            {/* Danh sách sản phẩm */}
            <h2 style={formTitleStyle}>Danh sách sản phẩm hiện có</h2>
            {loading ? (
                <p>Đang tải sản phẩm...</p>
            ) : error ? (
                <p style={{color: 'red'}}>{error}</p>
            ) : (
                <>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={{...tableHeaderCell, width: '50px'}}>ID</th>
                                <th style={tableHeaderCell}>Tên sản phẩm</th>
                                <th style={tableHeaderCell}>Giá</th>
                                <th style={tableHeaderCell}>Danh mục</th>
                                <th style={tableHeaderCell}>Tồn kho</th>
                                <th style={tableHeaderCell}>Nổi bật</th>
                                <th style={{...tableHeaderCell, width: '120px', textAlign: 'center'}}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product._id}>
                                    <td style={tableCell}>{product._id.slice(-4)}</td>
                                    <td style={tableCell}>{product.name}</td>
                                    <td style={tableCell}>{product.price.toLocaleString('vi-VN')} VNĐ</td>
                                    <td style={tableCell}>{product.category}</td>
                                    <td style={tableCell}>{product.stockQuantity}</td>
                                    <td style={tableCell}>{product.isFeatured ? 'Có' : 'Không'}</td>
                                    <td style={tableCell}>
                                        <button 
                                            onClick={() => handleEditProductClick(product)} 
                                            style={{...editButtonStyle}}
                                            onMouseOver={(e) => applyHover(e, editButtonStyle['&:hover'])}
                                            onMouseOut={(e) => removeHover(e, editButtonStyle)}
                                        >
                                            Sửa
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteProduct(product._id)} 
                                            style={{...deleteButtonStyle}}
                                            onMouseOver={(e) => applyHover(e, deleteButtonStyle['&:hover'])}
                                            onMouseOut={(e) => removeHover(e, deleteButtonStyle)}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </div>
    );
};

export default ProductManagement;
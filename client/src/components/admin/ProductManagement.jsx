// client/src/components/admin/ProductManagement.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    getAllBonsais,
    createBonsai,
    updateBonsai,
    deleteBonsai, // Make sure deleteBonsai is imported
    getCategories
} from '../../services/productService';
import Pagination from '../common/Pagination';

// Import Ant Design Components
import { Table, Button, Modal, Form, Input, InputNumber, Select, Switch, Space, Popconfirm, message as AntMessage, Spin, Typography, Upload } from 'antd';

const { Text } = Typography;
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, PictureOutlined, UploadOutlined, DeleteOutlined as DeleteIcon } from '@ant-design/icons';

const { Option } = Select;
const { confirm } = Modal;

const ProductManagement = () => {
    const { token } = useAuth(); // Get token from AuthContext
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoryMap, setCategoryMap] = useState({}); // Map tên danh mục -> ObjectId
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const productsPerPage = 8;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [form] = Form.useForm();

    const [formLoading, setFormLoading] = useState(false);
    const [imageFileList, setImageFileList] = useState([]);

    const fetchProductsAndCategories = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);

            // Fetch products
            const productData = await getAllBonsais(page, productsPerPage);
            setProducts(productData.products);
            setCurrentPage(productData.page);
            setTotalPages(productData.totalPages);

            // Fetch categories separately with better error handling
            try {
                console.log('Fetching categories...');
                const categoryData = await getCategories();
                console.log('Raw category data:', categoryData);
                console.log('Category data type:', typeof categoryData);
                console.log('Category data is array:', Array.isArray(categoryData));
                console.log('Category data length:', categoryData?.length);

                if (categoryData && Array.isArray(categoryData) && categoryData.length > 0) {
                    const categoryNames = categoryData.map(cat => cat.name);
                    const categoryMapping = {};
                    categoryData.forEach(cat => {
                        categoryMapping[cat.name] = cat._id;
                    });

                    console.log('Mapped category names:', categoryNames);
                    console.log('Category mapping:', categoryMapping);
                    console.log('Setting categories state with:', categoryNames);
                    setCategories(categoryNames);
                    setCategoryMap(categoryMapping);
                } else {
                    console.error('Categories data is invalid:', categoryData);
                    setCategories([]);
                    setCategoryMap({});
                    AntMessage.warning('Không thể tải danh mục. Vui lòng thử lại.');
                }
            } catch (categoryErr) {
                console.error('Error fetching categories:', categoryErr);
                setCategories([]);
                AntMessage.error('Lỗi khi tải danh mục: ' + categoryErr.message);
            }

        } catch (err) {
            setError(err.message || 'Không thể tải dữ liệu sản phẩm.');
            console.error("Fetch product error:", err);
            AntMessage.error('Lỗi: ' + (err.message || 'Không thể tải dữ liệu.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('ProductManagement useEffect - token:', token ? 'present' : 'missing');
        if (token) {
            fetchProductsAndCategories();
        } else {
            setLoading(false);
            // AdminProtectedRoute will handle redirection if unauthorized
        }
    }, [token]);

    // Force fetch categories when component mounts
    useEffect(() => {
        if (token && categories.length === 0) {
            console.log('Force fetching categories...');
            const fetchCategoriesOnly = async () => {
                try {
                    const categoryData = await getCategories();
                    console.log('Force fetch categories result:', categoryData);
                    if (categoryData && Array.isArray(categoryData) && categoryData.length > 0) {
                        const categoryNames = categoryData.map(cat => cat.name);
                        setCategories(categoryNames);
                    }
                } catch (err) {
                    console.error('Force fetch categories error:', err);
                }
            };
            fetchCategoriesOnly();
        }
    }, [token, categories.length]);

    // Debug log khi categories thay đổi
    useEffect(() => {
        console.log('Categories state changed:', categories);
    }, [categories]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchProductsAndCategories(page);
    };

    const showAddModal = () => {
        if (!token) {
            AntMessage.error("Bạn cần đăng nhập để thực hiện thao tác này.");
            return;
        }
        setIsEditing(false);
        setCurrentProduct(null);
        setImageFileList([]);
        form.resetFields();
        form.setFieldsValue({ isFeatured: false, images: [] });
        setIsModalVisible(true);
    };

    const showEditModal = (product) => {
        if (!token) {
            AntMessage.error("Bạn cần đăng nhập để thực hiện thao tác này.");
            return;
        }
        setIsEditing(true);
        setCurrentProduct(product);

        const imageFiles = product.images && product.images.length > 0 ? product.images.map(url => ({
            uid: url,
            name: url.split('/').pop(),
            status: 'done',
            url: url
        })) : [];

        setImageFileList(imageFiles);
        form.setFieldsValue({
            ...product,
            images: imageFiles
        });
        setIsModalVisible(true);
    };

    const handleCancelModal = () => {
        setIsModalVisible(false);
        setImageFileList([]);
        form.resetFields();
    };

    const handleDeleteProduct = (productId) => {
        // IMPORTANT: Check for token before proceeding with delete operation
        if (!token) {
            AntMessage.error("Bạn cần đăng nhập để thực hiện thao tác này.");
            return;
        }
        confirm({
            title: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
            icon: <ExclamationCircleOutlined />,
            content: 'Hành động này không thể hoàn tác!',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            async onOk() {
                try {
                    console.log('Deleting product:', productId, 'with token:', token ? 'present' : 'missing');
                    // Pass the token to the deleteBonsai service function
                    await deleteBonsai(productId, token); // TRUYỀN TOKEN VÀO ĐÂY
                    AntMessage.success('Sản phẩm đã xóa thành công!');
                    fetchProductsAndCategories(currentPage); // Reload product list
                } catch (err) {
                    console.error("Delete product error details:", err);
                    console.error("Error response:", err.response?.data);
                    AntMessage.error('Lỗi khi xóa sản phẩm: ' + (err.message || 'Lỗi không xác định'));
                }
            },
        });
    };

    const onFinishForm = async (values) => {
        // IMPORTANT: Check for token before submitting the form
        if (!token) {
            AntMessage.error("Bạn cần đăng nhập để thực hiện thao tác này.");
            return;
        }

        console.log('Form values:', values);
        console.log('Selected category:', values.category);
        console.log('Category map:', categoryMap);
        console.log('Available categories:', categories);

        if (!values.category || values.category === '') {
            AntMessage.error("Vui lòng chọn danh mục!");
            return;
        }

        // Convert category name to ObjectId
        const categoryId = categoryMap[values.category];
        console.log('Category ID for', values.category, ':', categoryId);

        if (!categoryId) {
            AntMessage.error(`Danh mục "${values.category}" không hợp lệ!`);
            console.error('Category mapping not found for:', values.category);
            console.error('Available mappings:', categoryMap);
            return;
        }

        setFormLoading(true);

        // Extract image URLs from the uploaded files
        const imageURLs = values.images ? values.images.map((item, index) => {
            if (item.originFileObj) {
                // For demo purposes, use sample images from public folder
                const sampleImages = [
                    '/images/sample-kim-tien.jpg',
                    '/images/sample-luoi-ho.jpg',
                    '/images/sample-mai-vang.jpg',
                    '/images/sample-sanh-co.jpg',
                    '/images/sample-sen-da-chuoi-ngoc.jpg',
                    '/images/sample-trau-ba.jpg',
                    '/images/sample-tung-la-han.jpg',
                    '/images/sample-xuong-rong-tai-tho.jpg'
                ];
                return sampleImages[index % sampleImages.length];
            }
            return item.url || item.thumbUrl || '';
        }).filter(url => url && url.trim() !== '') : [];

        // Ensure at least one image
        if (imageURLs.length === 0) {
            imageURLs.push('/images/sample-kim-tien.jpg');
        }

        console.log('Final image URLs:', imageURLs);

        const productData = {
            ...values,
            price: Number(values.price),
            stockQuantity: Number(values.stockQuantity),
            images: imageURLs,
            isFeatured: values.isFeatured || false,
            category: categoryId, // Use ObjectId instead of category name
        };

        try {
            if (isEditing && currentProduct) {
                await updateBonsai(currentProduct._id, productData, token); // Pass the token
                AntMessage.success('Cập nhật sản phẩm thành công!');
            } else {
                await createBonsai(productData, token); // Pass the token
                AntMessage.success('Thêm sản phẩm mới thành công!');
            }
            setIsModalVisible(false);
            setImageFileList([]);
            form.resetFields();
            fetchProductsAndCategories(currentPage);
        } catch (err) {
            AntMessage.error('Lỗi: ' + (err.message || 'Không thể lưu sản phẩm.'));
            console.error("Save product form error:", err);
        } finally {
            setFormLoading(false);
        }
    };

    const columns = [
        {
            title: 'ID', dataIndex: '_id', key: '_id',
            render: (text) => (text && text.slice) ? text.slice(-4).toUpperCase() : '', width: 80,
        },
        {
            title: 'Ảnh', dataIndex: 'images', key: 'images',
            render: (images) => (<img src={images && images.length > 0 ? images[0] : 'https://via.placeholder.com/50?text=No+Image'} alt="product" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />),
            width: 80,
        },
        { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
        { title: 'Giá', dataIndex: 'price', key: 'price', render: (price) => `${price.toLocaleString('vi-VN')} VNĐ`, sorter: (a, b) => a.price - b.price },
        { title: 'Danh mục', dataIndex: 'category', key: 'category', filters: categories.map(cat => ({ text: cat, value: cat })), onFilter: (value, record) => record.category.indexOf(value) === 0 },
        { title: 'Tồn kho', dataIndex: 'stockQuantity', key: 'stockQuantity', sorter: (a, b) => a.stockQuantity - b.stockQuantity },
        { title: 'Nổi bật', dataIndex: 'isFeatured', key: 'isFeatured', render: (isFeatured) => (isFeatured ? 'Có' : 'Không'), filters: [{ text: 'Có', value: true }, { text: 'Không', value: false }], onFilter: (value, record) => record.isFeatured === value },
        {
            title: 'Hành động', key: 'actions', width: 180, align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" icon={<EditOutlined />} onClick={() => showEditModal(record)}>
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xóa sản phẩm"
                        description="Bạn có chắc chắn muốn xóa sản phẩm này?"
                        onConfirm={() => handleDeleteProduct(record._id)}
                        okText="Xóa"
                        okType="danger"
                        cancelText="Hủy"
                        icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                    >
                        <Button type="danger" icon={<DeleteOutlined />}>
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ fontSize: '2em', fontWeight: 'bold', color: '#2c3e50', marginBottom: '20px', paddingBottom: '10px', borderBottom: '2px solid #28a745' }}>
                Quản lý Sản phẩm
            </h1>

            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
                    Thêm sản phẩm mới
                </Button>
                <Button onClick={() => fetchProductsAndCategories()} icon="🔄">
                    Refresh Categories
                </Button>
                <Button onClick={() => {
                    console.log('Current form values:', form.getFieldsValue());
                    console.log('Category map:', categoryMap);
                    console.log('Selected category:', form.getFieldValue('category'));
                }} icon="🔍">
                    Debug Form
                </Button>
            </div>


            {/* AntMessage.error is called directly in functions, no need to render a component here */}

            {loading ? (
                <Spin tip="Đang tải sản phẩm...">
                    <div style={{ height: '200px', border: '1px solid #f0f0f0', borderRadius: '8px' }} />
                </Spin>
            ) : (
                <>
                    <Table
                        dataSource={products}
                        columns={columns}
                        rowKey="_id"
                        pagination={false}
                        bordered
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}

            {/* Modal Thêm/Sửa sản phẩm */}
            <Modal
                title={isEditing ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
                open={isModalVisible}
                onCancel={handleCancelModal}
                footer={null}
                width={900}
                maskClosable={!formLoading}
                closable={!formLoading}
            >
                {!isEditing && (
                    <div style={{
                        marginBottom: '20px',
                        padding: '12px',
                        backgroundColor: '#f6ffed',
                        border: '1px solid #b7eb8f',
                        borderRadius: '6px',
                        fontSize: '13px'
                    }}>
                        💡 <strong>Hướng dẫn:</strong> Điền đầy đủ thông tin để tạo sản phẩm hoàn chỉnh.
                        Hình ảnh đầu tiên sẽ là ảnh chính hiển thị trên trang chủ.
                    </div>
                )}
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinishForm}
                    initialValues={isEditing && currentProduct ? {
                        ...currentProduct,
                        images: currentProduct.images ? currentProduct.images.map(url => ({
                            uid: url,
                            name: url.split('/').pop(),
                            status: 'done',
                            url: url
                        })) : []
                    } : {
                        isFeatured: false,
                        images: [],
                        stockQuantity: 0
                    }}
                >
                    <Form.Item
                        label="Tên sản phẩm"
                        name="name"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên sản phẩm!' },
                            { min: 3, message: 'Tên sản phẩm phải có ít nhất 3 ký tự!' },
                            { max: 100, message: 'Tên sản phẩm không được quá 100 ký tự!' }
                        ]}
                    >
                        <Input
                            placeholder="Nhập tên sản phẩm"
                            showCount
                            maxLength={100}
                        />
                    </Form.Item>

                    <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm!' }]}>
                        <Input.TextArea
                            rows={4}
                            placeholder="Nhập mô tả chi tiết về sản phẩm (đặc điểm, cách chăm sóc, kích thước...)"
                            showCount
                            maxLength={1000}
                        />
                    </Form.Item>


                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Form.Item label="Giá (VNĐ)" name="price" rules={[
                            { required: true, message: 'Vui lòng nhập giá!' },
                            { type: 'number', min: 1000, message: 'Giá phải từ 1,000 VNĐ trở lên!' }
                        ]} style={{ width: '48%' }}>
                            <InputNumber
                                placeholder="Giá sản phẩm"
                                min={0}
                                style={{ width: '100%' }}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                addonAfter="VNĐ"
                            />
                        </Form.Item>
                        <Form.Item label="Danh mục" name="category" rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]} style={{ width: '48%' }}>
                            <select
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: '1px solid #d9d9d9',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    height: '32px'
                                }}
                                value={form.getFieldValue('category') || ''}
                                onChange={(e) => {
                                    const selectedValue = e.target.value;
                                    form.setFieldsValue({ category: selectedValue });
                                    console.log('Selected category:', selectedValue);
                                    console.log('Category ID for selected value:', categoryMap[selectedValue]);
                                }}
                            >
                                <option value="">Chọn danh mục</option>
                                {categories && categories.length > 0 ? (
                                    categories.map((cat, index) => (
                                        <option key={index} value={cat}>{cat}</option>
                                    ))
                                ) : (
                                    <option value="" disabled>Đang tải danh mục...</option>
                                )}
                            </select>
                            {categories.length === 0 && (
                                <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>
                                    ⚠️ Đang tải danh mục... Vui lòng đợi
                                </div>
                            )}
                            {categories.length > 0 && (
                                <div style={{ color: '#52c41a', fontSize: '12px', marginTop: '4px' }}>
                                    ✅ Đã tải {categories.length} danh mục: {categories.slice(0, 3).join(', ')}...
                                </div>
                            )}
                            <div style={{ color: '#1890ff', fontSize: '12px', marginTop: '4px' }}>
                                🔍 Debug: Category value = "{form.getFieldValue('category') || 'Chưa chọn'}"
                            </div>
                            <div style={{ color: '#722ed1', fontSize: '12px', marginTop: '4px' }}>
                                📋 Categories loaded: {categories.length} items
                            </div>
                            <div style={{ color: '#fa8c16', fontSize: '12px', marginTop: '4px' }}>
                                🔗 Category ID: {categoryMap[form.getFieldValue('category')] || 'Chưa chọn'}
                            </div>
                            <div style={{ color: '#eb2f96', fontSize: '12px', marginTop: '4px' }}>
                                🗂️ Map keys: {Object.keys(categoryMap).slice(0, 3).join(', ')}...
                            </div>
                        </Form.Item>
                    </Space>

                    <Form.Item label="Số lượng tồn kho" name="stockQuantity" rules={[
                        { required: true, message: 'Vui lòng nhập số lượng tồn kho!' },
                        { type: 'number', min: 0, message: 'Số lượng không thể âm!' }
                    ]}>
                        <InputNumber
                            placeholder="Số lượng tồn kho"
                            min={0}
                            style={{ width: '100%' }}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>

                    <Form.Item label="Hình ảnh sản phẩm" required>
                        <div style={{ marginBottom: '8px', color: '#666', fontSize: '12px' }}>
                            💡 Hình đầu tiên sẽ là ảnh chính của sản phẩm. Hỗ trợ: JPG, PNG, GIF (tối đa 5MB)
                        </div>

                        <Form.Item name="images" rules={[{ required: true, message: 'Vui lòng upload ít nhất 1 ảnh!' }]}>
                            <Upload
                                listType="picture-card"
                                fileList={imageFileList}
                                beforeUpload={(file) => {
                                    // Validate file size (5MB)
                                    const isLt5M = file.size / 1024 / 1024 < 5;
                                    if (!isLt5M) {
                                        AntMessage.error('Ảnh phải nhỏ hơn 5MB!');
                                        return false;
                                    }

                                    // Validate file type
                                    const isImage = file.type.startsWith('image/');
                                    if (!isImage) {
                                        AntMessage.error('Chỉ được upload file ảnh!');
                                        return false;
                                    }

                                    return false; // Prevent auto upload
                                }}
                                onChange={({ fileList }) => {
                                    form.setFieldsValue({ images: fileList });
                                    setImageFileList(fileList);
                                }}
                                onRemove={(file) => {
                                    const currentImages = form.getFieldValue('images') || [];
                                    const newImages = currentImages.filter(img => img.uid !== file.uid);
                                    form.setFieldsValue({ images: newImages });
                                    setImageFileList(newImages);
                                }}
                                accept="image/*"
                                maxCount={5}
                                multiple
                            >
                                {(!imageFileList || imageFileList.length < 5) && (
                                    <div>
                                        <UploadOutlined />
                                        <div style={{ marginTop: 8 }}>Upload ảnh</div>
                                    </div>
                                )}
                            </Upload>
                        </Form.Item>

                        <div style={{ fontSize: '12px', color: '#999' }}>
                            📱 Kéo thả ảnh vào đây hoặc click để chọn file
                        </div>
                    </Form.Item>



                    <Form.Item name="isFeatured" valuePropName="checked" label="Sản phẩm nổi bật">
                        <Switch />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={formLoading}>
                            {isEditing ? 'Cập nhật' : 'Thêm sản phẩm'}
                        </Button>
                        <Button type="default" onClick={handleCancelModal} style={{ marginLeft: '10px' }} disabled={formLoading}>
                            Hủy
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProductManagement;

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
import { Table, Button, Modal, Form, Input, Select, Switch, Space, Popconfirm, message as AntMessage, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { confirm } = Modal;

const ProductManagement = () => {
    const { token } = useAuth(); // Get token from AuthContext
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
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

    const fetchProductsAndCategories = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);
            const productData = await getAllBonsais(page, productsPerPage);
            setProducts(productData.products);
            setCurrentPage(productData.page);
            setTotalPages(productData.totalPages);

            const categoryData = await getCategories();
            setCategories(categoryData.map(cat => cat.name)); 
        } catch (err) {
            setError(err.message || 'Không thể tải dữ liệu sản phẩm hoặc danh mục.');
            console.error("Fetch product/category error:", err);
            AntMessage.error('Lỗi: ' + (err.message || 'Không thể tải dữ liệu.')); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchProductsAndCategories();
        } else {
            setLoading(false);
            // AdminProtectedRoute will handle redirection if unauthorized
        }
    }, [token]);

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
        form.resetFields(); 
        form.setFieldsValue({ isFeatured: false, images: [{ url: '' }] }); 
        setIsModalVisible(true);
    };

    const showEditModal = (product) => {
        if (!token) { 
            AntMessage.error("Bạn cần đăng nhập để thực hiện thao tác này.");
            return;
        }
        setIsEditing(true);
        setCurrentProduct(product);
        form.setFieldsValue({ 
            ...product, 
            images: product.images && product.images.length > 0 ? product.images.map(url => ({ url })) : [{ url: '' }],
        });
        setIsModalVisible(true);
    };

    const handleCancelModal = () => {
        setIsModalVisible(false);
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
                    // Pass the token to the deleteBonsai service function
                    await deleteBonsai(productId, token); // TRUYỀN TOKEN VÀO ĐÂY
                    AntMessage.success('Sản phẩm đã xóa thành công!'); 
                    fetchProductsAndCategories(currentPage); // Reload product list
                } catch (err) {
                    AntMessage.error('Lỗi khi xóa sản phẩm: ' + (err.message || 'Lỗi không xác định')); 
                    console.error("Delete product error:", err);
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
        setFormLoading(true);

        const imageURLs = values.images ? values.images.map(item => item.url).filter(url => url && url.trim() !== '') : [];

        const productData = {
            ...values,
            price: Number(values.price),
            stockQuantity: Number(values.stockQuantity),
            images: imageURLs, 
            isFeatured: values.isFeatured || false,
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

            <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal} style={{ marginBottom: '20px' }}>
                Thêm sản phẩm mới
            </Button>

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
                width={800} 
                maskClosable={!formLoading} 
                closable={!formLoading} 
            >
                <Form
                    form={form} 
                    layout="vertical" 
                    onFinish={onFinishForm} 
                    initialValues={isEditing && currentProduct ? { 
                        ...currentProduct, 
                        images: currentProduct.images ? currentProduct.images.map(url => ({ url })) : [{ url: '' }]
                    } : { isFeatured: false, images: [{ url: '' }] }} 
                >
                    <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}>
                        <Input placeholder="Nhập tên sản phẩm" />
                    </Form.Item>

                    <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm!' }]}>
                        <Input.TextArea rows={4} placeholder="Nhập mô tả sản phẩm" />
                    </Form.Item>

                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Form.Item label="Giá" name="price" rules={[{ required: true, message: 'Vui lòng nhập giá!' }]} style={{ width: '48%' }}>
                            <Input type="number" placeholder="Giá sản phẩm" min={0} />
                        </Form.Item>
                        <Form.Item label="Danh mục" name="category" rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]} style={{ width: '48%' }}>
                            <Select placeholder="Chọn danh mục">
                                {categories.map(cat => (
                                    <Option key={cat} value={cat}>{cat}</Option> 
                                ))}
                            </Select>
                        </Form.Item>
                    </Space>
                    
                    <Form.Item label="Số lượng tồn kho" name="stockQuantity" rules={[{ required: true, message: 'Vui lòng nhập số lượng tồn kho!' }]}>
                        <Input type="number" placeholder="Số lượng tồn kho" min={0} />
                    </Form.Item>

                    <Form.List name="images">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, fieldKey, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'url']} 
                                            fieldKey={[fieldKey, 'url']}
                                            rules={[{ required: true, message: 'Vui lòng nhập URL ảnh!' }]}
                                            style={{ flexGrow: 1 }}
                                        >
                                            <Input placeholder="URL hình ảnh" />
                                        </Form.Item>
                                        <Button type="text" danger onClick={() => remove(name)} icon={<DeleteOutlined />} />
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add({ url: '' })} block icon={<PlusOutlined />}> 
                                        Thêm URL ảnh
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>


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

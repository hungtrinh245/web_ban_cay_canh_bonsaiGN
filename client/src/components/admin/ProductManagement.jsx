// client/src/components/admin/ProductManagement.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
    getAllBonsais, 
    createBonsai,
    updateBonsai,
    deleteBonsai,
    getCategories // getCategories sẽ gọi API /api/categories
} from '../../services/productService'; 
import Pagination from '../common/Pagination';

// Import Ant Design Components
import { Table, Button, Modal, Form, Input, Select, Switch, Space, Popconfirm, message as AntMessage, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { confirm } = Modal;

const ProductManagement = () => {
    const { token } = useAuth(); // Lấy token từ AuthContext để gọi API admin
    const navigate = useNavigate();

    // States cho dữ liệu bảng sản phẩm
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]); // Danh mục cho dropdown lọc và form
    const [loading, setLoading] = useState(true); // Loading cho việc tải bảng sản phẩm
    const [error, setError] = useState(null);     // Error cho việc tải bảng sản phẩm

    // States cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const productsPerPage = 8; // Số sản phẩm trên mỗi trang của bảng

    // States cho Modal (Form thêm/sửa sản phẩm)
    const [isModalVisible, setIsModalVisible] = useState(false); // Điều khiển hiển thị Modal
    const [isEditing, setIsEditing] = useState(false);           // Chế độ sửa hay thêm mới
    const [currentProduct, setCurrentProduct] = useState(null);  // Sản phẩm đang được sửa
    const [form] = Form.useForm(); // Ant Design Form instance

    // State loading cho form (khi gửi dữ liệu)
    const [formLoading, setFormLoading] = useState(false);

    // Hàm tải dữ liệu sản phẩm và danh mục
    const fetchProductsAndCategories = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);
            // Gọi API lấy tất cả sản phẩm với phân trang
            const productData = await getAllBonsais(page, productsPerPage);
            setProducts(productData.products);
            setCurrentPage(productData.page);
            setTotalPages(productData.totalPages);

            // Gọi API lấy danh mục (sử dụng getCategories từ productService.js)
            // LƯU Ý: Nếu backend của bạn đã cập nhật để có API /api/categories, thì dùng nó
            // Nếu bạn vẫn đang sử dụng hàm getBonsaiCategories ở bonsaiController.js, API đó là /api/bonsais/categories
            
            // Ở đây, tôi giả định bạn đã có API Categories riêng biệt
            const categoryData = await getCategories();
            // Category API trả về một mảng object { _id, name, ... }
            setCategories(categoryData.map(cat => cat.name)); 
        } catch (err) {
            setError(err.message || 'Không thể tải dữ liệu sản phẩm hoặc danh mục.');
            console.error("Fetch product/category error:", err);
            // VÌ BẠN ĐANG GẶP LỖI 404, HÀM NÀY SẼ THROW ERROR VÀ CHÚNG TA CÓ THỂ HIỂN THỊ THÔNG BÁO.
            AntMessage.error('Lỗi: ' + (err.message || 'Không thể tải dữ liệu.')); 
        } finally {
            setLoading(false);
        }
    };

    // useEffect để tải dữ liệu ban đầu
    useEffect(() => {
        // Chỉ fetch khi token đã có (tức là đã đăng nhập admin)
        if (token) {
            fetchProductsAndCategories();
        } else {
            setLoading(false);
            // AdminProtectedRoute sẽ xử lý việc chuyển hướng nếu không có quyền
        }
    }, [token]); // Chạy lại khi token thay đổi

    // Xử lý thay đổi trang
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchProductsAndCategories(page); // Tải lại dữ liệu cho trang mới
    };

    // Hiển thị Modal "Thêm sản phẩm mới"
    const showAddModal = () => {
        if (!token) { 
            AntMessage.error("Bạn cần đăng nhập để thực hiện thao tác này.");
            return;
        }
        setIsEditing(false);
        setCurrentProduct(null);
        form.resetFields(); 
        // Đặt giá trị mặc định cho form mới (đặc biệt là mảng images)
        form.setFieldsValue({ isFeatured: false, images: [{ url: '' }] }); 
        setIsModalVisible(true);
    };

    // Hiển thị Modal "Sửa sản phẩm"
    const showEditModal = (product) => {
        if (!token) { 
            AntMessage.error("Bạn cần đăng nhập để thực hiện thao tác này.");
            return;
        }
        setIsEditing(true);
        setCurrentProduct(product);
        // Thiết lập giá trị cho form khi sửa
        form.setFieldsValue({ 
            ...product, 
            images: product.images && product.images.length > 0 ? product.images.map(url => ({ url })) : [{ url: '' }],
        });
        setIsModalVisible(true);
    };

    // Xử lý khi đóng Modal (Cancel)
    const handleCancelModal = () => {
        setIsModalVisible(false);
        form.resetFields(); 
    };

    // Xử lý xóa sản phẩm
    const handleDeleteProduct = (productId) => {
        // KIỂM TRA TOKEN TRƯỚC KHI XÓA
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
                    // Truyền token vào hàm deleteBonsai
                    await deleteBonsai(productId, token); 
                    AntMessage.success('Sản phẩm đã xóa thành công!'); 
                    fetchProductsAndCategories(currentPage); // Tải lại danh sách sản phẩm
                } catch (err) {
                    AntMessage.error('Lỗi khi xóa sản phẩm: ' + (err.message || 'Lỗi không xác định')); 
                    console.error("Delete product error:", err);
                }
            },
        });
    };

    // Xử lý khi Submit Form (Thêm hoặc Sửa)
    const onFinishForm = async (values) => {
        // KIỂM TRA TOKEN TRƯỚC KHI SUBMIT FORM
        if (!token) { 
            AntMessage.error("Bạn cần đăng nhập để thực hiện thao tác này.");
            return;
        }
        setFormLoading(true);

        // Chuyển đổi mảng images từ [{ url: '...' }] về ['...']
        const imageURLs = values.images ? values.images.map(item => item.url).filter(url => url && url.trim() !== '') : [];

        // Chuẩn bị dữ liệu sản phẩm để gửi đi
        const productData = {
            ...values,
            price: Number(values.price),
            stockQuantity: Number(values.stockQuantity),
            images: imageURLs, 
            isFeatured: values.isFeatured || false, // Đảm bảo có giá trị false nếu undefined
        };

        try {
            if (isEditing && currentProduct) {
                await updateBonsai(currentProduct._id, productData, token); // Truyền token vào đây
                AntMessage.success('Cập nhật sản phẩm thành công!'); 
            } else {
                await createBonsai(productData, token); // Truyền token vào đây
                AntMessage.success('Thêm sản phẩm mới thành công!'); 
            }
            setIsModalVisible(false); // Đóng modal sau khi thành công
            form.resetFields(); // Reset form
            fetchProductsAndCategories(currentPage); // Tải lại danh sách sản phẩm
        } catch (err) {
            AntMessage.error('Lỗi: ' + (err.message || 'Không thể lưu sản phẩm.')); 
            console.error("Save product form error:", err);
        } finally {
            setFormLoading(false);
        }
    };

    // Định nghĩa các cột cho Ant Design Table (giữ nguyên)
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

    // Giao diện render chính của component
    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ fontSize: '2em', fontWeight: 'bold', color: '#2c3e50', marginBottom: '20px', paddingBottom: '10px', borderBottom: '2px solid #28a745' }}>
                Quản lý Sản phẩm
            </h1>

            <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal} style={{ marginBottom: '20px' }}>
                Thêm sản phẩm mới
            </Button>

            {/* AntMessage.error đã được gọi trong hàm fetchProductsAndCategories, không cần render ở đây */}
            {/* Nếu có lỗi, AntMessage đã hiển thị ở góc trên màn hình */}
            
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
                                    // Sửa lỗi ở đây: category là tên danh mục (string), không phải object
                                    <Option key={cat} value={cat}>{cat}</Option> 
                                ))}
                            </Select>
                        </Form.Item>
                    </Space>
                    
                    <Form.Item label="Số lượng tồn kho" name="stockQuantity" rules={[{ required: true, message: 'Vui lòng nhập số lượng tồn kho!' }]}>
                        <Input type="number" placeholder="Số lượng tồn kho" min={0} />
                    </Form.Item>

                    {/* Dynamic Image URLs */}
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
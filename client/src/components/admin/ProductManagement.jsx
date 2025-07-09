
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 

    getAllBonsais, 
    createBonsai,
    updateBonsai,
    deleteBonsai,
    getCategories 
} from '../../services/productService';
import Pagination from '../common/Pagination';

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
    const [form] = Form.useForm();

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

            // Gọi API lấy danh mục
            const categoryData = await getCategories();
            setCategories(categoryData);
        } catch (err) {
            setError(err.message || 'Không thể tải dữ liệu sản phẩm hoặc danh mục.');
            console.error("Fetch product/category error:", err);
            AntMessage.error('Lỗi: ' + (err.message || 'Không thể tải dữ liệu.')); // Hiển thị lỗi chung
        } finally {
            setLoading(false);
        }
    };

    // useEffect để tải dữ liệu ban đầu
    useEffect(() => {
        fetchProductsAndCategories();
    }, []); // Chạy 1 lần khi component mount

    // Xử lý thay đổi trang
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchProductsAndCategories(page); // Tải lại dữ liệu cho trang mới
    };

    // Hiển thị Modal "Thêm sản phẩm mới"
    const showAddModal = () => {
        setIsEditing(false);
        setCurrentProduct(null);
        form.resetFields(); // Reset tất cả các trường form
        form.setFieldsValue({ isFeatured: false, images: [{ url: '' }] }); // Set giá trị mặc định cho form mới
        setIsModalVisible(true);
    };

    // Hiển thị Modal "Sửa sản phẩm"
    const showEditModal = (product) => {
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
        form.resetFields(); // Reset form khi đóng
    };

    // Xử lý xóa sản phẩm
    const handleDeleteProduct = (productId) => {
        confirm({
            title: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
            icon: <ExclamationCircleOutlined />,
            content: 'Hành động này không thể hoàn tác!',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            async onOk() { // Hàm chạy khi nhấn 'Xóa' trong Popconfirm
                try {
                    await deleteBonsai(productId, token);
                    AntMessage.success('Sản phẩm đã xóa thành công!'); // Thông báo thành công
                    fetchProductsAndCategories(currentPage); // Tải lại danh sách sản phẩm
                } catch (err) {
                    AntMessage.error('Lỗi khi xóa sản phẩm: ' + (err.message || 'Lỗi không xác định')); // Thông báo lỗi
                    console.error("Delete product error:", err);
                }
            },
        });
    };

    // Xử lý khi Submit Form (Thêm hoặc Sửa)
    const onFinishForm = async (values) => {
        setFormLoading(true); // Bắt đầu loading cho form

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
                // Nếu đang ở chế độ sửa, gọi API updateBonsai
                await updateBonsai(currentProduct._id, productData, token);
                AntMessage.success('Cập nhật sản phẩm thành công!');
            } else {
                
                await createBonsai(productData, token);
                AntMessage.success('Thêm sản phẩm mới thành công!'); 
            }
            setIsModalVisible(false); 
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
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            render: (text) => text ? text.slice(-4).toUpperCase() : '',
            width: 80,
        },
        {
            title: 'Ảnh',
            dataIndex: 'images',
            key: 'images',
            render: (images) => (
                <img src={images && images.length > 0 ? images[0] : 'https://via.placeholder.com/50?text=No+Image'} alt="product" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
            ),
            width: 80,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name), // Sắp xếp theo tên
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `${price.toLocaleString('vi-VN')} VNĐ`, // Định dạng tiền tệ
            sorter: (a, b) => a.price - b.price, // Sắp xếp theo giá
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
            filters: categories.map(cat => ({ text: cat, value: cat })), // Lọc theo danh mục
            onFilter: (value, record) => record.category.indexOf(value) === 0,
        },
        {
            title: 'Tồn kho',
            dataIndex: 'stockQuantity',
            key: 'stockQuantity',
            sorter: (a, b) => a.stockQuantity - b.stockQuantity, // Sắp xếp theo tồn kho
        },
        {
            title: 'Nổi bật',
            dataIndex: 'isFeatured',
            key: 'isFeatured',
            render: (isFeatured) => (isFeatured ? 'Có' : 'Không'),
            filters: [{ text: 'Có', value: true }, { text: 'Không', value: false }],
            onFilter: (value, record) => record.isFeatured === value,
        },
        {
            title: 'Hành động',
            key: 'actions',
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
            width: 180,
            align: 'center',
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

            {error && <AntMessage type="error" content={error} style={{marginBottom: '20px'}} />}

            {/* Hiển thị Spin (loading) hoặc Bảng sản phẩm */}
            {loading ? (
                <Spin tip="Đang tải sản phẩm...">
                    <div style={{ height: '200px', border: '1px solid #f0f0f0', borderRadius: '8px' }} />
                </Spin>
            ) : (
                <>
                    <Table 
                        dataSource={products} // Dữ liệu cho bảng
                        columns={columns}     // Định nghĩa cột
                        rowKey="_id"          // Key duy nhất cho mỗi hàng
                        pagination={false}    // Tắt pagination mặc định của Antd Table để dùng Pagination component của bạn
                        bordered              // Thêm border cho bảng
                      
                    />
                
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}

           
            <Modal
                title={isEditing ? "Sửa sản phẩm" : "Thêm sản phẩm mới"} // Tiêu đề Modal
                open={isModalVisible} // 'visible' cho antd v4, 'open' cho antd v5+
                onCancel={handleCancelModal} // Xử lý khi nhấn Cancel hoặc thoát Modal
                footer={null} 
                width={800} 
                maskClosable={!formLoading} // Không cho đóng modal khi form đang submit
                closable={!formLoading} // Không cho tắt modal khi form đang submit
            >
       

                <Form
                    form={form} // Gán instance form
                    layout="vertical" // Layout dọc
                    onFinish={onFinishForm} // Hàm xử lý khi form được submit
                    // initialValues: Set giá trị mặc định hoặc giá trị khi sửa
                    initialValues={isEditing && currentProduct ? { 
                        ...currentProduct, 
                        // Map mảng URL hình ảnh sang định dạng Antd Form.List ({ url: '...' })
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
                                            name={[name, 'url']} // Tên trường là 'url' bên trong item của mảng images (vd: images[0].url)
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
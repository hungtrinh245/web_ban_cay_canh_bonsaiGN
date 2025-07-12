// client/src/components/admin/CategoryManagement.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
// Đảm bảo các hàm này được export từ productService.js
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/productService'; 

// Import Ant Design Components
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message as AntMessage, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const CategoryManagement = () => {
    const { token } = useAuth();

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [form] = Form.useForm();

    const [formLoading, setFormLoading] = useState(false);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            // Gọi API lấy tất cả danh mục (sử dụng getCategories từ productService)
            const data = await getCategories(); 
            setCategories(data);
        } catch (err) {
            setError(err.message || 'Không thể tải dữ liệu danh mục.');
            console.error("Fetch categories error:", err);
            AntMessage.error('Lỗi: ' + (err.message || 'Không thể tải danh mục.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Chỉ fetch khi có token (hoặc nếu API là public, nhưng Admin cần token để quản lý)
        if (token) {
            fetchCategories();
        } else {
            setLoading(false);
            setError("Bạn cần đăng nhập Admin để quản lý danh mục.");
        }
    }, [token]);

    const showAddModal = () => {
        setIsEditing(false);
        setCurrentCategory(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const showEditModal = (category) => {
        setIsEditing(true);
        setCurrentCategory(category);
        form.setFieldsValue(category); // Đặt giá trị form từ đối tượng category
        setIsModalVisible(true);
    };

    const handleCancelModal = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleDeleteCategory = (categoryId) => {
        confirm({
            title: 'Bạn có chắc chắn muốn xóa danh mục này?',
            icon: <ExclamationCircleOutlined />,
            content: 'Xóa danh mục có thể ảnh hưởng đến các sản phẩm thuộc danh mục đó.',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            async onOk() {
                try {
                    await deleteCategory(categoryId, token); // Gọi API xóa danh mục
                    AntMessage.success('Danh mục đã xóa thành công!');
                    fetchCategories(); // Tải lại danh sách
                } catch (err) {
                    AntMessage.error('Lỗi khi xóa danh mục: ' + (err.message || 'Lỗi không xác định'));
                    console.error("Delete category error:", err);
                }
            },
        });
    };

    const onFinishForm = async (values) => {
        setFormLoading(true);
        try {
            if (isEditing && currentCategory) {
                await updateCategory(currentCategory._id, values, token); // Gọi API cập nhật
                AntMessage.success('Cập nhật danh mục thành công!');
            } else {
                await createCategory(values, token); // Gọi API tạo mới
                AntMessage.success('Thêm danh mục mới thành công!');
            }
            setIsModalVisible(false);
            form.resetFields();
            fetchCategories(); // Tải lại danh sách
        } catch (err) {
            AntMessage.error('Lỗi: ' + (err.message || 'Không thể lưu danh mục.'));
            console.error("Save category form error:", err);
        } finally {
            setFormLoading(false);
        }
    };

    // Columns for Ant Design Table
    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            // Sử dụng render để xử lý lỗi nếu _id không phải chuỗi hoặc null
            render: (text) => (text && text.slice) ? text.slice(-6).toUpperCase() : '',
            width: 100,
        },
        {
            title: 'Tên danh mục',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            render: (text) => text || 'Không có',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleDateString('vi-VN'),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
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
                        title="Xóa danh mục"
                        description="Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác và có thể ảnh hưởng đến các sản phẩm liên quan!"
                        onConfirm={() => handleDeleteCategory(record._id)}
                        okText="Xóa"
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
                Quản lý Danh mục
            </h1>

            <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal} style={{ marginBottom: '20px' }}>
                Thêm danh mục mới
            </Button>

            {error && <AntMessage type="error" content={error} style={{ marginBottom: '20px' }} />}

            {loading ? (
                <Spin tip="Đang tải danh mục...">
                    <div style={{ height: '300px' }} />
                </Spin>
            ) : (
                <Table
                    dataSource={categories}
                    columns={columns}
                    rowKey="_id" // Antd sẽ sử dụng _id làm key
                    pagination={{ pageSize: 10 }}
                    bordered
                />
            )}

            {/* Modal Thêm/Sửa danh mục */}
            <Modal
                title={isEditing ? "Sửa danh mục" : "Thêm danh mục mới"}
                open={isModalVisible}
                onCancel={handleCancelModal}
                footer={null}
                width={600}
                maskClosable={!formLoading}
                closable={!formLoading}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinishForm}
                    initialValues={isEditing && currentCategory ? currentCategory : {}} 
                >
                    <Form.Item label="Tên danh mục" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}>
                        <Input placeholder="Ví dụ: Cây để bàn, Sen đá, Dụng cụ" />
                    </Form.Item>

                    <Form.Item label="Mô tả (tùy chọn)" name="description">
                        <Input.TextArea rows={3} placeholder="Mô tả về danh mục..." />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={formLoading}>
                            {isEditing ? 'Cập nhật' : 'Thêm danh mục'}
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

export default CategoryManagement;
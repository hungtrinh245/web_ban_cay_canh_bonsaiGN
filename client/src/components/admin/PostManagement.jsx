// client/src/components/admin/PostManagement.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllPosts, createPost, updatePost, deletePost } from '../../services/blogService'; // Import API services

// Import Ant Design Components
import { Table, Button, Modal, Form, Input, Select, Switch, Space, Popconfirm, Tag, message as AntMessage, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;
const { Option } = Select;

const PostManagement = () => {
    const { token, user } = useAuth(); // Lấy user để có author name
    
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const [form] = Form.useForm();

    const [formLoading, setFormLoading] = useState(false);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllPosts(); // Lấy tất cả bài viết (API này có phân trang)
            setPosts(data.posts); // Lấy mảng bài viết từ response
        } catch (err) {
            setError(err.message || 'Không thể tải dữ liệu bài viết.');
            console.error("Fetch posts error:", err);
            AntMessage.error('Lỗi: ' + (err.message || 'Không thể tải bài viết.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [token]); // Chạy lại khi token thay đổi

    const showAddModal = () => {
        setIsEditing(false);
        setCurrentPost(null);
        form.resetFields();
        form.setFieldsValue({ author: user ? user.name : 'Admin', isFeatured: false, tags: [] }); // Điền tên tác giả mặc định
        setIsModalVisible(true);
    };

    const showEditModal = (post) => {
        setIsEditing(true);
        setCurrentPost(post);
        form.setFieldsValue({
            ...post,
            tags: post.tags || [], // Đảm bảo tags là mảng nếu không có
        });
        setIsModalVisible(true);
    };

    const handleCancelModal = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleDeletePost = (postId) => {
        confirm({
            title: 'Bạn có chắc chắn muốn xóa bài viết này?',
            icon: <ExclamationCircleOutlined />,
            content: 'Hành động này không thể hoàn tác!',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            async onOk() {
                try {
                    await deletePost(postId, token);
                    AntMessage.success('Bài viết đã xóa thành công!');
                    fetchPosts();
                } catch (err) {
                    AntMessage.error('Lỗi khi xóa bài viết: ' + (err.message || 'Lỗi không xác định'));
                    console.error("Delete post error:", err);
                }
            },
        });
    };

    const onFinishForm = async (values) => {
        setFormLoading(true);

        const postData = {
            ...values,
            tags: values.tags || [], // Đảm bảo tags là mảng
            isFeatured: values.isFeatured || false,
            author: values.author || (user ? user.name : 'Admin'), // Lấy tác giả từ form hoặc user
        };

        try {
            if (isEditing && currentPost) {
                await updatePost(currentPost._id, postData, token);
                AntMessage.success('Cập nhật bài viết thành công!');
            } else {
                await createPost(postData, token);
                AntMessage.success('Thêm bài viết mới thành công!');
            }
            setIsModalVisible(false);
            form.resetFields();
            fetchPosts();
        } catch (err) {
            AntMessage.error('Lỗi: ' + (err.message || 'Không thể lưu bài viết.'));
            console.error("Save post form error:", err);
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
            render: (text) => text.slice(-6).toUpperCase(),
            width: 100,
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            key: 'author',
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
            filters: [ // Các danh mục mẫu cho blog, có thể fetch từ API nếu bạn có API danh mục blog
                { text: 'Mẹo chăm sóc', value: 'Mẹo chăm sóc' },
                { text: 'Phong thủy', value: 'Phong thủy' },
                { text: 'Tin tức', value: 'Tin tức' },
            ],
            onFilter: (value, record) => record.category === value,
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
            title: 'Lượt xem',
            dataIndex: 'views',
            key: 'views',
            sorter: (a, b) => a.views - b.views,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleDateString('vi-VN'),
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
                        title="Xóa bài viết"
                        description="Bạn có chắc chắn muốn xóa bài viết này?"
                        onConfirm={() => handleDeletePost(record._id)}
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
                Quản lý Bài viết
            </h1>

            <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal} style={{ marginBottom: '20px' }}>
                Thêm bài viết mới
            </Button>

            {error && <AntMessage type="error" content={error} style={{ marginBottom: '20px' }} />}

            {loading ? (
                <Spin tip="Đang tải bài viết...">
                    <div style={{ height: '300px' }} />
                </Spin>
            ) : (
                <Table
                    dataSource={posts}
                    columns={columns}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                    bordered
                />
            )}

            {/* Modal Thêm/Sửa bài viết */}
            <Modal
                title={isEditing ? "Sửa bài viết" : "Thêm bài viết mới"}
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
                    initialValues={isEditing && currentPost ? {
                        ...currentPost,
                        tags: currentPost.tags || [],
                    } : { isFeatured: false, author: user ? user.name : 'Admin', tags: [] }}
                >
                    <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài viết!' }]}>
                        <Input placeholder="Nhập tiêu đề bài viết" />
                    </Form.Item>

                    <Form.Item label="Mô tả ngắn gọn" name="excerpt" rules={[{ required: true, message: 'Vui lòng nhập mô tả ngắn gọn!' }]}>
                        <Input.TextArea rows={2} placeholder="Tóm tắt bài viết..." />
                    </Form.Item>

                    <Form.Item label="Nội dung" name="content" rules={[{ required: true, message: 'Vui lòng nhập nội dung bài viết!' }]}>
                        <Input.TextArea rows={8} placeholder="Nội dung chi tiết..." />
                    </Form.Item>

                    <Form.Item label="URL hình ảnh" name="image">
                        <Input placeholder="URL hình ảnh đại diện (tùy chọn)" />
                    </Form.Item>

                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Form.Item label="Tác giả" name="author" style={{ width: '48%' }}>
                            <Input placeholder="Tên tác giả" />
                        </Form.Item>
                        <Form.Item label="Danh mục" name="category" rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]} style={{ width: '48%' }}>
                            <Select placeholder="Chọn danh mục">
                                <Option value="Mẹo chăm sóc">Mẹo chăm sóc</Option>
                                <Option value="Phong thủy">Phong thủy</Option>
                                <Option value="Tin tức">Tin tức</Option>
                                {/* Thêm các danh mục khác nếu có */}
                            </Select>
                        </Form.Item>
                    </Space>

                    <Form.Item label="Tags (phân cách bằng dấu phẩy)" name="tags">
                        <Select
                            mode="tags"
                            style={{ width: '100%' }}
                            placeholder="Nhập tags và nhấn Enter (ví dụ: cây cảnh, chăm sóc, bonsai)"
                        />
                    </Form.Item>

                    <Form.Item name="isFeatured" valuePropName="checked" label="Bài viết nổi bật">
                        <Switch />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={formLoading}>
                            {isEditing ? 'Cập nhật' : 'Thêm bài viết'}
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

export default PostManagement;
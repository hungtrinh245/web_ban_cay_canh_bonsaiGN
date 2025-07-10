// client/src/components/admin/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAllUsers, updateUser, deleteUser } from '../../services/authService'; // Import API services

// Import Ant Design Components
import { Table, Button, Modal, Popconfirm, Select, Tag, message as AntMessage, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;
const { Option } = Select;

const UserManagement = () => {
    const { token, user: loggedInUser } = useAuth(); // Lấy user hiện tại để ngăn không cho xóa chính mình
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllUsers(token);
            setUsers(data);
        } catch (err) {
            setError(err.message || 'Không thể tải dữ liệu người dùng.');
            console.error("Fetch users error:", err);
            AntMessage.error('Lỗi: ' + (err.message || 'Không thể tải dữ liệu người dùng.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [token]);

    const handleUpdateUserRole = async (userId, newRole) => {
        try {
            await updateUser(userId, { role: newRole }, token);
            AntMessage.success('Cập nhật vai trò người dùng thành công!');
            fetchUsers(); // Tải lại danh sách
        } catch (err) {
            AntMessage.error('Lỗi khi cập nhật vai trò: ' + (err.message || 'Lỗi không xác định'));
            console.error("Update user role error:", err);
        }
    };

    const handleDeleteUser = (userId) => {
        if (loggedInUser && loggedInUser._id === userId) {
            AntMessage.warning('Bạn không thể xóa tài khoản của chính mình!');
            return;
        }

        confirm({
            title: 'Bạn có chắc chắn muốn xóa người dùng này?',
            icon: <ExclamationCircleOutlined />,
            content: 'Hành động này không thể hoàn tác!',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            async onOk() {
                try {
                    await deleteUser(userId, token);
                    AntMessage.success('Người dùng đã xóa thành công!');
                    fetchUsers();
                } catch (err) {
                    AntMessage.error('Lỗi khi xóa người dùng: ' + (err.message || 'Lỗi không xác định'));
                    console.error("Delete user error:", err);
                }
            },
        });
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
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            render: (role, record) => (
                <Select
                    defaultValue={role}
                    style={{ width: 120 }}
                    onChange={(newRole) => handleUpdateUserRole(record._id, newRole)}
                    disabled={record._id === loggedInUser._id} // Không cho sửa vai trò của chính mình
                >
                    <Option value="user">User</Option>
                    <Option value="admin">Admin</Option>
                </Select>
            ),
            filters: [{ text: 'User', value: 'user' }, { text: 'Admin', value: 'admin' }],
            onFilter: (value, record) => record.role === value,
        },
        {
            title: 'Ngày đăng ký',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleDateString('vi-VN'),
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Popconfirm
                        title="Xóa người dùng"
                        description="Bạn có chắc chắn muốn xóa người dùng này?"
                        onConfirm={() => handleDeleteUser(record._id)}
                        okText="Có"
                        cancelText="Không"
                        icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                        disabled={record._id === loggedInUser._id} // Không cho Popconfirm nếu là chính mình
                    >
                        <Button type="danger" icon={<DeleteOutlined />} disabled={record._id === loggedInUser._id}>
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
            width: 100,
            align: 'center',
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ fontSize: '2em', fontWeight: 'bold', color: '#2c3e50', marginBottom: '20px', paddingBottom: '10px', borderBottom: '2px solid #28a745' }}>
                Quản lý Người dùng
            </h1>

            {error && <AntMessage type="error" content={error} style={{ marginBottom: '20px' }} />}

            {loading ? (
                <Spin tip="Đang tải người dùng...">
                    <div style={{ height: '300px' }} />
                </Spin>
            ) : (
                <Table
                    dataSource={users}
                    columns={columns}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                    bordered
                />
            )}
        </div>
    );
};

export default UserManagement;
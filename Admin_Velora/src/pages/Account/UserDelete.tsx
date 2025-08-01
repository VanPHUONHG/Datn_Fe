import React, { useEffect, useState } from "react";
import type { User } from "types/user";
import { message, Table, Button, Popconfirm } from "antd";
import { forceDeleteUser, getDeletedUsers, restoreUser } from "services/user/user.service";
import { Link } from "react-router-dom";

const UserDelete = () => {
  const [deletedUsers, setDeletedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDeletedUsers = async () => {
    setLoading(true);
    try {
      const users = await getDeletedUsers();
      setDeletedUsers(users);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách người dùng đã xóa");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (userId: string) => {
    try {
      await restoreUser(userId);
      message.success("Khôi phục người dùng thành công");
      fetchDeletedUsers();
    } catch (error) {
      message.error("Khôi phục thất bại");
    }
  };

  useEffect(() => {
    fetchDeletedUsers();
  }, []);

  const handleForceDelete = async (userId: string) => {
  try {
    await forceDeleteUser(userId);
    message.success("Xóa người dùng vĩnh viễn thành công");
    fetchDeletedUsers();
  } catch (error) {
    message.error("Xóa vĩnh viễn thất bại");
  }
};

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: User, index: number) => index + 1,
    },
    {
      title: "Họ tên",
      dataIndex: "full_name",
      key: "full_name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
   {
  title: "Hành động",
  key: "actions",
  render: (_: any, record: User) => (
    <div className="flex gap-2">
      <Popconfirm
        title="Bạn có chắc muốn khôi phục người dùng này không?"
        onConfirm={() => handleRestore(record._id)}
        okText="Có"
        cancelText="Hủy"
      >
        <Button type="primary">Khôi phục</Button>
      </Popconfirm>

      <Popconfirm
        title="Xóa vĩnh viễn người dùng này? Hành động không thể hoàn tác!"
        onConfirm={() => handleForceDelete(record._id)}
        okText="Xóa"
        okButtonProps={{ danger: true }}
        cancelText="Hủy"
      >
        <Button danger>Xóa</Button>
      </Popconfirm>
    </div>
  ),
}

  ];

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Người dùng đã bị xóa mềm</h2>
      <div className="mb-4 flex justify-end">
  <Link to="/admin/user-list">
    <Button type="default">← Danh sách người dùng</Button>
  </Link>
</div>
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={deletedUsers}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default UserDelete;

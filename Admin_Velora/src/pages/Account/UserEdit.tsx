import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, message, Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, updateUser, updateUserStatus } from "services/user/user.service";
import type { User } from "types/user";

const { Option } = Select;

const UserEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<"active" | "banned">("active");
  


  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        const data = await getUserById(id);
        setStatus((data.status as "active" | "banned") || "active");

        form.setFieldsValue({
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          username: data.username,
          status: data.status,
        });
      } catch {
        message.error("Không thể lấy thông tin người dùng.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, form]);

  const handleSubmit = async (values: Partial<User>) => {
    try {
      if (!id) return;

      const { status, ...userData } = values;

      await updateUser(id, userData);
      if (status) {
        await updateUserStatus(id, status as "active" | "banned");
      }

      message.success("Cập nhật người dùng thành công");
      navigate("/admin/user-list");
    } catch {
      message.error("Cập nhật thất bại");
    }
  };

  if (loading) return <Spin tip="Đang tải..." className="flex justify-center mt-10" />;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-3xl font-bold mb-6 text-center">Chỉnh sửa người dùng</h2>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Họ tên"
          name="full_name"
          rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
        >
          <Input size="large" className="w-full" />
        </Form.Item>

        <Form.Item
          label="Tên đăng nhập"
          name="username"
          rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
        >
          <Input size="large" className="w-full" disabled/>
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ type: "email", message: "Email không hợp lệ" }]}
        >
          <Input size="large" className="w-full" disabled/>
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
        >
          <Input size="large" className="w-full" disabled/>
        </Form.Item>

        <Form.Item label="Địa chỉ" name="address">
          <Input size="large" className="w-full" disabled/>
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select
            size="large"
            className="w-full"
            onChange={(value) => setStatus(value)}
          >
            <Option value="active">Hoạt động</Option>
            <Option value="banned">Bị khóa</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button size="middle" type="primary" htmlType="submit">
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserEdit;

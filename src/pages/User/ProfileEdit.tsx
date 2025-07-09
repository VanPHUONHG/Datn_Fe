import React, { useEffect, useState } from "react";
import { getUserById, updateUser } from "services/user/user.service";
import { Button, Form, Input, message, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import type { IUser } from "types/user";

const ProfileEdit = () => {
  const [form] = Form.useForm();
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          message.error("Không tìm thấy thông tin người dùng");
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        const userData = await getUserById(parsedUser._id);
        setUser(userData);
        form.setFieldsValue(userData);
      } catch {
        message.error("Không thể tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [form]);

  const handleSubmit = async (values: Partial<IUser>) => {
    try {
      if (!user) return;
      const updated = await updateUser(user._id, values);
      message.success("Cập nhật thông tin thành công");

      localStorage.setItem("user", JSON.stringify(updated));

      navigate("/user/profile");
    }  catch (error: any) {
    if (error?.response?.data?.message) {
      message.error(error.response.data.message); // ✅ Hiển thị lỗi cụ thể từ server
    } else {
      message.error("Cập nhật thất bại");
    }
  }
  };

  if (loading) return <Spin tip="Đang tải..." className="flex justify-center p-10" />;

  if (!user) return <div className="text-center text-red-500">Không tìm thấy người dùng</div>;

  return (
    <div className="p-6 mt-10 max-w-2xl mx-auto bg-white shadow rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Chỉnh sửa hồ sơ</h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Tên đăng nhập"
          name="username"
          rules={[
            { required: true, message: "Tên đăng nhập là bắt buộc" },
            { min: 4, message: "Tên đăng nhập phải từ 4 ký tự trở lên" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Họ và tên"
          name="full_name"
          rules={[{ required: true, message: "Họ và tên là bắt buộc" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Email là bắt buộc" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input type="email" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[
            { required: true, message: "Số điện thoại là bắt buộc" },
            {
              pattern: /^0\d{9}$/,
              message: "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: "Địa chỉ là bắt buộc" }]}
        >
          <Input />
        </Form.Item>

        <div className="flex justify-end gap-4">
          <Button onClick={() => navigate("/user/profile")}>Huỷ</Button>
          <Button type="primary" htmlType="submit">
            Lưu thay đổi
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ProfileEdit;

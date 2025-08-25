import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Form, Input, Button, Select, Card, Spin } from "antd";
import type { IAttribute } from "types/attribute";
import { getAttributeById, updateAttribute } from "services/attribute/attribute.service";

const { Option } = Select;

const AttributeEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm<IAttribute>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttribute = async () => {
      try {
        if (!id) return;
        const data = await getAttributeById(id);
        form.setFieldsValue(data); // đổ dữ liệu vào form
        setLoading(false);
      } catch (err) {
        toast.error("Không tìm thấy thuộc tính!");
        navigate("/admin/attribute-list");
      }
    };
    fetchAttribute();
  }, [id, form, navigate]);

  const onFinish = async (values: IAttribute) => {
    try {
      if (!id) return;
      await updateAttribute(id, values);
      toast.success("Cập nhật thuộc tính thành công!");
      navigate("/admin/attribute-list");
    } catch (err) {
      toast.error("Cập nhật thất bại!");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Card title="Sửa thuộc tính" className="w-full mx-auto shadow-lg">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        {/* Type */}
        <Form.Item
          label="Loại thuộc tính"
          name="type"
          rules={[{ required: true, message: "Vui lòng chọn loại thuộc tính" }]}
        >
          <Select placeholder="Chọn loại thuộc tính">
            <Option value="size">Size</Option>
            <Option value="color">Color</Option>
          </Select>
        </Form.Item>

        {/* Value */}
        <Form.Item
          label="Giá trị"
          name="value"
          rules={[{ required: true, message: "Vui lòng nhập giá trị" }]}
        >
          <Input placeholder="Nhập giá trị" />
        </Form.Item>

        <Form.Item>
          <div className="flex gap-3">
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
            <Button onClick={() => navigate("/admin/attribute-list")}>
              Quay lại
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AttributeEdit;

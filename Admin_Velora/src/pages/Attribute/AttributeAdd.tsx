import React from "react";
import { Form, Input, Button, Select, message, Card } from "antd";
import type { IAttribute } from "types/attribute";
import { createAttribute } from "services/attribute/attribute.service";

const { Option } = Select;

const AttributeAdd: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = async (values: IAttribute) => {
    try {
      await createAttribute(values);
      message.success("Thêm thuộc tính thành công!");
      form.resetFields();
    } catch (error: any) {
      message.error(error?.response?.data?.error || "Thêm thuộc tính thất bại!");
    }
  };

  return (
    <Card title="Thêm thuộc tính" bordered={false} className="w-full">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Type */}
        <Form.Item
          label="Loại"
          name="type"
          rules={[{ required: true, message: "Vui lòng chọn loại thuộc tính!" }]}
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
          rules={[{ required: true, message: "Vui lòng nhập giá trị!" }]}
        >
          <Input placeholder="Ví dụ: M hoặc Đỏ" />
        </Form.Item>

        {/* Submit */}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Thêm thuộc tính
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AttributeAdd;

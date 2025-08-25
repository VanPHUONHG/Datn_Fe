import React, { useEffect, useState } from "react";
import { Table, Button, Pagination, Tag, Space, Spin, Empty, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ReloadOutlined, RollbackOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { IAttribute } from "types/attribute";
import { getDeletedAttributes, restoreAttribute } from "services/attribute/attribute.service";

const AttributeDelete = () => {
  const [data, setData] = useState<IAttribute[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const fetchDeletedAttributes = async () => {
    try {
      setLoading(true);
      const res = await getDeletedAttributes(page, limit);
      setData(res.data); // giả sử BE trả {data, total}
      setTotal(res.total);
    } catch (error) {
      console.error("Lỗi lấy danh sách thuộc tính đã xóa:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedAttributes();
  }, [page, limit]);

  // Xử lý khôi phục
  const handleRestore = async (id: string) => {
    try {
      await restoreAttribute(id);
      message.success("Khôi phục thuộc tính thành công!");
      fetchDeletedAttributes(); // load lại danh sách sau khi khôi phục
    } catch (error) {
      console.error("Lỗi khi khôi phục:", error);
      message.error("Khôi phục thất bại!");
    }
  };

  const columns: ColumnsType<IAttribute> = [
    {
      title: "STT",
      render: (_, __, index) => (page - 1) * limit + index + 1,
      width: 70,
      align: "center",
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type: string) => (
        <Tag
          color={type === "size" ? "blue" : "green"}
          className="px-2 py-0.5 text-xs rounded"
        >
          {type}
        </Tag>
      ),
    },
    {
      title: "Giá trị",
      dataIndex: "value",
      key: "value",
      render: (value: string) => <span className="text-sm">{value}</span>,
    },
    {
      title: "Ngày xóa",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (date?: Date) =>
        date ? (
          <span className="text-gray-700 text-sm">
            {new Date(date).toLocaleString()}
          </span>
        ) : (
          <span className="text-gray-400 text-sm">N/A</span>
        ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<RollbackOutlined />}
            className="bg-green-500 text-white hover:bg-green-600 text-xs"
            onClick={() => handleRestore(record._id!)}
          >
            Khôi phục
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium text-gray-700">
          Danh sách thuộc tính đã xóa
        </h2>
        <div className="flex gap-2">
          <Button
            type="default"
            size="small"
            icon={<ReloadOutlined />}
            onClick={fetchDeletedAttributes}
          >
            Làm mới
          </Button>
          <Button
            type="default"
            size="small"
            icon={<RollbackOutlined />}
            onClick={() => navigate("/admin/attribute-list")}
          >
            Quay lại danh sách
          </Button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      ) : data.length === 0 ? (
        <Empty description="Không có thuộc tính nào đã xóa" className="py-10" />
      ) : (
        <>
          <Table
            rowKey="_id"
            dataSource={data}
            columns={columns}
            pagination={false}
            bordered
            size="small"
          />
          <div className="flex justify-end mt-4">
            <Pagination
              current={page}
              pageSize={limit}
              total={total}
              onChange={(p, l) => {
                setPage(p);
                setLimit(l);
              }}
              showSizeChanger
              size="small"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AttributeDelete;

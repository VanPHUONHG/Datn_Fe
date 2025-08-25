import React, { useEffect, useState, useRef } from "react";
import { Table, Tag, Space, Button, Spin, Popconfirm, message, Input, type InputRef } from "antd";
import type { ColumnsType, ColumnType } from "antd/es/table";
import { EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { FilterConfirmProps } from "antd/es/table/interface";
import type { IAttribute } from "types/attribute";
import { deleteAttribute, getAttributes } from "services/attribute/attribute.service";

const AttributeList: React.FC = () => {
  const [attributes, setAttributes] = useState<IAttribute[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
const searchInput = useRef<InputRef>(null);
  const navigate = useNavigate();

  const fetchAttributes = async () => {
    setLoading(true);
    try {
      const data = await getAttributes();
        const sorted = (data || []).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
      setAttributes(sorted);
    } catch (error) {
      console.error("Lỗi khi tải attributes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteAttribute(id);
      message.success("Xóa mềm thuộc tính thành công!");
      fetchAttributes();
    } catch (error) {
      console.error("Lỗi khi xóa thuộc tính:", error);
      message.error("Xóa thất bại!");
    }
  };

  // ----- Search function cho cột Giá trị -----
  const getColumnSearchProps = (
    dataIndex: keyof IAttribute
  ): ColumnType<IAttribute> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Tìm kiếm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Xóa
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
   onFilter: (value, record) =>
  String(record[dataIndex] ?? "")
    .toLowerCase()
    .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: keyof IAttribute
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex as string);
  };

  const handleReset = (clearFilters?: () => void) => {
    clearFilters && clearFilters();
    setSearchText("");
  };

  // ----- Columns -----
  const columns: ColumnsType<IAttribute> = [
    {
      title: "STT",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Loại",
      dataIndex: "type",
      filters: [
        { text: "Size", value: "size" },
        { text: "Color", value: "color" },
        { text: "Material", value: "material" },
      ],
      onFilter: (value, record) => record.type === value,
      render: (type: string) => (
        <Tag color={type === "size" ? "blue" : "green"}>{type}</Tag>
      ),
    },
    {
      title: "Giá trị",
      dataIndex: "value",
      ...getColumnSearchProps("value"), // Search cho giá trị
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      render: (date: Date) => new Date(date).toLocaleString(),
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => navigate(`/admin/attribute-edit/${record._id}`)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record._id!)}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              disabled={record.isDeleted}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Danh sách thuộc tính</h2>
        <Button
          type="default"
          icon={<EyeOutlined />}
          onClick={() => navigate("/admin/attribute-delete")}
          style={{ backgroundColor: "#e6f7ff", borderColor: "#91d5ff", color: "#0050b3" }}
        >
          Xem danh sách đã xóa
        </Button>
      </div>

      {loading ? (
        <Spin />
      ) : (
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={attributes}
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default AttributeList;

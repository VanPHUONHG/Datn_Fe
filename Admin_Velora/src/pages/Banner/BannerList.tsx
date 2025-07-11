import React, { useEffect, useState } from "react";
import { Table, Button, Image, Tag, Popconfirm, message } from "antd";
import { useNavigate } from "react-router-dom";
import type { IBanner } from "types/banner";
import { deleteBanner, getAllBanners } from "services/banner/banner.service";

const BannerList = () => {
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const data = await getAllBanners();
      setBanners(data || []);
    } catch (error) {
      message.error("Không thể lấy danh sách banner");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteBanner(id);
      message.success("Xoá banner thành công");
      fetchBanners(); // Refresh list
    } catch (error) {
      message.error("Xoá banner thất bại");
    }
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (url: string) => <Image width={100} src={url} />,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Link",
      dataIndex: "link",
      key: "link",
      render: (text: string) => <a href={text} target="_blank" rel="noreferrer">{text}</a>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Hiển thị",
      dataIndex: "isActive",
      key: "isActive",
      render: (active: boolean) =>
        active ? <Tag color="green">Đang hiển thị</Tag> : <Tag color="red">Ẩn</Tag>,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: IBanner) => (
        <div className="flex gap-2">
          <Button type="primary" onClick={() => navigate(`/admin/banner-edit/${record._id}`)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn chắc chắn xoá?"
            onConfirm={() => handleDelete(record._id!)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button danger>Xoá</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white shadow rounded">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Danh sách Banner</h2>
        <Button type="primary" onClick={() => navigate("/admin/banner-add")}>
          + Thêm mới
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={banners}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 6 }}
      />
    </div>
  );
};

export default BannerList;

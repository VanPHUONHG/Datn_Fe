import { Button, Popconfirm, message } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getDeletedVariants,
  forceDeleteVariant,
  restoreVariant,
} from "services/variant/variant.service";
import type { IProductVariant } from "types/variant";
import { DeleteOutlined, RollbackOutlined } from "@ant-design/icons";
import { getAttributes } from "services/attribute/attribute.service";

const VariantDelete = () => {
  const [variants, setVariants] = useState<IProductVariant[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 5;

const [sizes, setSizes] = useState<{ _id: string; value: string }[]>([]);
const [colors, setColors] = useState<{ _id: string; value: string }[]>([]);

useEffect(() => {
  const fetchAttributes = async () => {
    try {
      const sizeData = await getAttributes("size");
      const colorData = await getAttributes("color");
      setSizes(sizeData);
      setColors(colorData);
    } catch (error) {
      console.error(error);
    }
  };
  fetchAttributes();
}, []);

  const fetchDeletedVariants = async (pageNumber = page) => {
    try {
      const res = await getDeletedVariants(pageNumber, perPage);
      setVariants(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Lỗi khi lấy biến thể đã xóa:", error);
      message.error("Lỗi khi lấy biến thể đã xóa");
    }
  };

  useEffect(() => {
    fetchDeletedVariants(page);
  }, [page]);

  const handleDeletePermanent = async (id: string) => {
    try {
      await forceDeleteVariant(id);
      message.success("Xóa vĩnh viễn biến thể thành công");
      fetchDeletedVariants(page);
    } catch (error: any) {
  console.error("Lỗi khi xóa vĩnh viễn:", error.response?.data || error.message);
  message.error(error.response?.data?.message || "Xóa vĩnh viễn thất bại");
}
  };

  const handleRestore = async (id: string) => {
    try {
      await restoreVariant(id);
      message.success("Khôi phục biến thể thành công");
      fetchDeletedVariants(page);
    } catch (error) {
      console.error("Lỗi khi khôi phục:", error);
      message.error("Khôi phục thất bại");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Danh sách biến thể đã xóa mềm
        </h2>
        <Link
          to="/admin/variant-list"
          className="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 border border-red-300 shadow transition"
        >
          Xem biến thể
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {[
                "STT",
                "Tên sản phẩm",
                "Sku",
                "Size",
                "Màu sắc",
                "Ảnh",
                "Giá gốc",
                "Giá KM",
                "Tồn kho",
                "Ngày xoá",
                "Thao tác",
              ].map((header) => (
                <th
                  key={header}
                  className=" px-4 py-3 text-left text-gray-700 font-medium select-none"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {variants.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-6 text-gray-500">
                  Không có biến thể nào đã xóa
                </td>
              </tr>
            ) : (
              variants.map((item, index) => (
                <tr
                  key={item._id}
                  className="even:bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <td className=" px-4 py-2">
                    {(page - 1) * perPage + index + 1}
                  </td>
                  <td className=" px-4 py-2">
                    {(item.product_id as any)?.name || "Không có"}
                  </td>
                  <td className=" px-4 py-2">{item.sku}</td>
               <td className="px-4 py-2">
  {sizes.find((s) => s._id === item.size)?.value || "Không có"}
</td>
<td className="px-4 py-2">
  {colors.find((c) => c._id === item.color)?.value || "Không có"}
</td>

                  <td className=" px-4 py-2">
                    <img
                      src={item.image}
                      alt="Ảnh biến thể"
                      className="w-12 h-12 object-cover rounded-md shadow-sm"
                    />
                  </td>
                  <td className=" px-4 py-2">
                    {item.price.toLocaleString()}₫
                  </td>
                  <td className=" px-4 py-2">
                    {item.discount_price?.toLocaleString() || "—"}₫
                  </td>
                  <td className=" px-4 py-2">{item.stock_quantity}</td>
                  <td className=" px-4 py-2 text-sm text-gray-600">
                    {item.isDeleted && item.updated_at
                      ? new Date(item.updated_at).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "Không rõ"}
                  </td>

                  <td className=" px-4 py-2 text-sm">
                    <div className="flex gap-2 justify-center">
                      {/* <Popconfirm
                        title="Bạn có chắc muốn xóa vĩnh viễn?"
                        onConfirm={() => handleDeletePermanent(item._id)}
                        okText="Xóa"
                        cancelText="Hủy"
                      >
                        <Button danger size="small" icon={<DeleteOutlined />}>
                          Xóa
                        </Button>
                      </Popconfirm> */}
                      <Popconfirm
                        title="Bạn có muốn khôi phục?"
                        onConfirm={() => handleRestore(item._id)}
                        okText="Khôi phục"
                        cancelText="Hủy"
                      >
                        <Button
                          type="primary"
                          size="small"
                          icon={<RollbackOutlined />}
                        >
                          Khôi phục
                        </Button>
                      </Popconfirm>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center items-center gap-2 text-sm select-none">
        <button
          disabled={page === 1}
          onClick={() => setPage(1)}
          className={`px-3 py-1 rounded-lg border transition font-medium ${
            page === 1
              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
          title="Trang đầu"
        >
          «
        </button>
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className={`px-3 py-1 rounded-lg border transition font-medium ${
            page === 1
              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
          title="Trang trước"
        >
          ‹
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded-lg border transition font-semibold ${
              page === i + 1
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          className={`px-3 py-1 rounded-lg border transition font-medium ${
            page === totalPages
              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
          title="Trang sau"
        >
          ›
        </button>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(totalPages)}
          className={`px-3 py-1 rounded-lg border transition font-medium ${
            page === totalPages
              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
          title="Trang cuối"
        >
          »
        </button>
      </div>
    </div>
  );
};

export default VariantDelete;

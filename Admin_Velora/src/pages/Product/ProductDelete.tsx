import { Button, Popconfirm, message } from "antd";
import React, { useEffect, useState } from "react";

import type { Product } from "types/product";
import { DeleteOutlined, RollbackOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { forceDeleteProduct, getDeletedProducts, restoreProduct } from "services/product/product.service";

const ProductDelete = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 5;

  const fetchDeletedProducts = async (pageNumber = page) => {
    try {
      const res = await getDeletedProducts(pageNumber, perPage);
      setProducts(res.data || []);
      setTotalPages(res.pagination.totalPages || 1);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm đã xóa:", error);
      message.error("Lỗi khi lấy sản phẩm đã xóa");
    }
  };

  useEffect(() => {
    fetchDeletedProducts(page);
  }, [page]);

  const handleDeletePermanent = async (id: string) => {
    try {
      await forceDeleteProduct(id);
      message.success("Xóa vĩnh viễn sản phẩm thành công");
      fetchDeletedProducts(page);
    } catch (error) {
      console.error("Lỗi khi xóa vĩnh viễn sản phẩm:", error);
      message.error("Lỗi khi xóa vĩnh viễn sản phẩm");
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await restoreProduct(id);
      message.success("Khôi phục sản phẩm thành công");
      fetchDeletedProducts(page);
    } catch (error) {
      console.error("Lỗi khi khôi phục sản phẩm:", error);
      message.error("Lỗi khi khôi phục sản phẩm");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Danh sách sản phẩm đã xóa mềm
        </h2>
      </div>
 <div className="mb-6 flex justify-end">
  <Link  to={"/admin/product-list"}
    className="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 border border-red-300 shadow transition">
    Xem sản phẩm
  </Link>
</div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {[
                "STT",
                "Tên sản phẩm",
                "Ảnh",
                "Giá (VNĐ)",
                "Danh mục",
                "Ngày xóa",
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
            {products.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-500">
                  Không có sản phẩm đã xóa
                </td>
              </tr>
            ) : (
              products.map((item, index) => (
                <tr
                  key={item._id}
                  className="even:bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <td className=" px-4 py-2">
                    {(page - 1) * perPage + index + 1}
                  </td>
                  <td className=" px-4 py-2 font-semibold text-gray-800 max-w-xs truncate">
                    {item.name}
                  </td>
                  <td className=" px-4 py-2">
                    {item.images?.length > 0 ? (
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md shadow-sm"
                      />
                    ) : (
                      <span className="text-gray-400 italic">Chưa có ảnh</span>
                    )}
                  </td>
                  <td className=" px-4 py-2">
                    {item.price.toLocaleString()}
                  </td>
                  <td className=" px-4 py-2">
{(item as any).category_id?.name || "Không có"}
                  </td>
                  <td className=" px-4 py-2 text-sm text-gray-600">
   {item.isDeleted && item.updatedAt
                      ? new Date(item.updatedAt).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "Không rõ"}
</td>
<td className=" px-4 py-7 text-sm flex gap-3 justify-center">
  {/* <Popconfirm
    title="Bạn có chắc muốn xóa vĩnh viễn sản phẩm này?"
    onConfirm={() => handleDeletePermanent(item._id)}
    okText="Xóa"
    cancelText="Hủy"
  >
    <Button
      danger
      size="small"
      icon={<DeleteOutlined />}
      style={{ minWidth: 80, padding: '0 12px' }}
      className="hover:bg-red-700 transition"
    >
      Xóa
    </Button>
  </Popconfirm> */}

  <Popconfirm
    title="Bạn có chắc muốn khôi phục sản phẩm này?"
    onConfirm={() => handleRestore(item._id)}
    okText="Khôi phục"
    cancelText="Hủy"
  >
    <Button
      type="primary"
      size="small"
      icon={<RollbackOutlined />}
      style={{ minWidth: 80, padding: '0 12px' }}
      className="hover:bg-blue-800 transition"
    >
      Khôi phục
    </Button>
  </Popconfirm>
</td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    <div className="mt-6 flex justify-center items-center gap-2 text-sm select-none">
  {/* Nút về trang đầu tiên */}
  <button
    disabled={page === 1}
    onClick={() => setPage(1)}
    className={`px-3 py-1 rounded-lg border transition font-medium
      ${page === 1
        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
      }`}
    title="Trang đầu"
  >
    «
  </button>

  {/* Nút về trang trước */}
  <button
    disabled={page === 1}
    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
    className={`px-3 py-1 rounded-lg border transition font-medium
      ${page === 1
        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
      }`}
    title="Trang trước"
  >
    ‹
  </button>

  {/* Các số trang */}
  {Array.from({ length: totalPages }, (_, i) => (
    <button
      key={i}
      onClick={() => setPage(i + 1)}
      className={`px-3 py-1 rounded-lg border transition font-semibold
        ${page === i + 1
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
        }`}
    >
      {i + 1}
    </button>
  ))}

  {/* Nút sang trang sau */}
  <button
    disabled={page === totalPages}
    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
    className={`px-3 py-1 rounded-lg border transition font-medium
      ${page === totalPages
        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
      }`}
    title="Trang sau"
  >
    ›
  </button>

  {/* Nút về trang cuối */}
  <button
    disabled={page === totalPages}
    onClick={() => setPage(totalPages)}
    className={`px-3 py-1 rounded-lg border transition font-medium
      ${page === totalPages
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

export default ProductDelete;

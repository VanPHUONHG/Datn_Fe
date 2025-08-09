import React, { useEffect, useState } from "react";
import { Button, message, Popconfirm } from "antd";

import type { Category } from "types/category";
import { Link, useNavigate } from "react-router-dom";
import { deleteCategory, getAllCategories } from "services/category/category.service";

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const perPage = 5;
  const nav = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const currentCategories = categories.slice(
    (page - 1) * perPage,
    page * perPage
  );
  const totalPages = Math.ceil(categories.length / perPage);

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((item) => item._id !== id));
      message.success("Xóa danh mục thành công!");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Đã xảy ra lỗi khi xóa";
      message.error("Lỗi: " + message);
      console.error(error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Quản lý danh mục
        </h2>
      </div>
      <div className="mb-6 flex justify-end">
        <Link to={"/admin/category-delete"}
          className="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 border border-red-300 shadow transition"
        >
          Xem danh mục đã xóa
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {["STT", "Tên danh mục", "Mô tả", "Thao tác"].map((header) => (
                <th
                  key={header}
                  className="border px-4 py-3 text-left text-gray-700 font-medium select-none"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentCategories.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  Đang tải danh mục
                </td>
              </tr>
            ) : (
              currentCategories.map((item, index) => (
                <tr
                  key={item._id}
                  className="even:bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <td className="border px-4 py-2">
                    {(page - 1) * perPage + index + 1}
                  </td>
                  <td className="border px-4 py-2 font-semibold text-gray-800">
                    {item.name}
                  </td>
                  <td className="border px-4 py-2">{item.description}</td>
                  <td className="border px-4 py-2">
                    <div className="flex gap-3">
                      <Button
                        className="bg-red-600 hover:bg-blue-700 text-white font-semibold"
                        onClick={() => nav(`/admin/category-in-product/${item._id}`)}
                      >
                        Chi tiết
                      </Button>
                      <Button
                        type="primary"
                        className="bg-blue-600 hover:bg-blue-700 font-semibold"
                        onClick={() => nav(`/admin/category-edit/${item._id}`)}
                      >
                        Sửa
                      </Button>
                      <Popconfirm
                        title="Bạn có chắc muốn xóa?"
                        okText="Có"
                        cancelText="Không"
                        onConfirm={() => handleDelete(item._id)}
                      >
                        <Button
                          danger
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold"
                        >
                          Xóa
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

export default CategoryList;

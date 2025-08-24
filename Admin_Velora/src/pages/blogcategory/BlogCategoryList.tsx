import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { message, Popconfirm } from "antd";
import { getBlogCategories } from "services/blog/category.service";
import { deleteBlogCategory } from "services/blogcategory/blogcategories.service";

const BlogCategoryList = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const perPage = 5;

  const fetchCategories = async () => {
    try {
      const res = await getBlogCategories();
      setCategories(res.data.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (slug: string) => {
    try {
      await deleteBlogCategory(slug);
      message.success("Xóa danh mục thành công");
      fetchCategories();
    } catch (error) {
      message.error("Lỗi khi xóa danh mục");
    }
  };

  const currentCategories = categories.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(categories.length / perPage);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6 flex justify-between">
        <Link
          to="/admin/blog-category-deleted"
          className="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 border border-red-300 shadow transition"
        >
          Danh mục đã xóa
        </Link>
      </div>

      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className=" px-4 py-3 text-left">STT</th>
            <th className=" px-4 py-3 text-left">Tên danh mục</th>
            <th className=" px-4 py-3 text-left">Mô tả</th>
            <th className=" px-4 py-3 text-left">Thao tác</th>
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
            currentCategories.map((cat, index) => (
              <tr key={cat._id} className="even:bg-gray-50 hover:bg-gray-100 transition">
                <td className=" px-4 py-2">{(page - 1) * perPage + index + 1}</td>
                <td className=" px-4 py-2">{cat.name}</td>
                <td className=" px-4 py-2">{cat.description || "Không có"}</td>
                <td className=" px-4 py-2">
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/blog-category-edit/${cat.slug}`}
                      className="px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition text-sm font-medium"
                    >
                      Sửa
                    </Link>
                    <Popconfirm
                      title="Bạn có chắc muốn xóa danh mục này không?"
                      onConfirm={() => handleDelete(cat.slug)}
                      okText="Xóa"
                      cancelText="Hủy"
                    >
                      <button
                        className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 transition text-sm font-medium"
                      >
                        Xóa
                      </button>
                    </Popconfirm>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Phân trang */}
      <div className="mt-6 flex justify-center items-center gap-2 text-sm select-none">
        <button
          disabled={page === 1}
          onClick={() => setPage(1)}
          className={`px-3 py-1 rounded-lg border transition font-medium ${page === 1
            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          title="Trang đầu"
        >
          «
        </button>

        <button
          disabled={page === 1}
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          className={`px-3 py-1 rounded-lg border transition font-medium ${page === 1
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
            className={`px-3 py-1 rounded-lg border transition font-semibold ${page === i + 1
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
          className={`px-3 py-1 rounded-lg border transition font-medium ${page === totalPages
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
          className={`px-3 py-1 rounded-lg border transition font-medium ${page === totalPages
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

export default BlogCategoryList;

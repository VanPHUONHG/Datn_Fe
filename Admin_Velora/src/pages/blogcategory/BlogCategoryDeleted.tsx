import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { message, Popconfirm } from "antd";
import { forceDeleteBlogCategory, getDeletedBlogCategories, restoreBlogCategory } from "services/blogcategory/blogcategories.service";

const BlogCategoryDeleted = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchDeletedCategories = async () => {
    try {
      const res = await getDeletedBlogCategories();
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Lỗi khi lấy danh mục đã xóa:", err);
      // message.error("Không thể lấy danh mục đã xóa");
    }
  };

  useEffect(() => {
    fetchDeletedCategories();
  }, []);

  const handleRestore = async (slug: string) => {
    try {
      const res = await restoreBlogCategory(slug);
      const data = res.data;

      if (data.success) {
        message.success(data.message || "Khôi phục thành công");
        navigate("/admin/blog-category-list");
        fetchDeletedCategories();
      } else {
        message.error(data.message || "Khôi phục thất bại");
      }
    } catch (err: any) {
      console.error("Lỗi khi khôi phục:", err);
      message.error(
        err?.response?.data?.message || "Lỗi không xác định khi khôi phục"
      );
    }
  };


  const handleForceDelete = async (slug: string) => {
    try {
      await forceDeleteBlogCategory(slug);
      message.success("Xóa vĩnh viễn thành công");
      navigate("/admin/blog-category-list");
      fetchDeletedCategories();
    } catch (err) {
      message.error("Lỗi khi xóa vĩnh viễn");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6 flex justify-between">
        <h2 className="text-lg font-semibold">Danh mục đã xóa</h2>
        <Link to="/admin/blog-category-list"          className="px-4 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300"
>
          ← Quay lại danh sách danh mục
        </Link>
      </div>

      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className=" px-4 py-2 text-left">STT</th>
            <th className=" px-4 py-2 text-left">Tên danh mục</th>
            <th className=" px-4 py-2 text-left">Mô tả</th>
            <th className=" px-4 py-2 text-left">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-6 text-gray-500">
                Không có danh mục nào trong thùng rác
              </td>
            </tr>
          ) : (
            categories.map((category, index) => (
              <tr key={category._id} className="even:bg-gray-50 hover:bg-gray-100 transition">
                <td className=" px-4 py-2">{index + 1}</td>
                <td className=" px-4 py-2">{category.name}</td>
                <td className=" px-4 py-2">{category.description}</td>
                <td className=" px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleRestore(category.slug)}
                    className="px-3 py-1 rounded-md bg-green-500 text-white hover:bg-green-600 text-sm"
                  >
                    Khôi phục
                  </button>
                  <Popconfirm
                    title="Xóa vĩnh viễn danh mục này?"
                    onConfirm={() => handleForceDelete(category.slug)}
                    okText="Xóa"
                    cancelText="Hủy"
                  >
                    <button className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 text-sm">
                      Xóa vĩnh viễn
                    </button>
                  </Popconfirm>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BlogCategoryDeleted;

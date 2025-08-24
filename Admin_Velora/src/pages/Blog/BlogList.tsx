import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteBlog, getBlogs } from "services/blog/blog.service";
import { message, Popconfirm } from "antd";

const BlogList = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const perPage = 5;

  const fetchBlogs = async () => {
    try {
      const res = await getBlogs();
      setBlogs(res.data.blogs || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (slug: string) => {
    try {
      await deleteBlog(slug);
      message.success("Xóa blog thành công");
      fetchBlogs();
    } catch (error) {
      message.error("Lỗi khi xóa blog");
    }
  };

  const currentBlogs = blogs.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(blogs.length / perPage);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6 flex justify-end">
        <Link
          to="/admin/blog-deleted"
          className="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 border border-red-300 shadow transition"
        >
          Xem blog đã xóa
        </Link>
      </div>


      <div>
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className=" px-4 py-3 text-left">STT</th>
              <th className=" px-4 py-3 text-left">Tiêu đề</th>
              <th className=" px-4 py-3 text-left">Danh mục</th>
              <th className=" px-4 py-3 text-left">Ngày đăng</th>
              <th className=" px-4 py-3 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentBlogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  Đang tải bài viết
                </td>
              </tr>
            ) : (
              currentBlogs.map((blog, index) => (
                <tr key={blog._id} className="even:bg-gray-50 hover:bg-gray-100 transition">
                  <td className=" px-4 py-2">{(page - 1) * perPage + index + 1}</td>
                  <td className=" px-4 py-2">{blog.title}</td>
                  <td className=" px-4 py-2">{blog.category?.name || "Không có"}</td>
                  <td className=" px-4 py-2">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
                  <td className=" px-4 py-2">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/blog-edit/${blog.slug}`}
                        className="px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition text-sm font-medium"
                      >
                        Sửa
                      </Link>

                      <Popconfirm
                        title="Bạn có chắc muốn xóa bài viết này không?"
                        onConfirm={() => handleDelete(blog.slug)}
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
      </div>

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

export default BlogList;

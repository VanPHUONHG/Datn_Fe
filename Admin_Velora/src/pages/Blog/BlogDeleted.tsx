import { Button, Popconfirm, message } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DeleteOutlined, RollbackOutlined } from "@ant-design/icons";
import {
  getDeletedBlogs,
  forceDeleteBlog,
  restoreBlog,
} from "services/blog/blog.service";

const BlogDeleted = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 5;

  const fetchDeletedBlogs = async (pageNumber = page) => {
    try {
      const res = await getDeletedBlogs({ page: pageNumber, limit: perPage });

      setBlogs(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Lỗi khi lấy blog đã xóa:", error);
      message.error("Không thể tải blog đã xóa");
    }
  };

  useEffect(() => {
    fetchDeletedBlogs(page);
  }, [page]);

  const handleForceDelete = async (slug: string) => {
    try {
      await forceDeleteBlog(slug);
      message.success("Xóa vĩnh viễn blog thành công");
      fetchDeletedBlogs(page);
    } catch (error) {
      console.error("Lỗi xóa vĩnh viễn:", error);
      message.error("Xóa vĩnh viễn thất bại");
    }
  };

  const handleRestore = async (slug: string) => {
    try {
      await restoreBlog(slug);
      message.success("Khôi phục blog thành công");
      fetchDeletedBlogs(page);
    } catch (error) {
      console.error("Lỗi khôi phục:", error);
      message.error("Khôi phục blog thất bại");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Blog đã xóa</h2>
        <Link
          to="/admin/blog-list"
          className="px-4 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300"
        >
          Quay lại danh sách blog
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {["STT", "Tiêu đề", "Danh mục", "Ngày xóa", "Thao tác"].map((h) => (
                <th key={h} className=" px-4 py-2 text-left text-gray-700 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {blogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  Không có blog nào đã xóa
                </td>
              </tr>
            ) : (
              blogs.map((blog, index) => (
                <tr key={blog._id} className="even:bg-gray-50 hover:bg-gray-100">
                  <td className=" px-4 py-2">{(page - 1) * perPage + index + 1}</td>
                  <td className=" px-4 py-2 font-semibold">{blog.title}</td>
                  <td className=" px-4 py-2">{blog.category?.name || "Không có"}</td>
                  <td className=" px-4 py-2 text-gray-600 text-sm">
                    {blog.updatedAt ? new Date(blog.updatedAt).toLocaleDateString() : "Không rõ"}
                  </td>
                  <td className=" px-4 py-2">
                    <div className="flex gap-2 justify-center">
                        <Popconfirm
                        title="Khôi phục blog này?"
                        onConfirm={() => handleRestore(blog.slug)}
                        okText="Khôi phục"
                        cancelText="Hủy"
                      >
                        <Button type="primary" icon={<RollbackOutlined />} size="small">
                          Khôi phục
                        </Button>
                      </Popconfirm>
                      <Popconfirm
                        title="Bạn có chắc muốn xóa vĩnh viễn blog này?"
                        onConfirm={() => handleForceDelete(blog.slug)}
                        okText="Xóa"
                        cancelText="Hủy"
                      >
                        <Button danger icon={<DeleteOutlined />} size="small">
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

      {/* Phân trang */}
      <div className="mt-6 flex justify-center gap-2 text-sm">
        <button
          disabled={page === 1}
          onClick={() => setPage(1)}
          className={`px-3 py-1 rounded border ${
            page === 1 ? "bg-gray-100 text-gray-400" : "hover:bg-gray-200"
          }`}
        >
          «
        </button>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className={`px-3 py-1 rounded border ${
            page === 1 ? "bg-gray-100 text-gray-400" : "hover:bg-gray-200"
          }`}
        >
          ‹
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded border ${
              page === i + 1 ? "bg-blue-600 text-white" : "hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className={`px-3 py-1 rounded border ${
            page === totalPages ? "bg-gray-100 text-gray-400" : "hover:bg-gray-200"
          }`}
        >
          ›
        </button>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(totalPages)}
          className={`px-3 py-1 rounded border ${
            page === totalPages ? "bg-gray-100 text-gray-400" : "hover:bg-gray-200"
          }`}
        >
          »
        </button>
      </div>
    </div>
  );
};

export default BlogDeleted;

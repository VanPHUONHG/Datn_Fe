import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getBlogCategories,
  getBlogs,
  getBlogsByCategory,
} from "services/blog/blog.service";


interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
  category?: {
    _id: string;
    name: string;
  };
  publishedAt: string;
}

interface Category {
  _id: string;
  name: string;
}

const Blog = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchAllBlogs = async () => {
    try {
      const res = await getBlogs();
      setBlogs(res.data.blogs || []);
    } catch (err) {
      console.error("Lỗi khi lấy blog:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getBlogCategories();
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Lỗi khi lấy danh mục:", err);
    }
  };

  const fetchBlogsByCategory = async (categoryId: string) => {
    try {
      const res = await getBlogsByCategory(categoryId);
      setBlogs(res.data.data || []);
    } catch (err) {
      console.error("Lỗi khi lọc blog theo danh mục:", err);
    }
  };

  useEffect(() => {
    fetchAllBlogs();
    fetchCategories();
  }, []);

  return (
    <div className="bg-white text-gray-800">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 py-2">
        <span className="text-gray-500 font-semibold text-sm ml-11">Blog Page</span>
        <div className="flex items-center gap-2 text-gray-500 mr-2">
          <a href="#" className="text-sm hover:text-green-500">Home</a>
          <span className="text-gray-400 text-sm">›</span>
          <span className="text-green-500 font-medium text-sm">Blog Page</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-5 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Blog posts */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {blogs.length === 0 ? (
              <p className="text-gray-500">Không có bài viết nào.</p>
            ) : (
              blogs.map((post) => (
                <article key={post._id} className="bg-[#f0f4f7] p-6">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-auto mb-4"
                  />
                  <p className="text-xs text-gray-400 mb-1">
                    {new Date(post.publishedAt).toLocaleDateString()} · {post.category?.name}
                  </p>
                  <h3 className="text-sm font-semibold mb-1 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-400 mb-3 leading-tight">
                    {post.excerpt}
                  </p>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-xs font-semibold text-gray-600 hover:underline"
                  >
                    Xem Thêm &gt;
                  </Link>
                </article>
              ))
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full max-w-xs">
            <div className="border border-gray-200 rounded p-4">
              <h4 className="text-lg font-semibold mb-4">Danh mục</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      fetchAllBlogs();
                    }}
                    className={`hover:text-green-600 ${!selectedCategory ? "text-green-600 font-semibold" : ""}`}
                  >
                    Tất cả
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat._id}>
                    <button
                      onClick={() => {
                        setSelectedCategory(cat._id);
                        fetchBlogsByCategory(cat._id);
                      }}
                      className={`hover:text-green-600 ${selectedCategory === cat._id ? "text-green-600 font-semibold" : ""}`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Blog;

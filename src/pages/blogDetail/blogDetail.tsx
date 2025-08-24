import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBlogBySlug } from "services/blog/blog.service";
interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail: string;
  category?: {
    name: string;
  };
  publishedAt: string;
}

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    if (slug) {
      getBlogBySlug(slug)
        .then((res) => setBlog(res.data))
        .catch((err) => console.error("Lỗi khi lấy blog:", err));
    }
  }, [slug]);

  if (!blog) return <div className="text-center py-10">Đang tải...</div>;

  return (
  <div className="bg-gray-50 min-h-screen pb-16">
  {/* Breadcrumb */}
  <div className="bg-white border-b border-gray-200 py-4">
    <div className="max-w-5xl mx-auto px-4 flex justify-between items-center text-sm text-gray-500">
      <span>Blog Page</span>
      <div className="flex items-center gap-2">
        <Link to="/" className="hover:text-green-600">Home</Link>
        <span>›</span>
        <span className="text-green-600 font-medium">{blog.title}</span>
      </div>
    </div>
  </div>

  <div className="max-w-5xl mx-auto px-4 mt-10 space-y-10">
    {/* Hình ảnh & Tiêu đề */}
    <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-200">
      <img
        src={blog.thumbnail}
        alt={blog.title}
        className="w-full h-[450px] object-cover transition-transform duration-500 hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white p-6">
          {blog.title}
        </h1>
      </div>
    </div>

    {/* Ngày đăng + Danh mục */}
    <div className="text-sm text-gray-500 flex items-center gap-4">
      <span>🗓 {new Date(blog.publishedAt).toLocaleDateString("vi-VN")}</span>
      {blog.category?.name && (
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium shadow-sm">
          {blog.category.name}
        </span>
      )}
    </div>

    {/* Nội dung */}
    <div
      className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-800"
      dangerouslySetInnerHTML={{ __html: blog.content }}
    />

    <hr className="my-10 border-gray-300" />
  </div>
</div>

  );
};

export default BlogDetail;

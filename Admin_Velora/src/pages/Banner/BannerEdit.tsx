import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Input, Button, message, Switch } from "antd";
import { getBlogs } from "services/blog/blog.service";
import type { IBlog } from "types/blog";
import type { IBanner } from "types/banner";
import { getBannerById, updateBanner } from "services/banner/banner.service";

const BannerEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState("");
const [currentBanner, setCurrentBanner] = useState<IBanner | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<IBanner>();

  // Lấy dữ liệu banner theo ID
useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await getBannerById(id!);
      setCurrentBanner(res);
      reset(res); // cập nhật toàn bộ form
      setImageUrlInput(res.image || "");
    } catch (error) {
      message.error("Không tìm thấy banner");
      navigate("/admin/banner-list");
    }
  };

  fetchData();
}, [id, reset, navigate]);

useEffect(() => {
  if (blogs.length && currentBanner?.link) {
    setValue("link", currentBanner.link);
  }
}, [blogs, currentBanner, setValue]);

  // Lấy danh sách blog
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await getBlogs();
        setBlogs(res.data.blogs || []);
      } catch (error) {
        console.error("Lỗi khi lấy blog:", error);
      }
    };
    fetchBlogs();
  }, []);

  // Upload ảnh
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("http://localhost:8888/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.url;
  };

  const onSubmit = async (formData: IBanner) => {
    try {
      let image = imageUrlInput;
      if (imageFile) {
        image = await uploadImage(imageFile);
      }

      const payload = { ...formData, image };
      await updateBanner(id!, payload);
      message.success("Cập nhật banner thành công");
      navigate("/admin/banner-list");
    } catch (error) {
      message.error("Cập nhật thất bại");
      console.error(error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Chỉnh sửa banner</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label>Tiêu đề</label>
          <input
            {...register("title", { required: "Không được để trống" })}
            className="w-full border rounded px-2 py-1"
          />
          {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        </div>

        <div>
          <label>Ảnh banner</label>
          <Input
            value={imageUrlInput}
            onChange={(e) => setImageUrlInput(e.target.value)}
            placeholder="https://..."
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="mt-2"
          />
          {(imageFile || imageUrlInput) && (
            <img
              src={imageFile ? URL.createObjectURL(imageFile) : imageUrlInput}
              alt="preview"
              className="w-32 h-20 mt-2 object-cover border"
            />
          )}
        </div>

        <div>
          <label>Liên kết đến bài viết</label>
          <select
            {...register("link")}
            className="w-full border rounded px-2 py-1"
          >
            <option value="">-- Chọn bài viết --</option>
            {blogs.map((blog) => (
              <option key={blog.slug} value={`/blog/${blog.slug}`}>
                {blog.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Mô tả</label>
          <textarea
            {...register("description")}
            className="w-full border rounded px-2 py-1"
            rows={3}
          />
        </div>

        <div className="flex items-center gap-2">
          <label>Hiển thị</label>
          <Switch
            checked={watch("isActive")}
            onChange={(checked) => setValue("isActive", checked)}
          />
        </div>

        <div>
          <Button type="primary" htmlType="submit">
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BannerEdit;

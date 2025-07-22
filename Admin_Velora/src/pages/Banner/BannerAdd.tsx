import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { message, Switch, Button, Input, Form } from "antd";
import { useNavigate } from "react-router-dom";
import { getBlogs } from "services/blog/blog.service";
import type { IBlog } from "types/blog";
import type { IBanner } from "types/banner";
import { createBanner } from "services/banner/banner.service";

const BannerAdd = () => {
  const navigate = useNavigate();
const [blogs, setBlogs] = useState<IBlog[]>([]);
const [imageFile, setImageFile] = useState<File | null>(null);
const [imageUrlInput, setImageUrlInput] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IBanner>({
    defaultValues: {
      isActive: true,
    },
  });
useEffect(() => {
  const fetchBlogs = async () => {
    try {
      const res = await getBlogs();
   const blogList = res.data?.blogs || [];

      setBlogs(blogList);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách blog", error);
    }
  };
  fetchBlogs();
}, []);

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

 const onSubmit = async (data: IBanner) => {
  try {
    // Xử lý ảnh
    if (imageFile) {
      const uploadedUrl = await uploadImage(imageFile);
      data.image = uploadedUrl;
    } else if (imageUrlInput.trim()) {
      data.image = imageUrlInput.trim();
    } else {
      message.error("Vui lòng nhập URL hoặc chọn ảnh tải lên");
      return;
    }

    await createBanner(data);
    message.success("Tạo banner thành công!");
    navigate("/admin/banner-list");
  } catch (error) {
    message.error("Tạo banner thất bại!");
    console.error(error);
  }
};


  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Thêm banner mới</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label>Tiêu đề</label>
      <input
  {...register("title", { required: "Không được để trống tiêu đề" })}
  className="w-full border rounded p-2"
/>
{errors.title && <p className="text-red-500">{errors.title.message}</p>}
        </div>

      <div>
  <label className="block font-semibold mb-1">Ảnh banner</label>
  <Input
    placeholder="https://... hoặc chọn ảnh bên dưới"
    value={imageUrlInput}
    onChange={(e) => setImageUrlInput(e.target.value)}
    className="mb-2"
  />
  <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        message.warning("Chỉ được phép tải lên file ảnh (jpg, png, webp...)");
        setImageFile(null);
        return;
      }
      setImageFile(file);
    }
  }}
/>

  {imageFile && (
    <div className="mt-2">
      <img
        src={URL.createObjectURL(imageFile)}
        alt="Preview"
        className="w-32 h-20 object-cover border rounded"
      />
    </div>
  )}
</div>


       <div>
  <label>Liên kết đến bài viết (tự động)</label>
  <select
    className="w-full border rounded px-2 py-1"
    onChange={(e) => setValue("link", `/blog/${e.target.value}`)}
  >
    <option value="">-- Chọn bài viết --</option>
    {blogs.map((blog) => (
      <option key={blog.slug} value={blog.slug}>
        {blog.title}
      </option>
    ))}
  </select>
</div>


       <div>
  <label>Mô tả</label>
  <textarea
    rows={3}
    {...register("description")}
    className="w-full border rounded p-2"
  />
</div>


        <div className="flex items-center gap-2">
          <label>Hiển thị:</label>
          <Switch
            defaultChecked
            onChange={(checked) => setValue("isActive", checked)}
            checked={watch("isActive")}
          />
        </div>

        <div>
          <Button type="primary" htmlType="submit">
            Thêm mới
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BannerAdd;

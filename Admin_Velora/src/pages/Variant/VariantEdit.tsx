import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { getVariantById, updateVariant } from "services/variant/variant.service";
import { getAllProducts } from "services/product/product.service";
import type { Product } from "types/product";
import type { IProductVariant } from "types/variant";

type VariantFormInput = Omit<
  IProductVariant,
  "_id" | "created_at" | "updated_at" | "isDeleted" | "is_available" | "deletedAt"
> & {
  product_id: string;
  images: string; // Chuỗi ảnh cách nhau bằng dấu phẩy
};

const VariantEdit = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const nav = useNavigate();
  const { id } = useParams<{ id: string }>();

const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
const [thumbnailUrlInput, setThumbnailUrlInput] = useState("");
const [imageFiles, setImageFiles] = useState<File[]>([]);
const [imageUrlsInput, setImageUrlsInput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<VariantFormInput>({
    defaultValues: {
      product_id: "",
      size: "",
      color: "",
      image: "",
      images: "",
      sku: "",
      price: 0,
      discount_price: 0,
      stock_quantity: 0,
    },
  });
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

  // Fetch variant + products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [variant, productRes] = await Promise.all([
          getVariantById(id as string),
          getAllProducts(),
        ]);

        const formData: VariantFormInput = {
          product_id:
            typeof variant.product_id === "object"
              ? variant.product_id._id
              : String(variant.product_id),
          size: variant.size,
          color: variant.color,
          image: variant.image,
          images: (variant.images || []).join(", "),
          sku: variant.sku,
          price: variant.price,
          discount_price: variant.discount_price ?? 0,
          stock_quantity: variant.stock_quantity,
        };

        reset(formData);
        setProducts(productRes.products || []);
      } catch (error: any) {
        console.error("Lỗi khi tải dữ liệu:", error.response?.data || error.message);
        message.error("Không thể tải dữ liệu biến thể");
      }
    };

    if (id) fetchData();
  }, [id, reset]);
  
const onSubmit = async (data: VariantFormInput) => {
  let thumbnailUrl = data.image;
  let images: string[] = [];

  try {
    // Upload thumbnail nếu có file mới
    if (thumbnailFile) {
      thumbnailUrl = await uploadImage(thumbnailFile);
    } else if (thumbnailUrlInput.trim()) {
      // Nếu người dùng nhập link thủ công
      thumbnailUrl = thumbnailUrlInput.trim();
    }

    // Xử lý ảnh phụ
    if (imageFiles.length > 0) {
      // Nếu có file mới → chỉ dùng ảnh mới
      images = await Promise.all(imageFiles.map(uploadImage));
    } else if (imageUrlsInput.trim()) {
      // Nếu không upload file, dùng ảnh từ input textarea (nhập link)
      images = imageUrlsInput
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url.startsWith("http"));
    } else {
      // Nếu không upload gì cả, giữ nguyên ảnh cũ
      images = data.images
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url.startsWith("http"));
    }

    const updatedData = {
      ...data,
      image: thumbnailUrl,
      images,
    };

    await updateVariant(id as string, updatedData);
    message.success("Cập nhật biến thể thành công");
    nav("/admin/variant-list");
  } catch (error) {
    console.error("Lỗi khi cập nhật:", error);
    message.error("Đã xảy ra lỗi khi cập nhật biến thể");
  }
};


  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold mb-8 text-center">Chỉnh sửa biến thể</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Sản phẩm */}
        <div>
          <label className="block font-semibold mb-1">Sản phẩm</label>
          <select {...register("product_id", { required: true })} className="w-full border rounded p-2">
            <option value="">-- Chọn sản phẩm --</option>
            {products.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
          {errors.product_id && <p className="text-red-500 text-sm">Vui lòng chọn sản phẩm</p>}
        </div>

        {/* Size */}
        <div>
          <label className="block font-semibold mb-1">Size</label>
          <select {...register("size", { required: true })} className="w-full border rounded p-2">
            <option value="">-- Chọn size --</option>
            {[38, 39, 40, 41, 42].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          {errors.size && <p className="text-red-500 text-sm">Không được để trống</p>}
        </div>

        {/* Màu */}
        <div>
          <label className="block font-semibold mb-1">Màu sắc</label>
          <input {...register("color", { required: true })} className="w-full border rounded p-2" />
          {errors.color && <p className="text-red-500 text-sm">Không được để trống</p>}
        </div>

        {/* Ảnh chính */}
        <div>
          <label className="block font-semibold mb-1">Ảnh đại diện</label>
          <input {...register("image", { required: true })} className="w-full border rounded p-2" />
          {errors.image && <p className="text-red-500 text-sm">Không được để trống</p>}
           <input
    type="file"
    accept="image/*"
    onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
  />
        </div>
{thumbnailFile && (
  <img
    src={URL.createObjectURL(thumbnailFile)}
    alt="Preview thumbnail"
    className="mt-2 w-24 h-24 object-cover border rounded"
  />
)}
        {/* Danh sách ảnh */}
        <div className="md:col-span-2">
          <label className="block font-semibold mb-1">Danh sách ảnh (phân cách bằng dấu phẩy)</label>
          <textarea {...register("images")} className="w-full border rounded p-2 h-24 resize-none" />
            <input
    type="file"
    accept="image/*"
    multiple
    onChange={(e) => {
      const files = Array.from(e.target.files || []);
      setImageFiles((prev) => [...prev, ...files]);
    }}
  />
        </div>
{imageFiles.length > 0 && (
  <div className="flex gap-2 mt-2 flex-wrap">
    {imageFiles.map((file, idx) => (
      <div key={idx} className="relative">
        <img
          src={URL.createObjectURL(file)}
          alt={`Preview ${idx}`}
          className="w-20 h-20 object-cover border rounded"
        />
        <button
          type="button"
          onClick={() => {
            const newFiles = [...imageFiles];
            newFiles.splice(idx, 1);
            setImageFiles(newFiles);
          }}
          className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center transform translate-x-1/2 -translate-y-1/2 hover:bg-red-800"
        >
          ×
        </button>
      </div>
    ))}
  </div>
)}
        {/* SKU */}
        <div>
          <label className="block font-semibold mb-1">SKU</label>
          <input {...register("sku", { required: true })} className="w-full border rounded p-2" />
          {errors.sku && <p className="text-red-500 text-sm">Không được để trống</p>}
        </div>

        {/* Giá gốc */}
        <div>
          <label className="block font-semibold mb-1">Giá gốc</label>
          <input
            {...register("price", { required: true, valueAsNumber: true, min: 0 })}
            type="number"
            className="w-full border rounded p-2"
          />
          {errors.price && <p className="text-red-500 text-sm">Giá không hợp lệ</p>}
        </div>

        {/* Giá KM */}
        <div>
          <label className="block font-semibold mb-1">Giá khuyến mãi</label>
          <input
            {...register("discount_price", {
              valueAsNumber: true,
              validate: (val) =>
                val === undefined || val < getValues("price") || "Giá KM phải nhỏ hơn giá gốc",
            })}
            type="number"
            className="w-full border rounded p-2"
          />
          {errors.discount_price && (
            <p className="text-red-500 text-sm">{errors.discount_price.message}</p>
          )}
        </div>

        {/* Tồn kho */}
        <div>
          <label className="block font-semibold mb-1">Tồn kho</label>
          <input
            {...register("stock_quantity", { required: true, valueAsNumber: true, min: 0 })}
            type="number"
            className="w-full border rounded p-2"
          />
          {errors.stock_quantity && <p className="text-red-500 text-sm">Không được để trống</p>}
        </div>

        {/* Nút submit */}
        <div className="md:col-span-2 text-center mt-4">
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded"
          >
            Cập nhật biến thể
          </button>
        </div>
      </form>
    </div>
  );
};

export default VariantEdit;

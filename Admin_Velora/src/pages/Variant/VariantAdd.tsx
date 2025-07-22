import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import type { IProductVariant } from "types/variant";
import { createVariant, getVariantsByProduct } from "services/variant/variant.service";
import { getAllProducts } from "services/product/product.service";
import type { Product } from "types/product";

type VariantFormInput = Omit<IProductVariant, "_id" | "created_at" | "updated_at" | "isDeleted"> & {
  images: string;
  product_id: string;
};

const VariantAdd = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const nav = useNavigate();

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
const [thumbnailUrlInput, setThumbnailUrlInput] = useState("");

const [imageFiles, setImageFiles] = useState<File[]>([]);
const [imageUrlsInput, setImageUrlsInput] = useState(""); // nhập bằng tay
const [variantsByProduct, setVariantsByProduct] = useState<IProductVariant[]>([]);

const fetchVariantsByProduct = async (productId: string) => {
  try {
    const res = await getVariantsByProduct({ product_id: productId, limit: 100 });
    setVariantsByProduct(res.variants || []);
  } catch (err) {
    console.error("Lỗi khi lấy biến thể theo sản phẩm:", err);
  }
};

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    getValues,
  } = useForm<VariantFormInput>();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProducts();
        setProducts(res.products || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
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


const onSubmit = async (data: VariantFormInput) => {
  let thumbnailUrl = thumbnailUrlInput;
  let images: string[] = [];

  // Ưu tiên upload ảnh đại diện
  if (thumbnailFile) {
    try {
      thumbnailUrl = await uploadImage(thumbnailFile);
    } catch {
      message.error("Lỗi upload ảnh đại diện");
      return;
    }
  }

  // Upload ảnh phụ nếu có file
  if (imageFiles.length > 0) {
    try {
      images = await Promise.all(imageFiles.map(uploadImage));
    } catch {
      message.error("Lỗi upload ảnh phụ");
      return;
    }
  } else if (imageUrlsInput) {
    // Nếu không có file, lấy từ link nhập
    images = imageUrlsInput
      .split(",")
      .map((url) => url.trim())
      .filter((url) => url.startsWith("http"));
  }
// Kiểm tra nếu đã có biến thể cùng màu → lấy ảnh từ đó
const matchedVariant = variantsByProduct.find(
  (variant) => variant.color.toLowerCase().trim() === data.color.toLowerCase().trim()
);

if (!thumbnailFile && !thumbnailUrlInput && matchedVariant) {
  thumbnailUrl = matchedVariant.image;
}

if (imageFiles.length === 0 && !imageUrlsInput && matchedVariant && matchedVariant.images) {
  images = matchedVariant.images;
}

  const variantData = {
    ...data,
    image: thumbnailUrl,
    images,
  };

  try {
    await createVariant(variantData);
    message.success("Thêm biến thể thành công");
    nav("/admin/variant-list");
  } catch (error: any) {
    const errorMsg = error?.response?.data?.message || "Đã xảy ra lỗi";
    const rawError = error?.response?.data?.error || "";

    if (
      (errorMsg.includes("duplicate key") || rawError.includes("E11000")) &&
      rawError.includes("sku")
    ) {
      setError("sku", { type: "manual", message: "SKU đã tồn tại." });
      return;
    }

    message.error(errorMsg);
  }
};

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold mb-8 text-center">Thêm biến thể</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block font-semibold mb-1">Sản phẩm</label>
         <select
  {...register("product_id", { required: true })}
  className="w-full border rounded p-2"
  onChange={(e) => {
    const productId = e.target.value;
    fetchVariantsByProduct(productId); // gọi API
  }}
>
  <option value="">-- Chọn sản phẩm --</option>
  {products.map((item) => (
    <option key={item._id} value={item._id}>
      {item.name}
    </option>
  ))}
</select>

          {errors.product_id && <p className="text-red-500 text-sm">Vui lòng chọn sản phẩm</p>}
        </div>

        <div>
          <label className="block font-semibold mb-1">Size</label>
          <select {...register("size", { required: true })} className="w-full border rounded p-2">
            <option value="">-- Chọn size --</option>
            {[38, 39, 40, 41, 42].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          {errors.size && <p className="text-red-500 text-sm">Không được để trống</p>}
        </div>

        <div>
          <label className="block font-semibold mb-1">Màu sắc</label>
          <input {...register("color", { required: true })} className="w-full border rounded p-2" placeholder="Đen, trắng..." />
          {errors.color && <p className="text-red-500 text-sm">Không được để trống</p>}
        </div>

      {/* Ảnh đại diện */}
<div>
  <label className="block font-semibold mb-1">Ảnh đại diện (thumbnail)</label>
  <input
    type="text"
    placeholder="Dán link ảnh (nếu không upload)"
    className="w-full border rounded p-2 mb-2"
    value={thumbnailUrlInput}
    onChange={(e) => setThumbnailUrlInput(e.target.value)}
  />
  
 <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file && !file.type.startsWith("image/")) {
      message.warning("Chỉ được phép tải lên file ảnh");
      setThumbnailFile(null);
      return;
    }
    setThumbnailFile(file || null);
  }}
/>

</div>
{thumbnailFile && (
  <img
    src={URL.createObjectURL(thumbnailFile)}
    alt="Thumbnail preview"
    className="mt-2 w-24 h-24 object-cover border rounded"
  />
)}

{/* Danh sách ảnh phụ */}
<div>
  <label className="block font-semibold mb-1">Danh sách ảnh (từ link hoặc upload)</label>
  <textarea
    value={imageUrlsInput}
    onChange={(e) => setImageUrlsInput(e.target.value)}
    className="w-full border rounded p-2 h-24 resize-none mb-2"
    placeholder="https://... , https://..."
  ></textarea>
 <input
  type="file"
  accept="image/*"
  multiple
  onChange={(e) => {
    const files = Array.from(e.target.files || []);
    const validImages = files.filter((file) => file.type.startsWith("image/"));

    if (validImages.length < files.length) {
      message.warning("Chỉ được phép tải lên file ảnh (jpg, png, webp...)");
    }

    setImageFiles((prev) => [...prev, ...validImages]);
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
            newFiles.splice(idx, 1); // Xoá ảnh tại vị trí idx
            setImageFiles(newFiles);
          }}
          className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center transform translate-x-1/2 -translate-y-1/2 hover:bg-red-800"
          title="Xoá ảnh"
        >
          ×
        </button>
      </div>
    ))}
  </div>
)}



        <div>
          <label className="block font-semibold mb-1">SKU</label>
          <input {...register("sku", { required: true })} className="w-full border rounded p-2" placeholder="SKU123..." />
          {errors.sku && <p className="text-red-500 text-sm">{errors.sku.message || "Không được để trống"}</p>}
        </div>

        <div>
          <label className="block font-semibold mb-1">Giá gốc</label>
          <input {...register("price", { required: true, valueAsNumber: true, min: 0 })} type="number" className="w-full border rounded p-2" />
          {errors.price && <p className="text-red-500 text-sm">Giá không hợp lệ</p>}
        </div>

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
          {errors.discount_price && <p className="text-red-500 text-sm">{errors.discount_price.message}</p>}
        </div>

        <div>
          <label className="block font-semibold mb-1">Tồn kho</label>
          <input {...register("stock_quantity", { required: true, valueAsNumber: true, min: 0 })} type="number" className="w-full border rounded p-2" />
          {errors.stock_quantity && <p className="text-red-500 text-sm">Không được để trống</p>}
        </div>

        <div className="md:col-span-2 text-center mt-4">
          <button type="submit" className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-6 rounded">
            Thêm biến thể
          </button>
        </div>
      </form>
    </div>
  );
};

export default VariantAdd;

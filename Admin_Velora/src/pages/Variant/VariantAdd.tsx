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
  const [imageUrlsInput, setImageUrlsInput] = useState("");
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
      const sortedProducts = (res.products || []).sort((a: Product, b: Product) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // mới nhất lên trên
      });
      setProducts(sortedProducts);
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

    if (thumbnailFile) {
      try {
        thumbnailUrl = await uploadImage(thumbnailFile);
      } catch {
        message.error("Lỗi upload ảnh đại diện");
        return;
      }
    }

    if (imageFiles.length > 0) {
      try {
        images = await Promise.all(imageFiles.map(uploadImage));
      } catch {
        message.error("Lỗi upload ảnh phụ");
        return;
      }
    } else if (imageUrlsInput) {
      images = imageUrlsInput
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url.startsWith("http"));
    }

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

  const inputClass =
    "w-full border border-gray-300 rounded-lg p-3 text-base " +
    "focus:ring-2 focus:ring-green-500 focus:border-green-500 " +
    "outline-none transition-all duration-300 ease-in-out " +
    "hover:border-green-400";

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white shadow-xl rounded-2xl">
      <h2 className="text-3xl font-bold mb-10 text-center">
         Thêm Biến Thể
      </h2>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8" onSubmit={handleSubmit(onSubmit)}>
        {/* Sản phẩm */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Sản phẩm</label>
          <select
            {...register("product_id", { required: true })}
            className={inputClass}
            onChange={(e) => fetchVariantsByProduct(e.target.value)}
          >
            <option value="">-- Chọn sản phẩm --</option>
            {products.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
          {errors.product_id && <p className="text-red-500 text-sm mt-1">Vui lòng chọn sản phẩm</p>}
        </div>

        {/* Size */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Size</label>
          <select {...register("size", { required: true })} className={inputClass}>
            <option value="">-- Chọn size --</option>
            {[38, 39, 40, 41, 42].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          {errors.size && <p className="text-red-500 text-sm mt-1">Không được để trống</p>}
        </div>

        {/* Màu sắc */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Màu sắc</label>
          <input {...register("color", { required: true })} placeholder="Đen, trắng..." className={inputClass} />
          {errors.color && <p className="text-red-500 text-sm mt-1">Không được để trống</p>}
        </div>

        {/* Ảnh đại diện */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Ảnh đại diện</label>
          <input
            type="text"
            placeholder="Dán link ảnh"
            className={`${inputClass} mb-2`}
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
            className="w-full"
          />
          {thumbnailFile && (
            <img
              src={URL.createObjectURL(thumbnailFile)}
              alt="Thumbnail preview"
              className="mt-2 w-24 h-24 object-cover border rounded-lg"
            />
          )}
        </div>

        {/* Ảnh phụ */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-600 mb-1">Danh sách ảnh</label>
          <textarea
            value={imageUrlsInput}
            onChange={(e) => setImageUrlsInput(e.target.value)}
            className={`${inputClass} h-24 resize-none mb-2`}
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
                message.warning("Chỉ được phép tải lên file ảnh");
              }
              setImageFiles((prev) => [...prev, ...validImages]);
            }}
            className="w-full"
          />
          {imageFiles.length > 0 && (
            <div className="flex gap-3 mt-3 flex-wrap">
              {imageFiles.map((file, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${idx}`}
                    className="w-20 h-20 object-cover border rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newFiles = [...imageFiles];
                      newFiles.splice(idx, 1);
                      setImageFiles(newFiles);
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

          {/* Giá gốc */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Giá gốc</label>
          <input
            {...register("price", { required: true, valueAsNumber: true, min: 0 })}
            type="number"
            className={inputClass}
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">Giá không hợp lệ</p>}
        </div>

  {/* Giá KM */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Giá khuyến mãi</label>
          <input
            {...register("discount_price", {
              valueAsNumber: true,
              validate: (val) => val === undefined || val < getValues("price") || "Giá KM phải nhỏ hơn giá gốc",
            })}
            type="number"
            className={inputClass}
          />
          {errors.discount_price && (
            <p className="text-red-500 text-sm mt-1">{errors.discount_price.message}</p>
          )}
        </div>
      

      

      
  {/* SKU */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">SKU</label>
          <input {...register("sku", { required: true })} placeholder="SKU123..." className={inputClass} />
          {errors.sku && (
            <p className="text-red-500 text-sm mt-1">{errors.sku.message || "Không được để trống"}</p>
          )}
        </div>

        {/* Tồn kho */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Tồn kho</label>
          <input
            {...register("stock_quantity", { required: true, valueAsNumber: true, min: 0 })}
            type="number"
            className={inputClass}
          />
          {errors.stock_quantity && <p className="text-red-500 text-sm mt-1">Không được để trống</p>}
        </div>

        {/* Submit */}
        <div className="md:col-span-2 text-center mt-6">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Thêm biến thể
          </button>
        </div>
      </form>
    </div>
  );
};

export default VariantAdd;

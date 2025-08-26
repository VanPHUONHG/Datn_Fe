import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { message, Select, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import type { IProductVariant } from "types/variant";
import { createVariant, getVariantsByProduct } from "services/variant/variant.service";
import { getAllProducts } from "services/product/product.service";
import { getAttributes } from "services/attribute/attribute.service";
import type { Product } from "types/product";
import type { IAttribute } from "types/attribute";

type VariantFormInput = Omit<
  IProductVariant,
  "_id" | "created_at" | "updated_at" | "isDeleted"
> & {
  images: string;
  product_id: string;
};

const { Option } = Select;

const VariantAdd = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sizes, setSizes] = useState<IAttribute[]>([]);
  const [colors, setColors] = useState<IAttribute[]>([]);
  const [variantsByProduct, setVariantsByProduct] = useState<IProductVariant[]>([]);

  const [loading, setLoading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailUrlInput, setThumbnailUrlInput] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrlsInput, setImageUrlsInput] = useState("");

  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    getValues,
    setValue,
  } = useForm<VariantFormInput>();

  // Lấy danh sách sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await getAllProducts();
        const sorted = (res.products || []).sort(
          (a: Product, b: Product) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setProducts(sorted);
      } catch (err) {
        console.error("Lỗi lấy sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Lấy thuộc tính size & color
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const [sizes, colors] = await Promise.all([
          getAttributes("size"),
          getAttributes("color"),
        ]);
        setSizes(sizes || []);
        setColors(colors || []);
      } catch (err) {
        console.error("Lỗi lấy thuộc tính:", err);
      }
    };
    fetchAttributes();
  }, []);

  const fetchVariantsByProduct = async (productId: string) => {
    try {
      const res = await getVariantsByProduct({ product_id: productId, limit: 100 });
      setVariantsByProduct(res.variants || []);
    } catch (err) {
      console.error("Lỗi lấy biến thể:", err);
    }
  };

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

    // Nếu chưa có ảnh thì lấy lại từ biến thể cùng màu
    const matchedVariant = variantsByProduct.find((variant) => {
      const colorId = typeof variant.color === "string" ? variant.color : variant.color?._id;
      const productId = typeof variant.product_id === "string" ? variant.product_id : variant.product_id?._id;
      return colorId === data.color && productId === data.product_id;
    });

   if (!matchedVariant) {
  // Màu mới → phải upload ảnh hoặc có link
  if (!thumbnailFile && !thumbnailUrlInput) {
    message.error("Màu mới phải có ảnh đại diện");
    return;
  }
  if (imageFiles.length === 0 && !imageUrlsInput.trim()) {
    message.error("Màu mới phải có ít nhất một ảnh phụ");
    return;
  }
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
    "w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-300 ease-in-out hover:border-green-400";

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white shadow-2xl rounded-2xl">
      <h2 className="text-3xl font-bold mb-10 text-center text-green-700"> Thêm Biến Thể</h2>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleSubmit(onSubmit)}>
        
        {/* Sản phẩm */}
        <div>
          <label className="block text-sm font-medium mb-1">Sản phẩm</label>
          <Select
            showSearch
            placeholder="-- Chọn sản phẩm --"
            className="w-full"
            optionFilterProp="label"
            filterOption={(input, option) =>
              (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
            }
            onChange={(value) => {
              setValue("product_id", value, { shouldValidate: true });
              fetchVariantsByProduct(value);
            }}
            loading={loading}
            options={products.map((p) => ({
              label: p.name,
              value: p._id,
            }))}
          />
          {errors.product_id && (
            <p className="text-red-500 text-sm mt-1">Vui lòng chọn sản phẩm</p>
          )}
        </div>

        {/* Size */}
        <div>
          <label className="block text-sm font-medium mb-1">Size</label>
          <Select
            placeholder="-- Chọn size --"
            className="w-full"
            onChange={(val) => setValue("size", val, { shouldValidate: true })}
          >
            {sizes.map((s) => (
              <Option key={s._id} value={s._id}>
                {s.value}
              </Option>
            ))}
          </Select>
          {errors.size && <p className="text-red-500 text-sm mt-1">Không được để trống</p>}
        </div>

        {/* Màu sắc */}
        <div>
          <label className="block text-sm font-medium mb-1">Màu sắc</label>
          <Select
            placeholder="-- Chọn màu sắc --"
            className="w-full"
            onChange={(val) => setValue("color", val, { shouldValidate: true })}
          >
            {colors.map((c) => (
              <Option key={c._id} value={c._id}>
                {c.value}
              </Option>
            ))}
          </Select>
          {errors.color && <p className="text-red-500 text-sm mt-1">Không được để trống</p>}
        </div>

        {/* SKU */}
        <div>
          <label className="block text-sm font-medium mb-1">SKU</label>
          <input
            {...register("sku", { required: true })}
            placeholder="SKU123..."
            className={inputClass}
          />
          {errors.sku && (
            <p className="text-red-500 text-sm mt-1">{errors.sku.message || "Không được để trống"}</p>
          )}
        </div>

        {/* Giá gốc */}
        <div>
          <label className="block text-sm font-medium mb-1">Giá gốc</label>
          <input
            {...register("price", { required: true, valueAsNumber: true, min: 0 })}
            type="number"
            className={inputClass}
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">Giá không hợp lệ</p>}
        </div>

        {/* Giá KM */}
        <div>
          <label className="block text-sm font-medium mb-1">Giá khuyến mãi</label>
          <input
            {...register("discount_price", {
              valueAsNumber: true,
              validate: (val) =>
                val === undefined || val < getValues("price") || "Giá KM phải nhỏ hơn giá gốc",
            })}
            type="number"
            className={inputClass}
          />
          {errors.discount_price && (
            <p className="text-red-500 text-sm mt-1">{errors.discount_price.message}</p>
          )}
        </div>

        {/* Tồn kho */}
        <div>
          <label className="block text-sm font-medium mb-1">Tồn kho</label>
          <input
            {...register("stock_quantity", { required: true, valueAsNumber: true, min: 0 })}
            type="number"
            className={inputClass}
          />
          {errors.stock_quantity && <p className="text-red-500 text-sm mt-1">Không được để trống</p>}
        </div>

      {/* Ảnh đại diện */}
<div>
  <label className="block text-sm font-medium mb-1">Ảnh đại diện</label>
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
      const file = e.target.files?.[0] || null;
      if (!file) {
        setThumbnailFile(null);
        return;
      }

      // Check mime type
      if (!file.type.startsWith("image/")) {
        message.error("Chỉ được phép tải file ảnh (jpg, png, webp...)");
        setThumbnailFile(null);
        return;
      }

      setThumbnailFile(file);
    }}
    className="w-full"
  />
  {thumbnailFile && (
    <img
      src={URL.createObjectURL(thumbnailFile)}
      alt="Thumbnail"
      className="mt-2 w-24 h-24 object-cover border rounded-lg"
    />
  )}
</div>


        {/* Ảnh phụ */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Danh sách ảnh</label>
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
  const validFiles = files.filter(file => file.type.startsWith("image/"));
  if (validFiles.length !== files.length) {
    message.error("Chỉ được phép tải file ảnh (jpg, png, webp...)");
  }
  if (validFiles.length > 0) {
    setImageFiles(prev => [...prev, ...validFiles]);
  }
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
                    onClick={() =>
                      setImageFiles((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="md:col-span-2 text-center mt-8">
          <button
            type="submit"
            className="bg-green-400 hover:bg-green-600 text-white font-semibold py-3 px-12 rounded-xl shadow-lg text-lg transition"
          >
             Thêm biến thể
          </button>
        </div>
      </form>
    </div>
  );
};

export default VariantAdd;

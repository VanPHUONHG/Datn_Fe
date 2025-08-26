import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { message, Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  getVariantById,
  updateVariant,
  getVariantsByProduct,
} from "services/variant/variant.service";
import { getAllProducts } from "services/product/product.service";
import type { Product } from "types/product";
import type { IProductVariant } from "types/variant";
import { getAttributes } from "services/attribute/attribute.service";

type VariantFormInput = Omit<
  IProductVariant,
  | "_id"
  | "created_at"
  | "updated_at"
  | "isDeleted"
  | "is_available"
  | "deletedAt"
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

  const [variant, setVariant] = useState<IProductVariant | null>(null);

  const [sizes, setSizes] = useState<{ _id: string; value: string }[]>([]);
  const [colors, setColors] = useState<{ _id: string; value: string }[]>([]);
  const [variantsByProduct, setVariantsByProduct] = useState<IProductVariant[]>([]);

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        // Lấy size
        const sizeData = await getAttributes("size");
        setSizes(sizeData);

        // Lấy color
        const colorData = await getAttributes("color");
        setColors(colorData);
      } catch (error) {
        console.error("Lỗi khi tải attributes:", error);
      }
    };

    fetchAttributes();
  }, []);

  const {
    register,
    handleSubmit,
    control,
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
        // Lấy biến thể cùng sản phẩm
        const res = await getVariantsByProduct({ product_id: variant.product_id._id || variant.product_id, limit: 100 });
        setVariantsByProduct(res.variants?.filter((v: IProductVariant) => v._id !== id) || []);
        const formData: VariantFormInput = {
          product_id:
            typeof variant.product_id === "object"
              ? variant.product_id._id
              : String(variant.product_id),
          size: variant.size?.value || "",
          color: variant.color?.value || "",
          image: variant.image,
          images: (variant.images || []).join(", "),
          sku: variant.sku,
          price: variant.price,
          discount_price: variant.discount_price ?? 0,
          stock_quantity: variant.stock_quantity,
        };

        reset(formData);
        setVariant(variant);
        setProducts(productRes.products || []);
      } catch (error: any) {
        console.error(
          "Lỗi khi tải dữ liệu:",
          error.response?.data || error.message
        );
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

      // ✅ Check: không cho trùng size trong cùng 1 màu của sản phẩm
      const duplicate = variantsByProduct.find((variant) => {
        const colorId = typeof variant.color === "string" ? variant.color : variant.color?._id;
        const sizeId = typeof variant.size === "string" ? variant.size : variant.size?._id;
        const productId = typeof variant.product_id === "string" ? variant.product_id : variant.product_id?._id;
        return (
          colorId === colors.find((c) => c.value === data.color)?._id &&
          sizeId === sizes.find((s) => s.value === data.size)?._id &&
          productId === data.product_id
        );
      });
      if (duplicate) {
        message.error("Biến thể này (cùng màu + cùng size) đã tồn tại cho sản phẩm này");
        return;
      }

      const updatedData = {
        ...data,
        size: sizes.find((s) => s.value === data.size)?._id, // lấy _id của size
        color: colors.find((c) => c.value === data.color)?._id, // lấy _id của color
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
      <h2 className="text-3xl font-bold mb-8 text-center">
        Chỉnh sửa biến thể
      </h2>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Sản phẩm */}
        <div>
          <label className="block font-semibold mb-1">Sản phẩm</label>
          <Controller
            name="product_id"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                showSearch
                placeholder="-- Chọn sản phẩm --"
                className="w-full"
                optionFilterProp="label"
                filterOption={(input, option) =>
                  (option?.label as string)
                    ?.toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={products.map((p) => ({ label: p.name, value: p._id }))}
              />
            )}
          />
          {errors.product_id && (
            <p className="text-red-500 text-sm mt-1">Vui lòng chọn sản phẩm</p>
          )}
        </div>

        {/* Size */}
        <div>
          <label className="block font-semibold mb-1">Size</label>
          <select
            {...register("size", { required: true })}
            className="w-full border rounded p-2"
          >
            <option value="">-- Chọn size --</option>
            {sizes.map((size) => (
              <option key={size._id} value={size.value}>
                {size.value}
              </option>
            ))}
          </select>

          {errors.size && (
            <p className="text-red-500 text-sm">Không được để trống</p>
          )}
        </div>

        {/* Màu */}
        <div>
          <label className="block font-semibold mb-1">Màu sắc</label>
          <select
            {...register("color", { required: true })}
            className="w-full border rounded p-2"
          >
            <option value="">-- Chọn màu --</option>
            {colors.map((color) => (
              <option key={color._id} value={color.value}>
                {color.value}
              </option>
            ))}
          </select>
          {errors.color && (
            <p className="text-red-500 text-sm">Không được để trống</p>
          )}
        </div>

        {/* Ảnh chính */}
        <div>
          <label className="block font-semibold mb-1">Ảnh đại diện</label>
          <input
            {...register("image", { required: true })}
            className="w-full border rounded p-2"
          />
          {errors.image && (
            <p className="text-red-500 text-sm">Không được để trống</p>
          )}
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
          {variant?.image && !thumbnailFile && (
            <div className="mt-2">
              <img
                src={variant.image}
                alt="Ảnh đại diện hiện tại"
                className="w-24 h-24 object-cover border rounded"
              />
            </div>
          )}
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
          <label className="block font-semibold mb-1">
            Danh sách ảnh (phân cách bằng dấu phẩy)
          </label>
          <textarea
            {...register("images")}
            className="w-full border rounded p-2 h-24 resize-none"
          />
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              const validImages = files.filter((file) =>
                file.type.startsWith("image/")
              );

              if (validImages.length < files.length) {
                message.warning(
                  "Chỉ được phép tải lên file ảnh (jpg, png, webp...)"
                );
              }

              setImageFiles((prev) => [...prev, ...validImages]);
            }}
          />
          {variant?.images && imageFiles.length === 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {variant.images.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Ảnh phụ ${idx + 1}`}
                  className="w-20 h-20 object-cover border rounded"
                />
              ))}
            </div>
          )}
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
          <input
            {...register("sku", { required: true })}
            className="w-full border rounded p-2"
          />
          {errors.sku && (
            <p className="text-red-500 text-sm">Không được để trống</p>
          )}
        </div>

        {/* Giá gốc */}
        <div>
          <label className="block font-semibold mb-1">Giá gốc</label>
          <input
            {...register("price", {
              required: true,
              valueAsNumber: true,
              min: 0,
            })}
            type="number"
            className="w-full border rounded p-2"
          />
          {errors.price && (
            <p className="text-red-500 text-sm">Giá không hợp lệ</p>
          )}
        </div>

        {/* Giá KM */}
        <div>
          <label className="block font-semibold mb-1">Giá khuyến mãi</label>
          <input
            {...register("discount_price", {
              valueAsNumber: true,
              validate: (val) =>
                val === undefined ||
                val < getValues("price") ||
                "Giá KM phải nhỏ hơn giá gốc",
            })}
            type="number"
            className="w-full border rounded p-2"
          />
          {errors.discount_price && (
            <p className="text-red-500 text-sm">
              {errors.discount_price.message}
            </p>
          )}
        </div>

        {/* Tồn kho */}
        <div>
          <label className="block font-semibold mb-1">Tồn kho</label>
          <input
            {...register("stock_quantity", {
              required: true,
              valueAsNumber: true,
              min: 0,
            })}
            type="number"
            className="w-full border rounded p-2"
          />
          {errors.stock_quantity && (
            <p className="text-red-500 text-sm">Không được để trống</p>
          )}
        </div>

        {/* Nút submit */}
        <div className="md:col-span-2 text-center mt-4">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded"
          >
            Cập nhật biến thể
          </button>
        </div>
      </form>
    </div>
  );
};

export default VariantEdit;

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import type { Product } from "types/product";
import type { Category } from "types/category";
import { useEffect, useState } from "react";
import { getAllCategories } from "services/category/category.service";
import { createProduct } from "services/product/product.service";
import { message } from "antd";

type ProductFormInput = Omit<Product, "images"> & {
  images: string;
  brand: string;
};

const ProductAdd = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrlsInput, setImageUrlsInput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ProductFormInput>();

  const nav = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categories = await getAllCategories();
        setCategories(categories);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategory();
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

  const onSubmit = async (formData: ProductFormInput) => {
    try {
      let images: string[] = [];

      if (imageFiles.length > 0) {
        images = await Promise.all(imageFiles.map(uploadImage));
      } else if (imageUrlsInput.trim()) {
        images = imageUrlsInput
          .split(",")
          .map((url) => url.trim())
          .filter((url) => url.startsWith("http"));
      } else {
        message.error("Vui lòng nhập hoặc tải lên ít nhất một ảnh sản phẩm.");
        return;
      }

      const productData: Product = {
        ...formData,
        images,
      };

      await createProduct(productData);
      message.success("Thêm mới thành công");
      nav("/admin/product-list");
    } catch (error: any) {
      if (error?.response?.status === 409) {
        message.error(error.response.data.message || "Tên sản phẩm đã tồn tại");
      } else {
        console.log(error);
        message.error("Thêm sản phẩm thất bại");
      }
    }
  };

return (
  <div className="max-w-6xl mx-auto p-10 bg-white rounded-2xl shadow-xl border border-gray-100">
    <h2 className="text-3xl font-bold mb-10 text-center text-gray-800 flex items-center justify-center gap-3">
      Thêm sản phẩm mới
    </h2>

    <form
      className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Tên sản phẩm */}
      <div>
        <label className="block font-medium text-gray-700 mb-2">
          Tên sản phẩm <span className="text-red-500">*</span>
        </label>
        <input
          {...register("name", { required: true })}
          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
          placeholder="Nhập tên sản phẩm"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">Không được để trống</p>
        )}
      </div>

      {/* URL + Upload ảnh */}
      <div>
        <label className="block font-medium text-gray-700 mb-2">
          URL hình ảnh (ngăn cách dấu phẩy)
        </label>
        <input
          value={imageUrlsInput}
          onChange={(e) => setImageUrlsInput(e.target.value)}
          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
          placeholder="https://..., https://..."
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
              message.warning("Chỉ được phép tải file ảnh (jpg, png, webp...)");
            }
            setImageFiles((prev) => [...prev, ...validImages]);
          }}
          className="mt-3 text-sm text-gray-600"
        />

        {imageFiles.length > 0 && (
          <div className="grid grid-cols-4 gap-3 mt-4">
            {imageFiles.map((file, idx) => (
              <div
                key={idx}
                className="relative group rounded-xl overflow-hidden shadow-md"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Ảnh ${idx}`}
                  className="w-full h-24 object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...imageFiles];
                    updated.splice(idx, 1);
                    setImageFiles(updated);
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
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
        <label className="block font-medium text-gray-700 mb-2">
          Giá gốc (VNĐ)
        </label>
        <input
          {...register("price", {
            required: true,
            valueAsNumber: true,
            min: { value: 0, message: "Giá không được âm" },
          })}
          type="number"
          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
        />
        {errors.price && (
          <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
        )}
      </div>

      {/* Giá KM */}
      <div>
        <label className="block font-medium text-gray-700 mb-2">
          Giá khuyến mãi (VNĐ)
        </label>
        <input
          {...register("discount_price", {
            required: true,
            valueAsNumber: true,
            validate: (value) =>
              value < getValues("price") ||
              "Giá khuyến mãi phải nhỏ hơn giá gốc",
          })}
          type="number"
          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
        />
        {errors.discount_price && (
          <p className="text-red-500 text-xs mt-1">
            {errors.discount_price.message}
          </p>
        )}
      </div>

      {/* Xuất xứ */}
      <div>
        <label className="block font-medium text-gray-700 mb-2">
          Xuất xứ
        </label>
        <input
          {...register("origin", { required: true })}
          placeholder="VD: Việt Nam"
          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
        />
        {errors.origin && (
          <p className="text-red-500 text-xs mt-1">Không được để trống</p>
        )}
      </div>

      {/* Thương hiệu */}
      <div>
        <label className="block font-medium text-gray-700 mb-2">
          Thương hiệu
        </label>
        <input
          {...register("brand", { required: true })}
          placeholder="Nike, Adidas..."
          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
        />
        {errors.brand && (
          <p className="text-red-500 text-xs mt-1">Không được để trống</p>
        )}
      </div>

      {/* Danh mục */}
      <div>
        <label className="block font-medium text-gray-700 mb-2">
          Danh mục
        </label>
        <select
          {...register("category_id", { required: true })}
          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
        >
          <option value="">-- Chọn danh mục --</option>
          {categories.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>
        {errors.category_id && (
          <p className="text-red-500 text-xs mt-1">Phải chọn danh mục</p>
        )}
      </div>

      {/* Mô tả */}
      <div className="md:col-span-2">
        <label className="block font-medium text-gray-700 mb-2">
          Mô tả sản phẩm
        </label>
        <textarea
          {...register("description", { required: true })}
          placeholder="Mô tả chi tiết sản phẩm..."
          className="w-full border border-gray-300 rounded-xl p-3 h-28 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">Không được để trống</p>
        )}
      </div>

      {/* Submit */}
      <div className="md:col-span-2 text-center mt-4">
        <button
          type="submit"
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-12 rounded-xl shadow-lg transition-all"
        >
           Thêm sản phẩm
        </button>
      </div>
    </form>
  </div>
);

};

export default ProductAdd;

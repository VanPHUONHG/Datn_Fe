import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import type { Product } from "types/product";
import type { Category } from "types/category";
import { useEffect, useState } from "react";
import { getProductById, updateProduct } from "services/product/product.service";
import { getAllCategories } from "services/category/category.service";
import { message } from "antd";


type ProductFormInput = Omit<Product, "images" | "category_id"> & {
  images: string;
  category_id: string;
};

const ProductEdit = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    getValues
  } = useForm<ProductFormInput>();
  const nav = useNavigate();
  const params = useParams()
  const [imageFiles, setImageFiles] = useState<File[]>([]);
const [imageUrlsInput, setImageUrlsInput] = useState("");
  useEffect(() => {
    const getProducts = async () => {
      if (!params.id) return;
      try {
        const product = await getProductById(params.id);
        reset({
          ...product,
          images: product.images.join(", "),
          category_id: product.category_id?._id || "",
        });
        setImageUrlsInput(product.images.join(", "));

      } catch (error) {
        console.log(error);
      }
    };
    getProducts();
  }, [params.id, reset]);

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
      message.error("Vui lòng nhập hoặc tải lên ít nhất một ảnh.");
      return;
    }

    const productData: Partial<Product> = {
      ...formData,
      images,
      category_id: { _id: formData.category_id } as any,
      updatedAt: new Date().toISOString(),
    };

    await updateProduct(params.id as string, productData);
    message.success("Cập nhật thành công");
    nav("/admin/product-list");
  } catch (error) {
    console.log(error);
    message.error("Cập nhật thất bại");
  }
};



  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold mb-8 text-center">Cập nhật sản phẩm</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block font-semibold mb-1">Tên sản phẩm</label>
          <input {...register("name", { required: true })} className="w-full border rounded p-2 focus:outline-none focus:ring" placeholder="Tên sản phẩm" />
          {errors.name && <p className="text-red-500 text-sm">Tên không được để trống</p>}
        </div>

      <div>
        
  <label className="block font-semibold mb-1">Hình ảnh (URL hoặc upload)</label>
  <input
    className="w-full border rounded p-2"
    placeholder="https://..., https://..."
    value={imageUrlsInput}
    onChange={(e) => setImageUrlsInput(e.target.value)}
  />
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
    className="mt-2"
  />
  {imageFiles.length > 0 && (
    <div className="flex gap-2 mt-2 flex-wrap">
      {imageFiles.map((file, idx) => (
        <div key={idx} className="relative">
          <img src={URL.createObjectURL(file)} alt={`Ảnh ${idx}`} className="w-20 h-20 object-cover border rounded" />
          <button
            type="button"
            onClick={() => {
              const updated = [...imageFiles];
              updated.splice(idx, 1);
              setImageFiles(updated);
            }}
            className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center transform translate-x-1/2 -translate-y-1/2 hover:bg-red-800"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )}
</div>


        <div>
          <label className="block font-semibold mb-1">Giá gốc (VNĐ)</label>
          <input {...register("price", { required: true, valueAsNumber: true, min: { value: 0, message: "Giá kho ko âm" } })} type="number" className="w-full border rounded p-2 focus:outline-none focus:ring" placeholder="100000" />
          {errors.price && <p className="text-red-500 text-sm">Không được để trống</p>}
        </div>

        <div>
          <label className="block font-semibold mb-1">Giá khuyến mãi (VNĐ)</label>
          <input {...register("discount_price", { required: true, valueAsNumber: true, validate: (value) => value < getValues("price") || "Giá khuyến mãi phải nhỏ hơn giá gốc" })} type="number" className="w-full border rounded p-2 focus:outline-none focus:ring" placeholder="90000" />
          {errors.discount_price && <p className="text-red-500 text-sm">Giá khuyến mãi phải nhỏ hơn giá gốc</p>}
        </div>



        <div>
          <label className="block font-semibold mb-1">Xuất xứ</label>
          <input {...register("origin", { required: true })} className="w-full border rounded p-2 focus:outline-none focus:ring" placeholder="Việt Nam"
          />
          {errors.origin && <p className="text-red-500 text-sm">Không được để trống</p>}
        </div>

        <div>
          <label className="block font-semibold mb-1">Thương hiệu</label>
          <input
            {...register("brand", { required: true })}
            className="w-full border rounded p-2 focus:outline-none focus:ring"
            placeholder="VD: Nike, Adidas..."
          />
          {errors.brand && <p className="text-red-500 text-sm">Không được để trống</p>}
        </div>
        <div>
          <label className="block font-semibold mb-1">Danh mục</label>
          <select {...register("category_id", { required: true })} className="w-full border rounded p-2 focus:outline-none focus:ring">
            <option value="">-- Chọn danh mục --</option>
            {categories.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
          {errors.category_id && <p className="text-red-500 text-sm">Phải chọn danh mục</p>}
        </div>


        <div className="md:col-span-2">
          <label className="block font-semibold mb-1">Mô tả sản phẩm</label>
          <textarea {...register("description", { required: true })} className="w-full border rounded p-2 h-24 focus:outline-none focus:ring" placeholder="Mô tả chi tiết sản phẩm..." />
          {errors.description && <p className="text-red-500 text-sm">Không được để trống</p>}
        </div>

        <div className="md:col-span-2 text-center mt-4">
          <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded">
            Cập nhật
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;

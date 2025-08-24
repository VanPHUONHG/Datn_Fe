import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCategories, getProductsByCategory } from "services/category/category.service";
import { getAllVariantsByProductId } from "services/productVariant/productVariant.service";
import type { ICategory } from "types/category";
import type { Product } from "types/product";
import {
  SlidersHorizontal,
  Palette,
  Ruler,
  Tag,
  BadgeDollarSign,
} from "lucide-react";

const COLORS = ["Đen", "Trắng", "Xanh", "Đỏ", "Nâu", "Hồng"];
const SIZES = ["38", "39", "40", "41", "42"];
const BRANDS = ["Nike", "Adidas", "Puma", "Converse", "Vans", "Reebok"];

const ProductInCategory = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");

  // Bộ lọc
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) return;

    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const allProducts = await getProductsByCategory(categoryId);
        const filtered: Product[] = [];

        for (const product of allProducts) {
          if (selectedBrand && product.brand !== selectedBrand) continue;

          const variants = await getAllVariantsByProductId(product._id);
          const matchVariant = variants.find((variant) => {
            const matchColor = selectedColor ? variant.color === selectedColor : true;
            const matchSize = selectedSize ? variant.size === selectedSize : true;
            const finalPrice = variant.discount_price ?? variant.price;
            const matchPrice = priceRange
              ? finalPrice >= priceRange[0] && finalPrice <= priceRange[1]
              : true;
            return matchColor && matchSize && matchPrice;
          });

          if (matchVariant) filtered.push(product);
        }

        // sort sản phẩm mới nhất lên trên
        const sorted = filtered.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setProducts(sorted);
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [categoryId, selectedColor, selectedSize, priceRange, selectedBrand]);

  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        const categories = await getCategories();
        const matchedCategory = categories.find(
          (cat: ICategory) => cat._id === categoryId
        );
        if (matchedCategory) setCategoryName(matchedCategory.name);
      } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
      }
    };
    if (categoryId) fetchCategoryName();
  }, [categoryId]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 px-6 py-8 max-w-7xl mx-auto">
      {/* Sidebar Filter */}
      <aside className="w-full lg:w-67 bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-8 h-fit">
        <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800 border-b pb-2">
          <SlidersHorizontal size={18} className="text-green-600" />
          Bộ lọc sản phẩm
        </h2>

        {/* Giá */}
        <div>
          <h3 className="flex items-center gap-2 font-semibold text-gray-700 mb-3">
            <BadgeDollarSign size={18} className="text-green-600" />
            Giá
          </h3>
          <div className="space-y-3">
            {[
              { label: "Dưới 1 triệu", range: [0, 1000000] },
              { label: "1 - 2 triệu", range: [1000000, 2000000] },
              { label: "2 - 4 triệu", range: [2000000, 4000000] },
              { label: "Trên 4 triệu", range: [4000000, 100000000] },
            ].map(({ label, range }) => (
              <label
                key={label}
                className={`flex items-center gap-2 border rounded-xl px-3 py-2 cursor-pointer transition-all duration-200
                  ${
                    priceRange?.[0] === range[0] && priceRange?.[1] === range[1]
                      ? "border-green-500 bg-green-50 font-medium"
                      : "hover:border-green-400"
                  }`}
              >
                <input
                  type="checkbox"
                  checked={priceRange?.[0] === range[0] && priceRange?.[1] === range[1]}
                  onChange={() =>
                    setPriceRange(
                      priceRange?.[0] === range[0] && priceRange?.[1] === range[1]
                        ? null
                        : range
                    )
                  }
                  className="accent-green-600"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Size */}
        <div>
          <h3 className="flex items-center gap-2 font-semibold text-gray-700 mb-3">
            <Ruler size={18} className="text-green-600" />
            Size
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {SIZES.map((size) => (
              <label
                key={size}
                className={`flex items-center justify-center border rounded-xl px-3 py-2 cursor-pointer transition-all duration-200
                  ${
                    selectedSize === size
                      ? "border-green-500 bg-green-50 font-medium"
                      : "hover:border-green-400"
                  }`}
              >
                <input
                  type="checkbox"
                  checked={selectedSize === size}
                  onChange={() => setSelectedSize(selectedSize === size ? null : size)}
                  className="accent-green-600 hidden"
                />
                {size}
              </label>
            ))}
          </div>
        </div>

        {/* Màu sắc */}
        <div>
          <h3 className="flex items-center gap-2 font-semibold text-gray-700 mb-3">
            <Palette size={18} className="text-green-600" />
            Màu sắc
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {COLORS.map((color) => (
              <label
                key={color}
                className={`flex items-center gap-2 border rounded-xl px-3 py-2 cursor-pointer transition-all duration-200
                  ${
                    selectedColor === color
                      ? "border-green-500 bg-green-50 font-medium"
                      : "hover:border-green-400"
                  }`}
              >
                <input
                  type="checkbox"
                  checked={selectedColor === color}
                  onChange={() =>
                    setSelectedColor(selectedColor === color ? null : color)
                  }
                  className="accent-green-600"
                />
                {color}
              </label>
            ))}
          </div>
        </div>

        {/* Thương hiệu */}
        <div>
          <h3 className="flex items-center gap-2 font-semibold text-gray-700 mb-3">
            <Tag size={18} className="text-green-600" />
            Thương hiệu
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {BRANDS.map((brand) => (
              <label
                key={brand}
                className={`flex items-center gap-2 border rounded-xl px-3 py-2 cursor-pointer transition-all duration-200
                  ${
                    selectedBrand === brand
                      ? "border-green-500 bg-green-50 font-medium"
                      : "hover:border-green-400"
                  }`}
              >
                <input
                  type="checkbox"
                  checked={selectedBrand === brand}
                  onChange={() =>
                    setSelectedBrand(selectedBrand === brand ? null : brand)
                  }
                  className="accent-green-600"
                />
                {brand}
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* Product List */}
      <main className="flex-1">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">Không có sản phẩm nào.</p>
        ) : (
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <Link
                to={`/product/${product._id}`}
                key={product._id}
                className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg
                transition-all duration-300 hover:scale-[1.02] p-5 flex flex-col items-center text-center"
              >
                <div className="w-full h-48 flex items-center justify-center overflow-hidden rounded-xl bg-gray-50 mb-4">
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="object-contain h-full transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <h2 className="text-base font-semibold text-gray-800 truncate w-full">
                  {product.name}
                </h2>
                <div className="text-sm text-gray-500">{product.origin}</div>
                <div className="flex gap-2 items-center mt-2">
                  <span className="bg-red-100 text-red-600 font-bold text-sm px-2 py-1 rounded-lg">
                    {product.discount_price.toLocaleString()}₫
                  </span>
                  <span className="text-gray-400 line-through text-sm">
                    {product.price.toLocaleString()}₫
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductInCategory;

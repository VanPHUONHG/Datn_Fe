import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "interface/product";
import { getAll } from "services/allProduct/allProduct.service";
import {
  SlidersHorizontal,
  Palette,
  Ruler,
  Tag,
  BadgeDollarSign,
} from "lucide-react";

const COLORS = [
  { value: "Đen", label: "Đen" },
  { value: "Trắng", label: "Trắng" },
  { value: "Xanh", label: "Xanh" },
  { value: "Đỏ", label: "Đỏ" },
  { value: "Nâu", label: "Nâu" },
  { value: "Hồng", label: "Hồng" },
];

function AllProducts() {
  const [data, setData] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<
    [number, number] | null
  >(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const handleToggle = (
    selected: string | null,
    value: string,
    setFn: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    setFn(selected === value ? null : value);
  };

  const handlePriceChange = (min: number, max: number) => {
    setSelectedPriceRange(
      selectedPriceRange?.[0] === min && selectedPriceRange?.[1] === max
        ? null
        : [min, max]
    );
  };

  const buildQueryString = () => {
    const params = new URLSearchParams();
    if (selectedSize) params.append("size", selectedSize);
    if (selectedColor) params.append("color", selectedColor);
    if (selectedBrand) params.append("brand", selectedBrand);
    if (selectedPriceRange) {
      params.append("minPrice", selectedPriceRange[0].toString());
      params.append("maxPrice", selectedPriceRange[1].toString());
    }
    return params.toString();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = buildQueryString();
        const result = await getAll(query);

        // sort sản phẩm mới nhất lên trên
        const sorted = result.sort(
          (a: Product, b: Product) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setData(sorted);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSize, selectedPriceRange, selectedColor, selectedBrand]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
      </div>
    );

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
              { label: "Dưới 1 triệu", min: 0, max: 1000000 },
              { label: "1 - 2 triệu", min: 1000000, max: 2000000 },
              { label: "2 - 4 triệu", min: 2000000, max: 4000000 },
              { label: "Trên 4 triệu", min: 4000000, max: 100000000 },
            ].map((range, index) => (
              <label
                key={index}
                className={`flex items-center gap-2 border rounded-xl px-3 py-2 cursor-pointer 
                transition-all duration-200 
                ${
                  selectedPriceRange?.[0] === range.min &&
                  selectedPriceRange?.[1] === range.max
                    ? "border-green-500 bg-green-50 font-medium"
                    : "hover:border-green-400"
                }`}
              >
                <input
                  type="checkbox"
                  className="accent-green-600"
                  checked={
                    selectedPriceRange?.[0] === range.min &&
                    selectedPriceRange?.[1] === range.max
                  }
                  onChange={() => handlePriceChange(range.min, range.max)}
                />
                {range.label}
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
            {["38", "39", "40", "41", "42"].map((size) => (
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
                  className="accent-green-600 hidden"
                  checked={selectedSize === size}
                  onChange={() => handleToggle(selectedSize, size, setSelectedSize)}
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
                key={color.value}
                className={`flex items-center gap-2 border rounded-xl px-3 py-2 cursor-pointer transition-all duration-200 
                ${
                  selectedColor === color.value
                    ? "border-green-500 bg-green-50 font-medium"
                    : "hover:border-green-400"
                }`}
              >
                <input
                  type="checkbox"
                  className="accent-green-600"
                  checked={selectedColor === color.value}
                  onChange={() =>
                    handleToggle(selectedColor, color.value, setSelectedColor)
                  }
                />
                {color.label}
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
            {["Nike", "Adidas", "Puma", "Converse", "Vans", "Reebok"].map(
              (brand) => (
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
                    className="accent-green-600"
                    checked={selectedBrand === brand}
                    onChange={() =>
                      handleToggle(selectedBrand, brand, setSelectedBrand)
                    }
                  />
                  {brand}
                </label>
              )
            )}
          </div>
        </div>
      </aside>

      {/* Product List */}
      <main className="flex-1">
        {data && data.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data.map((product) => (
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
        ) : (
          <p className="text-center text-gray-500 text-lg">
            Không có sản phẩm nào.
          </p>
        )}
      </main>
    </div>
  );
}

export default AllProducts;

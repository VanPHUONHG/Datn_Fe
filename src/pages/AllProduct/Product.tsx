import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from 'interface/product';
import { getAll } from 'services/allProduct/allProduct.service';

const COLORS = [
  { value: 'Đen', label: 'Đen' },
  { value: 'Trắng', label: 'Trắng' },
  { value: 'Xanh', label: 'Xanh' },
  { value: 'Đỏ', label: 'Đỏ' },
  { value: 'Nâu', label: 'Nâu' },
];

function AllProducts() {
  const [data, setData] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number] | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [showSizeFilter, setShowSizeFilter] = useState(false);
  const [showColorFilter, setShowColorFilter] = useState(false);
  const [showBrandFilter, setShowBrandFilter] = useState(false);

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
    if (selectedSize) params.append('size', selectedSize);
    if (selectedColor) params.append('color', selectedColor);
    if (selectedBrand) params.append('brand', selectedBrand);
    if (selectedPriceRange) {
      params.append('minPrice', selectedPriceRange[0].toString());
      params.append('maxPrice', selectedPriceRange[1].toString());
    }
    return params.toString();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = buildQueryString();
        const result = await getAll(query);
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSize, selectedPriceRange, selectedColor, selectedBrand]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex gap-6">
       <div className="w-64 p-4 bg-white rounded-lg shadow space-y-6 border border-gray-200">

    <div>
      <h3
        className="font-semibold mb-2 cursor-pointer flex justify-between items-center"
        onClick={() => setShowPriceFilter(!showPriceFilter)}
      >
       Giá
        <span>{showPriceFilter ? '▲' : '▼'}</span>
      </h3>
      {showPriceFilter && (
        <div className="space-y-2 pl-1">
          {[
            { label: '100,000₫ - 1,000,000₫', min: 100000, max: 1000000 },
            { label: '1,000,000₫ - 2,000,000₫', min: 1000000, max: 2000000 },
            { label: '2,000,000₫ - 4,000,000₫', min: 2000000, max: 4000000 },
            { label: 'Trên 4,000,000₫', min: 4000000, max: 1000000000 },
          ].map((range, index) => (
            <label key={index} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
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
      )}
    </div>

    <div>
      <h3
        className="font-semibold mb-2 cursor-pointer flex justify-between items-center"
        onClick={() => setShowSizeFilter(!showSizeFilter)}
      >
        Size
        <span>{showSizeFilter ? '▲' : '▼'}</span>
      </h3>
      {showSizeFilter && (
        <div className="space-y-2 pl-1">
          {['38', '39', '40', '41', '42'].map((size) => (
            <label key={size} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedSize === size}
                onChange={() => handleToggle(selectedSize, size, setSelectedSize)}
              />
              {size}
            </label>
          ))}
        </div>
      )}
    </div>


    <div>
      <h3
        className="font-semibold mb-2 cursor-pointer flex justify-between items-center"
        onClick={() => setShowColorFilter(!showColorFilter)}
      >
        Màu sắc
        <span>{showColorFilter ? '▲' : '▼'}</span>
      </h3>
      {showColorFilter && (
        <div className="space-y-2 pl-1">
          {COLORS.map((color) => (
            <label key={color.value} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedColor === color.value}
                onChange={() => handleToggle(selectedColor, color.value, setSelectedColor)}
              />
              {color.label}
            </label>
          ))}
        </div>
      )}
    </div>

    <div>
      <h3
        className="font-semibold mb-2 cursor-pointer flex justify-between items-center"
        onClick={() => setShowBrandFilter(!showBrandFilter)}
      >
        Thương hiệu
        <span>{showBrandFilter ? '▲' : '▼'}</span>
      </h3>
      {showBrandFilter && (
        <div className="space-y-2 pl-1">
          {['Nike', 'Adidas', 'Puma', 'Converse','Vans','Reebok'].map((brand) => (
            <label key={brand} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedBrand === brand}
                onChange={() => handleToggle(selectedBrand, brand, setSelectedBrand)}
              />
              {brand}
            </label>
          ))}
        </div>
      )}
    </div>
  </div>

    {/* list sản phẩm */}
      <div className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data?.map((product) => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              className="border border-gray-200 rounded-md p-3 flex flex-col items-center text-center shadow hover:shadow-lg transition hover:scale-105"
            >
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md"
              />
              <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
              <div className="text-sm text-gray-500">{product.origin}</div>
              <div className="flex gap-2 items-center mt-1">
                <div className="text-red-600 font-bold">
                  {product.discount_price.toLocaleString()}₫
                </div>
                <div className="text-gray-400 line-through text-sm">
                  {product.price.toLocaleString()}₫
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AllProducts;

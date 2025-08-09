import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCategories, getProductsByCategory } from 'services/category/category.service';
import { getAllVariantsByProductId } from 'services/productVariant/productVariant.service';
import type { ICategory } from 'types/category';
import type { Product } from 'types/product';

const ProductInCategory = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [tempProducts, setTempProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);

  // Bộ lọc
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) return;

    const fetchFilteredProducts = async () => {
      setLoading(true);
      setShowAnimation(false);

      try {
        const allProducts = await getProductsByCategory(categoryId);


        //Lọc
        const filteredProducts: Product[] = [];

        for (const product of allProducts) {
            if (selectedBrand && product.brand !== selectedBrand) continue;

          const variants = await getAllVariantsByProductId(product._id);
          const matchVariant = variants.find((variant) => {
            const matchColor = selectedColor ? variant.color === selectedColor : true;
            const matchSize = selectedSize ? variant.size === selectedSize : true;
const finalPrice = variant.discount_price ?? variant.price;
const matchPrice = finalPrice >= priceRange[0] && finalPrice <= priceRange[1];
            return matchColor && matchSize && matchPrice;
          });

          if (matchVariant) {
            filteredProducts.push(product);
          }
        }

        setTimeout(() => {
          setTempProducts(filteredProducts);
        }, 100);
      } catch (error) {
        console.error('Lỗi tải sản phẩm hoặc biến thể:', error);
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [categoryId, selectedColor, selectedSize, priceRange, selectedBrand]);

  useEffect(() => {
    if (tempProducts !== null) {
      setProducts(tempProducts);
      setLoading(false);
      setShowAnimation(true);
      setTempProducts(null);
    }
  }, [tempProducts]);

  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        const categories = await getCategories();
        const matchedCategory = categories.find(
          (cat: ICategory) => cat._id === categoryId
        );
        if (matchedCategory) {
          setCategoryName(matchedCategory.name);
        }
      } catch (error) {
        console.error('Lỗi lấy danh mục:', error);
      }
    };

    if (categoryId) {
      fetchCategoryName();
    }
  }, [categoryId]);

  const isLoading = loading && products.length === 0;

  return (
 <div className="max-w-7xl mx-auto px-4 py-10">
  <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
    Sản phẩm theo danh mục{' '}
    {categoryName && <span className="text-blue-600">"{categoryName}"</span>}
  </h2>

<div className="flex flex-col-reverse lg:grid lg:grid-cols-[250px_1fr] gap-8">

  <div className="border rounded-2xl p-6 bg-white shadow-lg space-y-8">
  {/* Màu sắc */}
  <div>
    <h4 className="font-bold text-lg text-gray-800 mb-3">Màu sắc</h4>
    <div className="grid grid-cols-2 gap-2">
      {['Đen', 'Trắng', 'Xanh', 'Đỏ', 'Nâu', 'Hồng'].map((color) => (
        <label
          key={color}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition border 
            ${selectedColor === color ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-100 border-gray-300'}`}
        >
          <input
            type="checkbox"
            checked={selectedColor === color}
            onChange={() =>
              setSelectedColor((prev) => (prev === color ? null : color))
            }
            className="accent-blue-600 w-4 h-4"
          />
          <span className="text-sm text-gray-700">{color}</span>
        </label>
      ))}
    </div>
  </div>

  {/* Size */}
  <div>
    <h4 className="font-bold text-lg text-gray-800 mb-3">Size</h4>
    <div className="grid grid-cols-3 gap-2">
      {['38', '39', '40', '41', '42'].map((size) => (
        <label
          key={size}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition border 
            ${selectedSize === size ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-100 border-gray-300'}`}
        >
          <input
            type="checkbox"
            checked={selectedSize === size}
            onChange={() =>
              setSelectedSize((prev) => (prev === size ? null : size))
            }
            className="accent-blue-600 w-4 h-4"
          />
          <span className="text-sm text-gray-700">{size}</span>
        </label>
      ))}
    </div>
  </div>

  {/* Giá */}
  <div>
    <h4 className="font-bold text-lg text-gray-800 mb-3">Giá</h4>
    <div className="space-y-2">
      {[
        { label: 'Dưới 1 triệu', range: [0, 1000000] },
        { label: '1 - 2 triệu', range: [1000000, 2000000] },
        { label: '2 - 3 triệu', range: [2000000, 3000000] },
        { label: 'Trên 3 triệu', range: [3000000, 10000000] }
      ].map(({ label, range }) => (
        <label
          key={label}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition border 
            ${priceRange[0] === range[0] && priceRange[1] === range[1]
              ? 'bg-blue-100 border-blue-500'
              : 'hover:bg-gray-100 border-gray-300'}`}
        >
          <input
            type="checkbox"
            checked={priceRange[0] === range[0] && priceRange[1] === range[1]}
            onChange={() =>
              setPriceRange((prev) =>
                prev[0] === range[0] && prev[1] === range[1]
                  ? [0, 10000000]
                  : range
              )
            }
            className="accent-blue-600 w-4 h-4"
          />
          <span className="text-sm text-gray-700">{label}</span>
        </label>
      ))}
    </div>
  </div>

  {/* Thương hiệu */}
  <div>
    <h4 className="font-bold text-lg text-gray-800 mb-3">Thương hiệu</h4>
    <div className="grid grid-cols-2 gap-2">
      {['Nike', 'Adidas', 'Converse', 'Puma', 'Vans'].map((brand) => (
        <label
          key={brand}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition border 
            ${selectedBrand === brand ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-100 border-gray-300'}`}
        >
          <input
            type="checkbox"
            checked={selectedBrand === brand}
            onChange={() =>
              setSelectedBrand((prev) => (prev === brand ? null : brand))
            }
            className="accent-blue-600 w-4 h-4"
          />
          <span className="text-sm text-gray-700">{brand}</span>
        </label>
      ))}
    </div>
  </div>
</div>


    {/* Danh sách sản phẩm */}
    <div>
      {isLoading ? (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow p-4 animate-pulse h-[300px] flex flex-col justify-between"
            >
              <div className="bg-gray-200 h-40 w-full rounded mb-4" />
              <div className="bg-gray-200 h-4 w-3/4 rounded mb-2" />
              <div className="bg-gray-200 h-4 w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-red-500 text-lg font-medium">
          Không có sản phẩm nào.
        </p>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product, index) => (
            <div
              key={product._id}
              className={`transition-all duration-500 transform ${
                showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <Link
                to={`/product/${product._id}`}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 hover:scale-[1.03] p-4 flex flex-col items-center text-center"
              >
                <div className="w-full h-48 flex items-center justify-center overflow-hidden rounded-lg bg-gray-50 mb-4">
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    loading="lazy"
                    className="object-contain h-full transition duration-300 hover:scale-105"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 truncate w-full">
                  {product.name}
                </h3>
                <div className="text-sm text-gray-500">{product.origin}</div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className="text-red-600 font-bold text-lg">
                    {product.discount_price.toLocaleString()}₫
                  </div>
                  <div className="text-gray-400 line-through text-sm">
                    {product.price.toLocaleString()}₫
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
</div>

  );
};

export default ProductInCategory;

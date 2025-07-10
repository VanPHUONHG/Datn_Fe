import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import type { Product } from "types/product";
import { getAllProducts } from "services/product/product.service";
import type { IProductVariant } from "types/productVariant";
import { getAllVariantsByProductId } from "services/productVariant/productVariant.service";
import { toast } from "react-toastify";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { addToCart, type CartPayload } from "services/cart/cart.service";
import type { IUser } from "types/user";
import type { ICartItem } from "types/cart";
import ProductReviewSection from "./ProductReviewSection";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<IProductVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<IProductVariant | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [currentImage, setCurrentImage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [variantImages, setVariantImages] = useState<string[]>([]);
  const [previewVariant, setPreviewVariant] = useState<IProductVariant | null>(null);
  const displayedVariant = selectedVariant || previewVariant;
  const errorToastId = "add-to-cart-error";  //Báo lỗi toast khi giỏ hàng đã vượt quá giới hạn tồn kho

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        // ✅ Reset các state liên quan đến sản phẩm cũ
        setSelectedVariant(null);
        setSelectedColor("");
        setVariantImages([]);
        setQuantity(1);
        setPreviewVariant(null);
        const res = await axios.get(`http://localhost:8888/api/products/${id}`);
        setProduct(res.data);
        setCurrentImage(res.data.images?.[0] || "");
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchVariants = async () => {
      try {
        if (id) {
          const data = await getAllVariantsByProductId(id);
          setVariants(data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy biến thể:", error);
      }
    };

    fetchProductDetail();
    fetchVariants();
  }, [id]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const result = await getAllProducts();
        setRelatedProducts(result.slice(0, 4));
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };

    fetchRelatedProducts();
  }, []);

  const handleIncrease = () => {
    if (!selectedVariant) {
      const toastId = "must-select-size";
      if (!toast.isActive(toastId)) {
        toast.error(
          selectedColor
            ? "Vui lòng chọn kích cỡ trước khi tắng số lượng!"
            : "Vui lòng chọn màu sắc và kích cỡ trước khi tăng số lượng!",
          {
            toastId,
            icon: <FaExclamationCircle color="white" />,
            autoClose: 3000,
          }
        );
      }
      return;
    }

    const maxStock = selectedVariant?.stock_quantity || product?.stock_quantity || 1;
    if (quantity < maxStock) {
      setQuantity((prev) => prev + 1);
    } else {
      const toastId = "stock-limit";
      if (!toast.isActive(toastId)) {
        toast.warning(`Chỉ còn ${maxStock} sản phẩm trong kho`, {
          toastId,
          icon: <FaExclamationCircle color="white" />,
          autoClose: 3000,
        });
      }
    }
  };


  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      const toastId = "no-size-selected";
      if (!toast.isActive(toastId)) {
        toast.error("Vui lòng chọn size trước khi thêm vào giỏ hàng!", {
          toastId,
          icon: <FaExclamationCircle color="white" />,
          autoClose: 3000,
        });
      }
      return;
    }


    if (quantity > selectedVariant.stock_quantity) {
      toast.error(`Chỉ còn ${selectedVariant.stock_quantity} sản phẩm trong kho!`, {
        icon: <FaExclamationCircle color="white" />,
      });
      setQuantity(selectedVariant.stock_quantity);
      return;
    }
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      const toastId = "not-logged-in-cart";
      if (!toast.isActive(toastId)) {
        toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!", {
          toastId,
          icon: <FaExclamationCircle color="white" />,
          autoClose: 3000,
        });
      }
      setTimeout(() => navigate("/login"), 3000);
      return;
    }

    try {
      const payload: CartPayload = {
        product_id: product!._id,
        variant_id: selectedVariant._id,
        quantity,
      };

      await addToCart(payload);

      if (!toast.isActive("added-to-cart")) {
        toast.success("Sản phẩm đã được thêm vào giỏ hàng!", {
          toastId: "added-to-cart",
          icon: <FaCheckCircle color="green" />,
          autoClose: 3000,
        });
      }
    } catch (error: any) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);

      if (!toast.isActive(errorToastId)) {
        const message =
          error?.response?.data?.code === "EXCEED_STOCK_LIMIT"
            ? "Sản phẩm trong giỏ hàng đã đạt số lượng tồn kho tối đa."
            : "Có lỗi xảy ra khi thêm vào giỏ hàng!";

        toast.error(message, {
          toastId: errorToastId,
          icon: <FaExclamationCircle color="white" />,
          autoClose: 3000, // tự đóng sau 3 giây
        });
      }
    }

  };

  if (loading) return <p className="text-center py-10">Đang tải dữ liệu...</p>;
  if (!product) return <p className="text-center py-10">Không tìm thấy sản phẩm</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="relative p-4 rounded-2xl overflow-hidden animate-border">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-white to-gray-400 animate-gradient bg-[length:300%_300%] z-0"></div>
          <div className="relative bg-white rounded-2xl p-5 z-10">
            <div className="w-full h-[400px] flex items-center justify-center bg-white rounded-lg mb-4 shadow-inner">
              <img src={currentImage} alt={product.name} className="max-h-full object-contain" />
            </div>
            {variantImages.length > 1 && (
              <div className="flex gap-4 justify-center mt-4">
                {variantImages.map((img, idx) => (

                  <button
                    key={idx}
                    onClick={() => setCurrentImage(img)}
                    className={`w-20 h-20 p-1 rounded-md border flex items-center justify-center transition ${currentImage === img ? "ring-2 ring-green-600" : "border-gray-300 hover:border-green-400"
                      }`}
                  >
                    <img src={img} alt={`Ảnh ${idx + 1}`} className="object-contain w-full h-full" />
                  </button>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* Product Info Section */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">{product.name}</h1>

            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <span className="text-3xl font-bold text-green-600">
                {(displayedVariant?.discount_price ?? displayedVariant?.price ?? product.discount_price).toLocaleString()}₫
              </span>

              {(displayedVariant?.discount_price || product.discount_price) && (
                <span className="text-base text-gray-400 line-through">
                  {(displayedVariant?.price ?? product.price).toLocaleString()}₫
                </span>
              )}

              {displayedVariant?.price && displayedVariant?.discount_price && (
                <span className="text-sm text-red-600 font-medium">
                  -{Math.round(((displayedVariant.price - displayedVariant.discount_price) / displayedVariant.price) * 100)}%
                </span>
              )}
            </div>

            {/* <div className="text-sm text-gray-700 mb-2">
              Tình trạng: <span className={product.stock_quantity > 0 ? "text-green-600" : "text-red-600"}>{product.stock_quantity > 0 ? "Còn hàng" : "Hết hàng"}</span>
            </div> */}

            <div className="text-sm text-gray-700 mb-2">Thương hiệu: {product.brand}</div>
            {previewVariant && (
              <div className="mt-4 text-sm text-gray-700">
                <p><strong>Màu sắc:</strong> {previewVariant.color}</p>
              </div>
            )}
            {selectedVariant && (
              <div className="mt-2 text-sm text-gray-700">
                <p><strong>Mã SKU:</strong> {selectedVariant.sku}</p>
                <p><strong>Số lượng:</strong> {selectedVariant.stock_quantity}</p>
              </div>
            )}
            <div className="flex gap-2 flex-wrap mt-1">
              {[...new Map(variants.map(v => [v.color, v])).values()]
                .filter(variant => !!variant.image)
                .map((variant) => (
                  <button
                    key={variant._id || `${variant.color}-${variant.image}`}
                    onClick={() => {
                      const sameColorVariants = variants.filter(v => v.color === variant.color);
                      const allImages = sameColorVariants.flatMap(v => v.images?.length ? v.images : [v.image]);
                      const uniqueImages = Array.from(new Set(
                        allImages.filter((img) => !!img && img !== variant.image) // ❌ Loại ảnh chính
                      ));
                      setVariantImages(uniqueImages);
                      setSelectedColor(variant.color);
                      setCurrentImage(uniqueImages[0]);

                      setPreviewVariant(sameColorVariants[0]);

                      setSelectedVariant(null);

                    }}
                    className={`border rounded p-1 ${selectedVariant?.color === variant.color
                      ? "border-green-600"
                      : "border-gray-300 hover:border-green-400"
                      }`}
                  >
                    <img src={variant.image} alt={variant.color} className="w-10 h-10 object-cover rounded" />
                  </button>
                ))}

            </div>



            {/* Chọn size */}
            {selectedColor && (
              <div className="mb-4">
                <span className="text-sm text-gray-700">Kích cỡ:</span>
                <div className="flex gap-2 flex-wrap mt-1">
                  {variants
                    .filter(v => v.color === selectedColor)
                    .sort((a, b) => Number(a.size) - Number(b.size))
                    .map((variant) => {
                      const isOutOfStock = variant.stock_quantity === 0;
                      const isSelected = selectedVariant?._id === variant._id;

                      return (
                        <button
                          key={variant._id}
                          onClick={() => {
                            if (!isOutOfStock) {
                              setSelectedVariant(variant);
                            }
                          }}
                          disabled={isOutOfStock}
                          className={`px-3 py-1 text-sm border rounded relative transition
                ${isOutOfStock
                              ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                              : isSelected
                                ? "bg-green-600 text-white border-green-600"
                                : "bg-white text-gray-700 border-gray-300 hover:border-green-500"
                            }`}
                        >
                          {variant.size}
                          {isOutOfStock && (
                            <span className="absolute left-1/2 top-1/2 w-4/5 h-0.5 bg-red-500 transform -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full pointer-events-none"></span>
                          )}
                        </button>
                      );
                    })}
                </div>
              </div>
            )}


            <p className="text-sm text-gray-500 mb-4 leading-relaxed">{product.description}</p>

            <ul className="text-sm text-gray-600 mb-6 list-disc list-inside">
              <li><strong>Xuất xứ:</strong> {product.origin}</li>
              <li><strong>Mã sản phẩm:</strong> {product._id}</li>
            </ul>

            {/* Số lượng + Thêm giỏ */}
            <div className="flex items-center gap-3">
              <button onClick={handleDecrease} className="bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400">-</button>
              <input
                type="number"
                min={1}
                max={selectedVariant?.stock_quantity || 1}
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) {
                    const stock = selectedVariant?.stock_quantity || 1;
                    setQuantity(val > stock ? stock : val < 1 ? 1 : val);
                  }
                }}
                className="w-16 px-2 py-1 border rounded text-sm text-center
    [appearance:textfield] 
    [&::-webkit-outer-spin-button]:appearance-none 
    [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button onClick={handleIncrease} className="bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400">+</button>
              <button onClick={handleAddToCart} className="bg-green-500 text-white px-5 py-2 rounded hover:bg-green-700 text-sm">Thêm vào giỏ</button>
              <button
                onClick={() => {
                  if (!selectedVariant) {
                    toast.warning("Vui lòng chọn size trước khi mua!");
                    return;
                  }
                  const token = localStorage.getItem("token");
                  const user = localStorage.getItem("user");

                  if (!token || !user) {
                    toast.error("Vui lòng đăng nhập để mua sản phẩm!", {
                      icon: <FaExclamationCircle color="white" />,
                    });
                    setTimeout(() => navigate("/login"), 3000);
                    return;
                  }


                  const userString = localStorage.getItem("user");
                  const userData: IUser | null = userString ? JSON.parse(userString) : null;

                  const selectedItem: ICartItem = {
                    product: product!,
                    variant: selectedVariant,
                    quantity,
                  };

                  navigate("/checkout", {
                    state: {
                      selectedItems: [selectedItem],
                      user: userData,
                      isFromCart: false,
                    },
                  });
                }}
                className="bg-green-500 text-white px-5 py-2 rounded hover:bg-green-700 text-sm"
              >
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      </div>
      <ProductReviewSection />
      {/* Sản phẩm liên quan */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Có thể bạn cũng thích</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map((item) => (
            <Link to={`/product/${item._id}`} key={item._id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition hover:scale-105">
              <img src={item.images?.[0]} alt={item.name} className="w-full h-40 object-contain mb-3" />
              <h3 className="font-semibold text-base text-gray-800 mb-1">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.origin}</p>
              <div className="flex gap-2 items-center mt-2">
                <span className="text-red-600 font-bold">{item.discount_price.toLocaleString()}₫</span>
                <span className="text-sm text-gray-400 line-through">{item.price.toLocaleString()}₫</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
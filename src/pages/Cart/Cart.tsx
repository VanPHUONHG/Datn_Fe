import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaExclamationCircle, FaTrash } from "react-icons/fa";
import type { ICart, ICartItem } from "types/cart";
import { getCart, removeFromCart, updateCartItem } from "services/cart/cart.service";
import { getUserById } from "services/user/user.service";
import type { IUser } from "types/user";

const Cart = () => {
  const [cart, setCart] = useState<ICart | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedItemKeys, setSelectedItemKeys] = useState<string[]>([]);
  const navigate = useNavigate();
  const [userData, setUserData] = useState<IUser | null>(null);

  const [selectAll, setSelectAll] = useState(false);

  //Hàm xử lý khi tick chọn tất cả:
  const handleToggleSelectAll = (checked: boolean) => {
  setSelectAll(checked);
  if (checked) {
    // Chọn tất cả item
    const allKeys = cart?.items.map((item) => getItemKey(item)) || [];
    setSelectedItemKeys(allKeys);
  } else {
    // Bỏ chọn tất cả
    setSelectedItemKeys([]);
  }
};
useEffect(() => {
  if (cart?.items.length) {
    setSelectAll(selectedItemKeys.length === cart.items.length);
  }
}, [selectedItemKeys, cart]);



  const formatVND = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

 const getItemKey = (item: ICartItem): string => {
  const productId = typeof item.product === "string" ? item.product : item.product?._id ?? "null";
  const variantId = typeof item.variant === "string" ? item.variant : item.variant?._id ?? "null";
  return `${productId}-${variantId}`;
};


  const fetchCart = async () => {
    try {
      const res = await getCart();
      const updatedItems = await Promise.all(
        res.data.products.map(async (item: ICartItem) => {
          const variant = typeof item.variant !== "string" ? item.variant : null;
          const product = typeof item.product !== "string" ? item.product : null;
          const productName = product?.name || "Không rõ";

          if (!variant) return item;

          if (item.quantity > variant.stock_quantity) {
            toast.warning(
              `Sản phẩm ${productName} chỉ còn ${variant.stock_quantity} sản phẩm. Đã cập nhật lại số lượng.`
            );

            // Cập nhật số lượng trong giỏ hàng
            const productId = typeof item.product === "string" ? item.product : item.product._id;
            const variantId = variant._id;

            await updateCartItem({
              product_id: productId,
              variant_id: variantId,
              quantity: variant.stock_quantity,
            });

            // Trả về phiên bản mới đã cập nhật số lượng
            return {
              ...item,
              quantity: variant.stock_quantity,
            };
          }

          return item;
        })
      );

     const filteredItems = updatedItems.filter(
  (item) => item.product && item.variant
);

setCart({
  items: filteredItems,
  totalPrice: res.data.totalPrice,
});

    } catch (error) {
      console.error("Lỗi fetch cart", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("user");
        if (!userId) return;

        const userString = localStorage.getItem("user");
        if (!userString) return;

        const parsedUser = JSON.parse(userString);
        const res = await getUserById(parsedUser._id);
        setUserData(res);
      } catch (err) {
        console.error("Lỗi khi lấy user:", err);
      }
    };

    fetchUser();
  }, []);
  const handleToggleSelect = (item: ICartItem, checked: boolean) => {
    const key = getItemKey(item);
    setSelectedItemKeys((prev) =>
      checked ? [...prev, key] : prev.filter((k) => k !== key)
    );
  };

  const handleUpdateQuantity = async (item: ICartItem, newQuantity: number) => {
    if (newQuantity < 1) return;

    const productId = typeof item.product === "string" ? item.product : item.product._id;
    const variantId = typeof item.variant === "string" ? item.variant : item.variant?._id;
    const variant = typeof item.variant !== "string" ? item.variant : null;

    if (variant?.stock_quantity && newQuantity > variant.stock_quantity) {
      const toastId = "exceed-stock-limit";
      if (!toast.isActive(toastId)) {
        toast.warning(`Chỉ còn ${variant.stock_quantity} sản phẩm trong kho!`, {
          toastId,
          icon: <FaExclamationCircle color="white" />,
          autoClose: 3000,
        });
      }
      return;
    }
    if (variant?.stock_quantity && newQuantity > variant.stock_quantity) {
      toast.warning(`Chỉ còn ${variant.stock_quantity} sản phẩm trong kho!`);
      return;
    }

    try {
      await updateCartItem({ product_id: productId, variant_id: variantId, quantity: newQuantity });
      await fetchCart();
    } catch (err) {
      console.error("Lỗi update số lượng", err);
    }
  };

  const handleRemoveItem = async (item: ICartItem) => {
    try {
      const productId = typeof item.product === "string" ? item.product : item.product._id;
      const variantId = typeof item.variant === "string" ? item.variant : item.variant?._id;

      await removeFromCart({ product_id: productId, variant_id: variantId });
      await fetchCart();

      const key = getItemKey(item);
      setSelectedItemKeys((prev) => prev.filter((k) => k !== key));

      toast.success("Đã xoá sản phẩm khỏi giỏ hàng!");
      window.dispatchEvent(new Event("update-wishlist-cart"));

    } catch (err) {
      console.error("Lỗi khi xoá", err);
    }
  };

  const handleCheckout = () => {
    if (!cart) return;
    const selectedItems = cart.items.filter((item) =>
      selectedItemKeys.includes(getItemKey(item))
    );
    if (selectedItems.length === 0) {
      const toastId = "no-selected-items";
      if (!toast.isActive(toastId)) {
        toast.warning("Vui lòng chọn ít nhất một sản phẩm để thanh toán.", {
          toastId,
          icon: <FaExclamationCircle color="white" />,
          autoClose: 3000,
        });
      }
      return;
    }
    
const sanitizedItems = selectedItems.map(item => {
  const product = typeof item.product !== "string" ? item.product : null;
  const variant = typeof item.variant !== "string" ? item.variant : null;

const color =
  typeof variant?.color === "object"
    ? (variant.color as { value: string }).value
    : variant?.color || "Không rõ";

const size =
  typeof variant?.size === "object"
    ? (variant.size as { value: string }).value
    : variant?.size || "Không rõ";

  return {
    ...item,
    product,
    variant: {
      ...variant,
      color,
      size
    }
  };
});

navigate("/checkout", { state: { selectedItems: sanitizedItems, user: userData, isFromCart: true } });
  };

  const calculateSummary = () => {
    if (!cart) return { totalItems: 0, totalAmount: 0 };
    const selectedItems = cart.items.filter((item) =>
      selectedItemKeys.includes(getItemKey(item))
    );

    const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = selectedItems.reduce((sum, item) => {
      const product = typeof item.product !== "string" ? item.product : null;
      const variant = typeof item.variant !== "string" ? item.variant : null;
      const price = variant?.discount_price || variant?.price || product?.price || 0;
      return sum + price * item.quantity;
    }, 0);
    return { totalItems, totalAmount };
  };

  const { totalItems, totalAmount } = calculateSummary();
  const deliveryCharges = 32000;
  const totalWithDelivery = totalAmount + deliveryCharges;


  //Hiện các sản phẩm đã đc bấm xem chi tiết
  const [viewedProducts, setViewedProducts] = useState<any[]>([]);

useEffect(() => {
  const viewed = JSON.parse(localStorage.getItem("viewedProducts") || "[]");
  setViewedProducts(viewed);
}, []);
//Chỉ hiện 4 sản phẩm và có nút xem thêm để xem tất cả
const [showAll, setShowAll] = useState(false);
const displayedProducts = showAll ? viewedProducts : viewedProducts.slice(0, 5);

  if (loading) return <p className="text-center py-10">Đang tải giỏ hàng...</p>;
  if (!cart || cart.items.length === 0)
    return <p className="text-center py-10">Giỏ hàng của bạn đang trống</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-lg font-semibold mb-4">Giỏ hàng của bạn</h2>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded">
            <thead className="bg-gray-100">
             <tr>
    <th className="p-2 text-center">
      <input
        type="checkbox"
        checked={selectAll}
        onChange={(e) => handleToggleSelectAll(e.target.checked)}
      />
    </th>
    <th className="p-2 text-left">Sản phẩm</th>
    <th className="p-2 text-center">Giá</th>
    <th className="p-2 text-center">Số lượng</th>
    <th className="p-2 text-center">Tổng tiền</th>
    <th className="p-2 text-center">Action</th>
  </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => {
                const key = getItemKey(item);
                const isSelected = selectedItemKeys.includes(key);

                const product = typeof item.product !== "string" ? item.product : null;
                const variant = typeof item.variant !== "string" ? item.variant : null;
                const price = variant?.discount_price || variant?.price || product?.price || 0;
                const image = variant?.image || product?.images?.[0] || "/no-image.png";
                const name = product?.name || "Không rõ";
        const color = typeof variant?.color === "object" ? (variant.color as any).value : variant?.color || "Không rõ";
const size = typeof variant?.size === "object" ? (variant.size as any).value : variant?.size || "Không rõ";


                return (
                  <tr key={key} className="border-t">
                    <td className="text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleToggleSelect(item, e.target.checked)}
                      />
                    </td>
                    <td className="p-2">
                      <Link
                        to={`/product/${product?._id}`}
                        className="flex gap-3 items-center hover:bg-gray-50 p-2 rounded transition"
                      >
                        <img src={image} alt={name} className="w-14 h-14 object-cover border rounded" />
                        <div>
                          <p className="font-medium text-blue-600 hover:underline">{name}</p>
                          <p className="text-xs text-gray-500">Màu: {color} | Size: {size}</p>
                        </div>
                      </Link>
                    </td>

                    <td className="text-center">{formatVND(price)}</td>
                    <td className="text-center">
                      <div className="flex justify-center items-center gap-2">
                        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden text-sm shadow-sm">
                          <button
                            onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                            className="w-8 h-8 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="w-10 text-center border-x border-gray-300 bg-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                            className="w-8 h-8 text-gray-600 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </td>

                    <td className="text-center">{formatVND(price * item.quantity)}</td>
                    <td className="text-center">
                      <button onClick={() => handleRemoveItem(item)} className="text-red-500">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
          <div className="mt-4 flex justify-end">
            <a
              href="/"
              className="text-sm text-blue-600 hover:underline inline-flex items-center"
            >
              ← Tiếp tục mua sắm
            </a>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white border border-gray-200 rounded p-4 space-y-2">
          <h3 className="font-semibold text-lg">Tóm tắt</h3>
          <div className="flex justify-between">
            <span>Tạm thời ({totalItems} sản phẩm)</span>
            <span>{formatVND(totalAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span>Phí giao hàng</span>
            <span>{formatVND(deliveryCharges)}</span>
          </div>
          <div className="flex justify-between font-semibold pt-2 border-t">
            <span>Tổng</span>
            <span>{formatVND(totalWithDelivery)}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mt-4"
          >
            Thanh toán
          </button>
        </div>
      </div>

   {viewedProducts.length > 0 && (
  <div className="max-w-7xl mx-auto px-4 pt-6">
    <h2 className="text-lg font-semibold mb-4">Sản phẩm bạn đã xem</h2>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {displayedProducts.map((item) => (
        <Link
          key={item._id}
          to={`/product/${item._id}`}
          className="border border-gray-200 rounded p-3 hover:shadow transition bg-white"
        >
          <div className="w-full h-40 flex items-center justify-center overflow-hidden bg-gray-50 mb-2">
            <img
              src={item.images?.[0] || "/no-image.png"}
              alt={item.name}
              className="object-contain w-full h-full"
            />
          </div>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2">{item.name}</h3>
          <p className="text-red-500 font-semibold text-sm">
            {item.discount_price?.toLocaleString() || item.price?.toLocaleString()}₫
          </p>
        </Link>
      ))}
    </div>

    {viewedProducts.length > 4 && (
      <div className="text-center mt-4">
        <button
          onClick={() => setShowAll((prev) => !prev)}
          className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 text-sm font-medium"
        >
          {showAll ? "Thu gọn" : "Xem thêm"}
          <svg
            className={`w-4 h-4 transform transition-transform duration-300 ${
              showAll ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    )}
  </div>
)}


    </div>
    
  );
};

export default Cart;

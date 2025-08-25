import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { validateCouponForUser } from "services/coupon/coupon.service";
import { createOrder } from "services/order/order.service";
import type { ICartItem } from "types/cart";
import type { IUser } from "types/user";

function Checkout() {
    const location = useLocation();

    const navigate = useNavigate();

    const selectedItems: ICartItem[] = location.state?.selectedItems || [];
    const passedUser: IUser | null = location.state?.user || null;

    const [userForm, setUserForm] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);

    const [couponCode, setCouponCode] = useState("");
    const [coupon, setCoupon] = useState<any>(null);
    const [couponError, setCouponError] = useState<string | null>(null);

    const [paymentMethod, setPaymentMethod] = useState("cod");

    const [note, setNote] = useState("");

    const [createdOrder, setCreatedOrder] = useState<any>(null);   //Ko cần xóa createadOrder vì nó chỉ dùng để tạo dữ liệu id đơn hàng (Mã đơn hàng)


    const isFromCart: boolean = location.state?.isFromCart || false;

    const [formErrors, setFormErrors] = useState({
        full_name: "",
        phone: "",
        address: "",
    });


    const validateForm = () => {
        const errors = { full_name: "", phone: "", address: "" };
        let isValid = true;

        if (!userForm?.full_name.trim()) {
            errors.full_name = "Vui lòng nhập họ tên.";
            isValid = false;
        }

        const phoneRegex = /^(0|\+84)(3[2-9]|5[6|8|9]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/;
        if (!userForm?.phone.trim() || !phoneRegex.test(userForm.phone)) {
            errors.phone = "Số điện thoại không hợp lệ.";
            isValid = false;
        }

        if (!userForm?.address.trim()) {
            errors.address = "Vui lòng nhập địa chỉ.";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };


    const deliveryCharges = 32000;

  const handleApplyCoupon = async () => {
  try {
    setCouponError(null);
    const result = await validateCouponForUser(couponCode.trim());
    if (result.valid) {
      const couponData = result.data;
      // 👉 Kiểm tra điều kiện đơn hàng tối thiểu bao nhiu tiền thì ms áp đc mã giảm giá đó
      if (couponData.min_purchase  && totalAmount < couponData.min_purchase) {
        setCoupon(null);
        setCouponError(`Đơn hàng tối thiểu phải đạt ${formatVND(couponData.min_purchase )} để áp dụng mã này.`);
        return;
      }

      setCoupon(couponData);
    } else {
      setCoupon(null);
      setCouponError(result.message || "Mã không hợp lệ.");
    }
  } catch (error: any) {
  let errMessage = "Không thể áp dụng mã giảm giá.";

  if (error.response?.data?.message) {
    errMessage = error.response.data.message; // Lấy message từ backend
  } else if (error.message) {
    errMessage = error.message;
  }

  setCoupon(null);
  setCouponError(errMessage);
}
};



    // ✅ Lấy user từ location.state thay vì gọi lại API
    useEffect(() => {
        if (passedUser) {
            setUserForm(passedUser);
        }
        setLoading(false);
    }, [passedUser]);

    const formatVND = (value: number) =>
        new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value);

    const calculatePrice = (item: ICartItem) => {    //  Tính giá sản phẩm 
        const variant = item.variant && typeof item.variant !== "string" ? item.variant : null;
        const discountPrice = variant?.discount_price;
        const originalPrice = variant?.price || 0;
        const price = discountPrice && discountPrice < originalPrice ? discountPrice : originalPrice;
        return { price, originalPrice };
    };

    const totalAmount = selectedItems.reduce((sum, item) => {
        const { price } = calculatePrice(item);
        return sum + price * item.quantity;
    }, 0);

    //Tính giá mã có type percent là giảm giá % lấy theo maxDiscount
    const calculateDiscount = () => {
        if (!coupon) return 0;

        if (coupon.discount_type === "percent") {
            const percentDiscount = Math.floor((totalAmount * coupon.discount_value) / 100);
            return coupon.max_discount ? Math.min(percentDiscount, coupon.max_discount) : percentDiscount;
        }

        return coupon.max_discount
            ? Math.min(coupon.discount_value, coupon.max_discount)
            : coupon.discount_value;
    };


    const discountAmount = calculateDiscount();
    const finalTotal = Math.max(0, totalAmount + deliveryCharges - discountAmount);

    const handleCheckout = async () => {
console.log("✅ paymentMethod trước khi gửi đơn:", paymentMethod);

        if (!validateForm()) return;

        const token = localStorage.getItem("token");
        if (!token || !userForm) return;

        try {

            const orderData = {
                user: passedUser?._id,

                items: selectedItems.map((item) => {
                    const product = typeof item.product === "string" ? null : item.product;
                    const variant = typeof item.variant === "string" ? null : item.variant;
                    const { price } = calculatePrice(item);

                    return {
                        productId: product?._id,
                        variantId: variant?._id,
                        productImage: variant?.image || product?.images?.[0] || "",
                        productName: product?.name || "Sản phẩm",
                        variant: {
                            size: variant?.size || "",
                            color: variant?.color || "",
                        },
                        quantity: item.quantity,
                        price: price,
                    };
                }),

                totalAmount: totalAmount,
                discountAmount: discountAmount,
                finalAmount: finalTotal,
                shippingFee: deliveryCharges,
                coupon: coupon
                    ? {
                        couponId: coupon._id,
                        code: coupon.code,
                        discountAmount: discountAmount,
                    }
                    : null,

                shippingAddress: {
                    name: userForm.full_name,
                    phone: userForm.phone,
                    addressLine: userForm.address,
                },

                note: note,

                paymentMethod: paymentMethod,

                status: "pending",

                isFromCart: isFromCart,
            };
            console.log("🟢 orderData gửi lên:", orderData);

           if (paymentMethod === "vnpay") {
    try {
        // 🟢 Ghi đè phương thức thanh toán là vnpay
        const pendingOrderData = {
            ...orderData,
            paymentMethod: "vnpay",
        };

        localStorage.setItem("pendingOrder", JSON.stringify(pendingOrderData));

        const { data } = await axios.get(
            `http://localhost:8888/api/orders/create_payment?amount=${finalTotal}`
        );
        window.location.href = data.paymentUrl;
        return;
    } catch (error) {
        console.error("Lỗi tạo link thanh toán:", error);
    }
} else {
    // Với COD thì tạo luôn đơn hàng
    const res = await createOrder(orderData);
    setCreatedOrder(res.data);
    navigate("/user/order", { replace: true });
}


        } catch (error: any) {
            console.error("Lỗi khi tạo đơn hàng:", error);
            // Có thể thêm toast báo lỗi
        }

      
    };
    if (loading) return <p>Đang tải...</p>;
    if (selectedItems.length === 0) return <p>Không có sản phẩm nào được chọn.</p>;
return (
  <div className="bg-gray-100 min-h-screen py-10">
    <div className="max-w-6xl mx-auto flex gap-6 px-4 items-stretch">
      {/* Cột trái: Đơn hàng + Thông tin giao hàng */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow p-6 space-y-6">
        {/* Đơn hàng */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Đơn hàng của bạn</h2>
          {selectedItems.map((item, index) => {
            const product = typeof item.product === "string" ? null : item.product;
            const variant = typeof item.variant === "string" ? null : item.variant;
            const { price, originalPrice } = calculatePrice(item);
            const image = variant?.image || product?.images?.[0] || "/no-image.png";
            const name = product?.name || "Sản phẩm";
            const color = variant?.color || "Không rõ";
            const size = variant?.size || "Không rõ";

            return (
              <div key={index} className="flex gap-4 py-3 border-b last:border-none">
                <img src={image} alt={name} className="w-20 h-20 object-cover rounded-lg border" />
                <div className="flex-1 text-sm">
                  <h3 className="font-medium text-gray-900">{name}</h3>
                  <p className="text-xs text-gray-500">Màu: {color} | Size: {size}</p>
                  <p className="text-xs text-gray-500">Số lượng: {item.quantity}</p>
                  <div className="flex gap-2 pt-1">
                    {price < originalPrice && (
                      <span className="line-through text-xs text-gray-400">
                        {formatVND(originalPrice)}
                      </span>
                    )}
                    <span className="text-sm font-semibold text-green-600">
                      {formatVND(price)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Thông tin giao hàng */}
       <div className="bg-white rounded-xl shadow p-6 space-y-4">
  <h2 className="text-lg font-semibold text-gray-800">Thông tin giao hàng</h2>

  <div className="space-y-4">
    {/* Họ và tên */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
      <input
        type="text"
        value={userForm?.full_name || ""}
        onChange={(e) => setUserForm({ ...userForm!, full_name: e.target.value })}
        placeholder="Nhập họ và tên"
        className="w-full border px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      {formErrors.full_name && (
        <p className="text-red-500 text-xs mt-1">{formErrors.full_name}</p>
      )}
    </div>

    {/* Số điện thoại */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
      <input
        type="tel"
        value={userForm?.phone || ""}
        onChange={(e) => setUserForm({ ...userForm!, phone: e.target.value })}
        placeholder="Nhập số điện thoại"
        className="w-full border px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      {formErrors.phone && (
        <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
      )}
    </div>

    {/* Địa chỉ nhận hàng */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ nhận hàng</label>
      <input
        type="text"
        value={userForm?.address || ""}
        onChange={(e) => setUserForm({ ...userForm!, address: e.target.value })}
        placeholder="Nhập địa chỉ cụ thể"
        className="w-full border px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      {formErrors.address && (
        <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
      )}
    </div>
  </div>
</div>

      </div>

      {/* Cột phải: Tóm tắt + Thanh toán */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow p-6 space-y-6">
        {/* Tóm tắt đơn hàng */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-800">Tóm tắt đơn hàng</h2>
          <div className="text-sm text-gray-700 space-y-1">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span>{formatVND(totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển</span>
              <span>{formatVND(deliveryCharges)}</span>
            </div>
            {coupon && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Giảm giá ({coupon.code})</span>
                <span>-{formatVND(discountAmount)}</span>
              </div>
            )}
            <div className="border-t border-dashed pt-3 font-bold flex justify-between">
              <span>Tổng cộng</span>
              <span>{formatVND(finalTotal)}</span>
            </div>
          </div>

          {/* Mã giảm giá */}
          <div className="pt-3">
            <label className="text-sm text-gray-600">Mã giảm giá:</label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Nhập mã..."
                className="flex-1 border px-3 py-1 rounded text-sm"
              />
              <button
                onClick={handleApplyCoupon}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
              >
                Áp dụng
              </button>
            </div>
            {coupon && (
              <p className="text-green-600 text-xs mt-1">
                Giảm {formatVND(discountAmount)} ({coupon.discount_value}
                {coupon.discount_type === "percent" ? "%" : "đ"})
              </p>
            )}
            {couponError && (
              <p className="text-red-500 text-xs mt-1">{couponError}</p>
            )}
          </div>
        </div>

        {/* Thanh toán */}
        <div className="space-y-4 text-sm">
          <h2 className="text-base font-semibold text-gray-800">Phương thức thanh toán</h2>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>Thanh toán khi nhận hàng</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="vnpay"
                checked={paymentMethod === "vnpay"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <img src="/image/vnpay-logo.jpg" alt="vnpay" className="h-6 w-auto" />
              <span>VNPay</span>
            </label>
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block font-medium text-sm">Ghi chú đơn hàng</label>
            <textarea
              rows={3}
              placeholder="Thêm ghi chú..."
              className="w-full border px-3 py-2 rounded mt-1 text-sm"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium"
          >
            Đặt hàng
          </button>
        </div>
      </div>
      
    </div>
<div className="flex justify-center mt-8">
  <p className="flex items-center gap-2 text-sm text-gray-700 bg-blue-50 border border-blue-200 rounded-lg px-6 py-3 shadow max-w-3xl w-full justify-center text-center">
    <span className="animate-bounce text-xl">📧</span>
    <span>
      Thông tin đơn hàng sẽ được gửi qua email. Nhà cung cấp sẽ liên hệ với bạn qua số điện thoại.
    </span>
  </p>
</div>



  </div>
);




}

export default Checkout;


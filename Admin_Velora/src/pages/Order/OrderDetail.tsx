import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "services/order/order.service";
import type { IOrder } from "types/order";
import { ORDER_STATUS_VI } from "types/orderStatusMap";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<IOrder | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "confirmed":
        return "bg-blue-500";
      case "shipped":
        return "bg-indigo-500";
      case "completed":
        return "bg-green-600";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  useEffect(() => {
    if (id) {
      getOrderById(id)
        .then(setOrder)
        .catch((err) => console.error("Error fetching order:", err));
    }
  }, [id]);

  const generateOrderCode = (id?: string) => {
    if (!id) return "";
    const last6 = id.slice(-6).toUpperCase();
    return `ORDER-${last6}`;
  };

  if (!order) return <div className="p-6 text-gray-600">Đang tải đơn hàng...</div>;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto p-6">
        <h1 className="text-2xl font-normal mb-4">
          Quản lý đơn hàng:{" "}
          <span className="font-semibold">{generateOrderCode(order._id)}</span>
        </h1>

        <div className={`${getStatusColor(order.status || "")} text-white px-5 py-3 rounded mb-5 w-full select-none`}>
          Trạng thái đơn hàng:{" "}
          <span className="font-semibold">
            {order.status
              ? ORDER_STATUS_VI[order.status as keyof typeof ORDER_STATUS_VI]
              : "Không rõ"}
          </span>
        </div>

        <section className="bg-white rounded shadow-sm p-6">
          <div className="flex justify-between items-start border-b border-gray-200 pb-4 mb-6">
            <div className="flex items-center gap-2 font-semibold text-gray-900 text-lg">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20M12 2a15.3 15.3 0 010 20" />
              </svg>
              Shop giày Velora
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between mb-8 gap-8 text-sm md:text-base text-gray-700">
            <div className="md:w-1/2 space-y-1">
              <div><span className="font-semibold">Thông tin người nhận</span></div>
              <div>Tên: <span className="font-semibold">{order.shippingAddress?.name}</span></div>
              <div>Số điện thoại: {order.shippingAddress?.phone}</div>
              <div>Địa chỉ: {order.shippingAddress?.addressLine}</div>
            </div>

            <div className="md:w-1/2 space-y-1">
              <div><span className="font-semibold">Thông tin</span></div>
              <div><span className="font-semibold">Mã đơn hàng: {order._id?.slice(-6)}</span></div>
              <div>Tổng tiền: {order.finalAmount.toLocaleString()} VND</div>
              <div>Ghi chú: {order.note || "Không có"}</div>
              <div>Thanh toán: {order.paymentMethod}</div>
            </div>
          </div>

          <table className="w-full table-auto border-collapse border border-gray-200 text-gray-800 text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="border px-3 py-2 text-left font-semibold">#</th>
                <th className="border px-3 py-2 text-left font-semibold">Tên sản phẩm</th>
                <th className="border px-3 py-2 text-left font-semibold">Phân loại</th>
                <th className="border px-3 py-2 text-right font-semibold">Đơn giá</th>
                <th className="border px-3 py-2 text-right font-semibold">Số lượng</th>
                <th className="border px-3 py-2 text-right font-semibold">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={item.productId} className="bg-gray-50 border-b border-gray-200">
                  <td className="border px-3 py-2">{index + 1}</td>
                  <td className="border px-3 py-2">{item.productName}</td>
                  <td className="border px-3 py-2">
                    {[item.variant?.color, item.variant?.size].filter(Boolean).join(" / ")}
                  </td>
                  <td className="border px-3 py-2 text-right">
                    {item.price.toLocaleString()}
                  </td>
                  <td className="border px-3 py-2 text-right">
                    {item.quantity}
                  </td>
                  <td className="border px-3 py-2 text-right">
                    {(item.price * item.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <time className="block my-3 text-right text-sm text-gray-600">
            Ngày đặt: {order.createdAt ? new Date(order.createdAt).toLocaleString() : "Không rõ"}
          </time>

          {/* Tổng kết thanh toán */}
          <div className="flex justify-between py-1 border-b border-gray-200">
            <div className="font-semibold">Thành tiền:</div>
            <div className="text-right">{order.totalAmount.toLocaleString()} VND</div>
          </div>

          <div className="flex justify-between py-1 border-b border-gray-200">
            <div className="font-semibold">Vận chuyển:</div>
            <div className="text-right">32,000 VND</div>
          </div>

          {(order?.discountAmount ?? 0) > 0 && order?.coupon?.code && (
            <div className="flex justify-between py-1 border-b border-gray-200">
              <div className="font-semibold">Mã giảm giá ({order.coupon.code}):</div>
              <div className="text-right text-red-500 font-semibold">
              - {(order.discountAmount ?? 0).toLocaleString()} VND
              </div>

            </div>
          )}

          <div className="flex justify-between py-1 border-b border-gray-200 font-semibold">
            <div>Total:</div>
            <div className="text-right">{order.finalAmount.toLocaleString()} VND</div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 text-gray-600 text-sm py-4 px-6 flex justify-between">
        <div><strong>Website bán giày (Velora)</strong></div>
      </footer>
    </div>
  );
};

export default OrderDetail;

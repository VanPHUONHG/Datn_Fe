import React, { useEffect, useState } from 'react';
import {
  cancelOrderService,
  confirmReceivedOrderService,
  getOrdersByUserService
} from 'services/order/order.service';
import type { IOrder } from 'types/order';
import { ORDER_STATUS_VI } from 'types/orderStatusMap';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PAGE_SIZE = 5;

const Order = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    getOrdersByUserService()
      .then((res) => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toastId = 'cancel-order-error';

  const formatOrderCode = (id: string) => `ORDER-${id.slice(-6).toUpperCase()}`;

  const getPaymentMethod = (method: string) => {
    if (method === 'vnpay') return 'VNPay';
    if (method === 'cod') return 'COD';
    return method.toUpperCase();
  };

  const handleViewDetail = (orderId: string) => {
    navigate(`/user/order/${orderId}`);
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      const res = await cancelOrderService(orderId);
      if (!res.success) throw new Error(res.message || 'Hủy đơn hàng thất bại');

      toast.success(res.message || 'Đã hủy đơn hàng thành công');

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: 'cancelled' } : order
        )
      );
    } catch (err: any) {
      if (!toast.isActive(toastId)) {
        toast.error(err.message || 'Không thể hủy đơn hàng', {
          toastId
        });
      }
    }
  };

  const handleMarkAsReceived = async (orderId: string) => {
    try {
      const res = await confirmReceivedOrderService(orderId);
      toast.success(res.message || 'Đã xác nhận đã nhận hàng');
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: 'completed' } : order
        )
      );
    } catch (err: any) {
      toast.error(err.message || 'Không thể xác nhận đơn hàng');
    }
  };

  const totalPages = Math.ceil(orders.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentOrders = orders.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="p-4">
      {loading ? (
        <p className="text-gray-500">Đang tải...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">Chưa có đơn hàng</p>
      ) : (
        <>
          <nav className="flex border-b border-gray-300 px-6 text-gray-700">
            <button className="border-b-2 border-orange-500 text-orange-500 font-semibold py-3 px-4">
              Tất cả
            </button>
            <button className="hover:text-gray-900 py-3 px-4">Chờ xác nhận</button>
            <button className="hover:text-gray-900 py-3 px-4">Đã xác nhận</button>
            <button className="hover:text-gray-900 py-3 px-4">Đang giao</button>
            <button className="hover:text-gray-900 py-3 px-4">Hoàn thành</button>
            <button className="hover:text-gray-900 py-3 px-4">Đã hủy</button>
          </nav>

          <div className="bg-gray-100 px-6 py-2 border-b border-gray-300 mt-2">
            <div className="relative max-w-xl mx-auto">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
                />
              </svg>
              <input
                type="text"
                placeholder="Tìm kiếm đơn hàng, mã KM, sản phẩm..."
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white text-gray-600 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="overflow-x-auto mt-5">
            <table className="min-w-full border border-gray-200 text-sm text-gray-800">
              <thead className="bg-blue-50 text-gray-700">
                <tr>
                  <th className="border px-4 py-2">Mã đơn hàng</th>
                  <th className="border px-4 py-2">Ngày đặt</th>
                  <th className="border px-4 py-2">Tổng tiền</th>
                  <th className="border px-4 py-2">Thanh toán</th>
                  <th className="border px-4 py-2">Trạng thái</th>
                  <th className="border px-4 py-2">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order._id} className="border-b text-center hover:bg-gray-50">
                    <td className="border px-4 py-2 text-blue-600 font-medium">
                      {formatOrderCode(order._id!)}
                    </td>
                    <td className="border px-4 py-2">
                      {dayjs(order.createdAt).format('DD/MM/YYYY')}
                    </td>
                    <td className="border px-4 py-2 text-right">
                      {order.finalAmount.toLocaleString()}₫
                    </td>
                    <td className="border px-4 py-2">
                      {getPaymentMethod(order.paymentMethod || '')}
                    </td>
                    <td className="border px-4 py-2">
                      {ORDER_STATUS_VI[order.status || 'pending'] || 'Không xác định'}
                    </td>
                    <td className="border px-4 py-2 flex justify-center gap-2">
                      <button
                        onClick={() => handleViewDetail(order._id!)}
                        className="text-sm px-3 py-1 border border-green-500 text-white bg-green-500 rounded hover:bg-green-600 transition"
                      >
                        Chi tiết
                      </button>
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleCancelOrder(order._id!)}
                          className="text-sm px-3 py-1 border border-red-400 text-white bg-red-400 rounded hover:bg-red-600 transition"
                        >
                          Hủy
                        </button>
                      )}
                      {order.status === 'shipped' && (
                        <button
                          onClick={() => handleMarkAsReceived(order._id!)}
                          className="text-sm px-3 py-1 border border-blue-500 text-white bg-blue-500 rounded hover:bg-blue-600 transition"
                        >
                          Đã nhận hàng
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-4 gap-2 text-sm">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === 1
                  ? 'text-gray-400 border-gray-200'
                  : 'text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              « Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded border ${
                  page === currentPage
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === totalPages
                  ? 'text-gray-400 border-gray-200'
                  : 'text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              Next »
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Order;

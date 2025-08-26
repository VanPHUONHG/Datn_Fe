import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById, updateOrderInfoService } from 'services/order/order.service';
import type { IOrder } from 'types/order';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<IOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const translateStatus = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Chờ xác nhận';
            case 'confirmed':
                return 'Đã xác nhận';
            case 'shipped':
                return 'Đang giao hàng';
            case 'completed':
                return 'Hoàn thành';
            case 'cancelled':
                return 'Đã hủy';
            default:
                return 'Không rõ';
        }
    };
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        addressLine: '',
        note: '',
    });
    const [errors, setErrors] = useState<{ name?: string; phone?: string; addressLine?: string }>({});

const validateForm = () => {
  const newErrors: typeof errors = {};
  if (!formData.name.trim()) newErrors.name = "Tên không được để trống";
  if (!formData.phone.trim()) newErrors.phone = "SĐT không được để trống";
  if (!formData.addressLine.trim()) newErrors.addressLine = "Địa chỉ không được để trống";
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

    const handleSave = async () => {
         if (!validateForm()) return;
        try {
            if (!order) return;

            await updateOrderInfoService(order._id, formData);
            toast.success("Cập nhật thành công!");

            // Reload lại đơn hàng sau khi cập nhật
            const res = await getOrderById(order._id);
            setOrder(res.data);
            setEditMode(false);
        } catch (error) {
            console.log(error);

        }
    };
    useEffect(() => {
        if (id) {
            getOrderById(id)
                .then(res => {
                    setOrder(res.data);
                    setFormData({
                        name: res.data.shippingAddress.name,
                        phone: res.data.shippingAddress.phone,
                        addressLine: res.data.shippingAddress.addressLine,
                        note: res.data.note || '',
                    });
                })
                .catch(err => console.error('Lỗi khi lấy đơn hàng:', err))
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) return <p className="text-center text-gray-600 py-10">Đang tải dữ liệu...</p>;
    if (!order) return <p className="text-center text-red-500 py-10">Không tìm thấy đơn hàng</p>;

    return (
        <div className="bg-green-50 min-h-screen p-6">
            <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-green-600 mb-4 text-center">Chi tiết đơn hàng</h2>

                {/* Danh sách sản phẩm */}
                <div className="overflow-x-auto mb-8">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-green-500 text-white text-center">
                                <th className="p-3 border border-green-200">Hình ảnh</th>
                                <th className="p-3 border border-green-200">Tên sản phẩm</th>
                                <th className="p-3 border border-green-200">Phân loại</th>
                                <th className="p-3 border border-green-200">Đơn giá</th>
                                <th className="p-3 border border-green-200">Số lượng</th>
                                <th className="p-3 border border-green-200">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item, idx) => (
                                <tr key={idx} className="text-center">
                                    <td className="p-3 border border-green-100">
                                        <img src={item.productImage} alt={item.productName} className="w-16 h-16 object-cover rounded mx-auto" />
                                    </td>
                                    <td className="p-3 border border-green-100 text-left">{item.productName}</td>
<td className="p-3 border border-green-100">
  {item.variant.color || "Không rõ"} / {item.variant.size || "Không rõ"}
</td>
                                    <td className="p-3 border border-green-100 text-green-600 font-semibold">
                                        {item.price.toLocaleString()} đ
                                    </td>
                                    <td className="p-3 border border-green-100">{item.quantity}</td>
                                    <td className="p-3 border border-green-100 font-bold">
                                        {(item.quantity * item.price).toLocaleString()} đ
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Thông tin đơn hàng */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <div><span className="font-semibold">Mã đơn hàng:</span> {order._id.slice(-6).toUpperCase()}</div>
                        <div className="space-y-2">
                            {editMode ? (
                                <>
                                 <div>
  <label className="font-semibold">Người nhận:</label>
  <input
    className="border w-full p-1 rounded"
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
  />
  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
</div>

<div>
  <label className="font-semibold">SĐT:</label>
  <input
    className="border w-full p-1 rounded"
    value={formData.phone}
    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
  />
  {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
</div>

<div>
  <label className="font-semibold">Địa chỉ:</label>
  <input
    className="border w-full p-1 rounded"
    value={formData.addressLine}
    onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
  />
  {errors.addressLine && <p className="text-red-500 text-sm">{errors.addressLine}</p>}
</div>

                                </>
                            ) : (
                                <>
                                    <div><span className="font-semibold">Người nhận:</span> {order.shippingAddress.name}</div>
                                    <div><span className="font-semibold">SĐT:</span> {order.shippingAddress.phone}</div>
                                    <div><span className="font-semibold">Địa chỉ:</span> {order.shippingAddress.addressLine}</div>
                                </>
                            )}
                        </div>

                    </div>
                    <div className="space-y-2">
                        <div><span className="font-semibold">Ngày đặt:</span> {dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}</div>
                        <div><span className="font-semibold">Hình thức thanh toán:</span> {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'VNPAY'}</div>
                        {editMode ? (
                            <div>
                                <label className="font-semibold">Ghi chú:</label>
                                <input
                                    className="border w-full p-1 rounded"
                                    value={formData.note}
                                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                />
                            </div>
                        ) : (
                            <div><span className="font-semibold">Ghi chú:</span> {order.note || 'Không có'}</div>
                        )}
                        <div><span className="font-semibold">Trạng thái:</span> {translateStatus(order.status)}</div>



                    </div>
                    <div className="w-full col-span-full rounded-md p-4 bg-white space-y-2 text-sm">
  {/* Thành tiền */}
  <div className="flex justify-between py-1 border-b border-gray-200">
    <div className="font-semibold">Thành tiền:</div>
    <div>{order.totalAmount.toLocaleString()} VND</div>
  </div>

  {/* Vận chuyển */}
  <div className="flex justify-between py-1 border-b border-gray-200">
    <div className="font-semibold">Vận chuyển:</div>
    <div>32,000 VND</div>
  </div>

  {/* Mã giảm giá nếu có */}
  {order.discountAmount > 0 && order.coupon?.code && (
    <div className="flex justify-between py-1 border-b border-gray-200">
      <div className="font-semibold">Mã giảm giá ({order.coupon.code}):</div>
      <div className="text-red-500 font-semibold">- {order.discountAmount.toLocaleString()} VND</div>
    </div>
  )}

  {/* Tổng cộng */}
  <div className="flex justify-between py-1 border-b border-gray-200">
    <div className="font-semibold text-base">Tổng tiền:</div>
    <div className="text-base font-semibold">{order.finalAmount.toLocaleString()} VND</div>
  </div>
</div>




                </div>
                {order.status === 'pending' && (
                    <div className="text-center mt-6 flex justify-center gap-4">
                        {editMode ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded shadow"
                                >
                                    💾 Lưu
                                </button>
                                <button
                                    onClick={() => setEditMode(false)}
                                    className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded shadow"
                                >
                                    ❌ Hủy
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setEditMode(true)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-md font-semibold shadow-md transition"
                            >
                                ✏️ Sửa thông tin
                            </button>
                        )}
                    </div>
                )}

                {/* Nút quay lại */}
                <div className="text-center mt-8">
                    <button
                        onClick={() => navigate("/user/order")}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold shadow-md transition"
                    >
                        ← Quay lại danh sách đơn hàng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;

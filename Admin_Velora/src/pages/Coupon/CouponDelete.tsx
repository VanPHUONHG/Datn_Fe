import React, { useEffect, useState } from "react";
import { Button, Popconfirm, message } from "antd";
import { Link } from "react-router-dom";
import { getAllCoupons, updateCoupon } from "services/coupon/coupon.service";
import type { ICoupon } from "types/coupon";
import { DeleteOutlined, RollbackOutlined } from "@ant-design/icons";

const CouponDelete = () => {
  const [deletedCoupons, setDeletedCoupons] = useState<ICoupon[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDeletedCoupons = async () => {
    try {
      setLoading(true);
      const res = await getAllCoupons();
      const deleted = Array.isArray(res.data)
        ? res.data.filter((coupon: ICoupon) => coupon.is_active === false)
        : [];
      setDeletedCoupons(deleted);
    } catch (error: unknown) {
      console.error("Lỗi khi tải danh sách đã xoá:", error);
      message.error("Không thể tải danh sách mã đã xoá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedCoupons();
  }, []);

  const handleRestore = async (id: string) => {
    try {
      await updateCoupon(id, { is_active: true });
      message.success("Khôi phục mã khuyến mãi thành công");
      setDeletedCoupons((prev) => prev.filter((coupon) => coupon._id !== id));
    } catch (error) {
      console.error("Lỗi khi khôi phục mã:", error);
      message.error("Khôi phục thất bại");
    }
  };

 

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Danh sách mã khuyến mãi đã xoá
        </h2>
        <Link
          to="/admin/coupon-list"
          className="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 border border-red-300 shadow transition"
        >
          Xem mã khuyến mãi
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {[
                "STT",
                "Mã",
                "Loại",
                "Giá trị",
                "Giảm tối đa",
                "Tối thiểu mua",
                "Ngày bắt đầu",
                "Ngày kết thúc",
                "Kích hoạt",
                "Thao tác",
              ].map((header) => (
                <th
                  key={header}
                  className="border px-4 py-3 text-left text-gray-700 font-medium select-none"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="text-center py-6 text-blue-500">
                  Đang tải...
                </td>
              </tr>
            ) : deletedCoupons.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-6 text-gray-500">
                  Không có mã nào bị xoá
                </td>
              </tr>
            ) : (
              deletedCoupons.map((coupon, index) => (
                <tr
                  key={coupon._id}
                  className="even:bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{coupon.code}</td>
                  <td className="border px-4 py-2">{coupon.discount_type}</td>
                  <td className="border px-4 py-2">{coupon.discount_value}</td>
                  <td className="border px-4 py-2">{coupon.max_discount}</td>
                  <td className="border px-4 py-2">{coupon.min_purchase}</td>
                  <td className="border px-4 py-2">
                    {new Date(coupon.start_date).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(coupon.end_date).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">
                    <span className="text-red-600 font-medium">✘</span>
                  </td>
                  <td className="border px-4 py-2">
                    <div className="flex gap-2 justify-center">
                     
                      <Popconfirm
                        title="Bạn có muốn khôi phục mã này không?"
                        onConfirm={() => handleRestore(coupon._id)}
                        okText="Khôi phục"
                        cancelText="Huỷ"
                      >
                        <Button
                          type="primary"
                          size="small"
                          icon={<RollbackOutlined />}
                        >
                          Khôi phục
                        </Button>
                      </Popconfirm>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CouponDelete;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { message, Popconfirm } from "antd";
import { getAllCoupons, deleteCoupon } from "services/coupon/coupon.service";
import type { ICoupon } from "types/coupon";

const CouponList = () => {
  const [validCoupons, setValidCoupons] = useState<ICoupon[]>([]);
  const [expiredCoupons, setExpiredCoupons] = useState<ICoupon[]>([]);
  const [loading, setLoading] = useState(false);

const getDiscountTypeText = (type: "percent" | "fixed") => {
  switch (type) {
    case "percent":
      return "Phần trăm";
    case "fixed":
      return "Cố định";
    default:
      return type;
  }
};
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const res = await getAllCoupons();
        const now = new Date();

        const allCoupons: ICoupon[] = Array.isArray(res.data) ? res.data : [];

        const valid = allCoupons.filter(
          (coupon) => coupon.is_active && new Date(coupon.end_date) >= now
        );
        const expired = allCoupons.filter(
          (coupon) => coupon.is_active && new Date(coupon.end_date) < now
        );

        setValidCoupons(valid);
        setExpiredCoupons(expired);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách mã khuyến mãi:", error);
        message.error("Không thể tải danh sách khuyến mãi");
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const handleSoftDelete = async (id: string) => {
    try {
      await deleteCoupon(id);
      setValidCoupons((prev) => prev.filter((c) => c._id !== id));
      setExpiredCoupons((prev) => prev.filter((c) => c._id !== id));
      message.success("Xoá mã khuyến mãi thành công");
    } catch (error) {
      console.error("Lỗi khi xoá mã khuyến mãi:", error);
      message.error("Xoá không thành công");
    }
  };

  const renderTable = (coupons: ICoupon[], title: string) => (
    <div className="mb-10">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
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
              <th key={header} className=" px-4 py-2 text-left font-medium">
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
          ) : coupons.length === 0 ? (
            <tr>
              <td colSpan={10} className="text-center py-6 text-gray-500">
                Không có mã khuyến mãi nào
              </td>
            </tr>
          ) : (
            coupons.map((coupon, index) => (
              <tr key={coupon._id} className="even:bg-gray-50 hover:bg-gray-100">
                <td className=" px-4 py-2">{index + 1}</td>
                <td className=" px-4 py-2">{coupon.code}</td>
                <td className=" px-4 py-2">{getDiscountTypeText(coupon.discount_type)}</td>
                <td className=" px-4 py-2">{coupon.discount_value}</td>
                <td className=" px-4 py-2">{coupon.max_discount}</td>
                <td className=" px-4 py-2">{coupon.min_purchase}</td>
                <td className=" px-4 py-2">
                  {new Date(coupon.start_date).toLocaleDateString()}
                </td>
                <td className=" px-4 py-2">
                  {new Date(coupon.end_date).toLocaleDateString()}
                </td>
                <td className=" px-4 py-2">
                  {coupon.is_active ? (
                    <span className="text-green-600 font-medium">✔</span>
                  ) : (
                    <span className="text-red-600 font-medium">✘</span>
                  )}
                </td>
                <td className=" px-4 py-2">
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/coupon-edit/${coupon._id}`}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Sửa
                    </Link>
                    <Popconfirm
                      title="Bạn có chắc muốn xóa?"
                      onConfirm={() => handleSoftDelete(coupon._id)}
                      okText="Có"
                      cancelText="Không"
                    >
                      <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-500">
                        Xoá
                      </button>
                    </Popconfirm>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Quản lý mã khuyến mãi</h2>
        <Link
          to="/admin/coupon-delete"
          className="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 border border-red-300 shadow transition"
        >
          Xem khuyến mãi đã xoá
        </Link>
      </div>

      {renderTable(validCoupons, "🎉 Mã khuyến mãi đang còn hạn")}
      {renderTable(expiredCoupons, "⌛ Mã khuyến mãi đã hết hạn")}
    </div>
  );
};

export default CouponList;

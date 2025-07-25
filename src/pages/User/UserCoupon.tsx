import React, { useEffect, useState } from 'react';
import { getAllCoupons } from 'services/coupon/coupon.service';
import type { ICoupon } from 'types/coupon';

const UserCoupon = () => {
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const couponsPerPage = 6;

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await getAllCoupons();
        const allCoupons = Array.isArray(response) ? response : response.data;

const now = new Date();
const activeCoupons = allCoupons.filter(
  (coupon: ICoupon) =>
    coupon.is_active === true &&
    coupon.end_date && new Date(coupon.end_date) >= now
);
        setCoupons(activeCoupons);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách mã khuyến mãi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const formatDiscount = (coupon: ICoupon) => {
    return coupon.discount_type === 'percent'
      ? `Giảm ${coupon.discount_value}%`
      : `Giảm ${coupon.discount_value.toLocaleString()}đ`;
  };

  const indexOfLastCoupon = currentPage * couponsPerPage;
  const indexOfFirstCoupon = indexOfLastCoupon - couponsPerPage;
  const currentCoupons = coupons.slice(indexOfFirstCoupon, indexOfLastCoupon);
  const totalPages = Math.ceil(coupons.length / couponsPerPage);

  return (
    <div>
      <h2 className="text-xl font-bold pt-4">Kho Voucher</h2>

      {loading ? (
        <p>Đang tải...</p>
      ) : currentCoupons.length === 0 ? (
        <p>Không có mã khuyến mãi nào.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-14">
            {currentCoupons.map((coupon) => (
              <div
                key={coupon._id}
                className="border border-gray-200 rounded p-4 shadow-sm hover:shadow transition"
              >
                <h3 className="text-lg font-semibold text-orange-600">{coupon.code}</h3>
                <p className="mt-1 text-sm">{formatDiscount(coupon)}</p>

                {coupon.min_purchase && (
                  <p className="text-xs text-gray-600">
                    Đơn tối thiểu: {coupon.min_purchase.toLocaleString()}đ
                  </p>
                )}
                {coupon.max_discount && (
                  <p className="text-xs text-gray-600">
                    Giảm tối đa: {coupon.max_discount.toLocaleString()}đ
                  </p>
                )}

                <p className="text-xs text-gray-500 mt-2">
                  Hiệu lực:{' '}
                  {coupon.start_date && new Date(coupon.start_date).toLocaleDateString()} -{' '}
                  {coupon.end_date && new Date(coupon.end_date).toLocaleDateString()}
                </p>

                <p className="text-xs mt-1 font-semibold text-green-600">
                  Đang hoạt động
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6 gap-x-2 flex-wrap">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 border rounded-md text-sm font-medium bg-white text-blue-600 hover:bg-blue-100"
            >
              « Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-md border text-sm font-medium flex items-center justify-center transition ${
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-blue-600 hover:bg-blue-100'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-3 py-1 border rounded-md text-sm font-medium bg-white text-blue-600 hover:bg-blue-100"
            >
              Next »
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserCoupon;

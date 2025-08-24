import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTopSellingProducts } from 'services/product/product.service';

const NewArrivals = () => {
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const now = new Date();
        const to = now.toISOString();
        const from = new Date(now.setMonth(now.getMonth() - 1)).toISOString(); // lùi 1 tháng

        const data = await getTopSellingProducts(4, from, to);
        setTopProducts(data);
      } catch (err) {
        console.error('Lỗi khi tải sản phẩm bán chạy:', err);
      }
    };

    fetchTopProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Banner quảng cáo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Box 1 */}
        <div className="group relative w-full h-[280px] rounded-md overflow-hidden cursor-pointer">
          <img
            alt="Nike running shoe side view"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            src="https://storage.googleapis.com/a1aa/image/019fcfc9-1cec-4918-cc1e-5ad182de1403.jpg"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition duration-500 ease-in-out" />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-10 transition-all duration-500 ease-in-out group-hover:-translate-y-1 group-hover:opacity-90">
            <p className="font-extrabold text-lg md:text-xl tracking-widest" style={{ fontFamily: "'Arial Black', Arial, sans-serif" }}>
              NIKE - JUST DO IT
            </p>
            <p className="text-[10px] mt-1 font-normal">SINCE 1972</p>
          </div>
        </div>

        {/* Box 2 */}
        <div className="group relative w-full h-[280px] rounded-md overflow-hidden cursor-pointer">
          <img
            alt="Nike running shoe with glowing swoosh"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            src="https://storage.googleapis.com/a1aa/image/5e544e30-7827-4039-9d57-7fbab3122142.jpg"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition duration-500 ease-in-out" />
          <div className="absolute inset-0 flex flex-col justify-center items-start px-6 text-white z-10 transition-all duration-500 ease-in-out group-hover:translate-y-[-4px] group-hover:opacity-90">
            <h2 className="font-extrabold text-3xl md:text-4xl" style={{ fontFamily: "'Arial Black', Arial, sans-serif" }}>
              NIKE
            </h2>
            <p className="text-xs tracking-widest mb-1">N I T R O C H A R G E</p>
            <p className="text-xs font-semibold leading-4">
              IT PROCHARGE
              <br />
              BATTLE
            </p>
            <p className="text-xs mt-1">$ 299.99</p>
          </div>
        </div>
      </div>

    {/* Top Selling Section */}
      <div className="mt-10">
        <h1 className="text-gray-800 text-2xl font-extrabold">
          Sản phẩm <span className="text-green-500 font-normal">bán chạy trong tháng</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Lựa chọn hàng đầu trong 30 ngày qua
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6 text-left">
          {topProducts.map((product: any, index: number) => (
            <Link
              to={`/product/${product._id}`} // ← Thay đổi route nếu bạn cần
              key={product._id}
className="relative rounded-lg p-4 shadow-sm hover:shadow-md transition-transform duration-300 transform hover:scale-[1.02] bg-white block"
            >
              {/* Icon ở góc phải trên */}
              <div className="absolute top-2 right-2 text-xl">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🔥'}
              </div>

              {/* Ảnh */}
              <div className="h-44 w-full bg-gray-100 rounded mb-3 overflow-hidden flex items-center justify-center">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-sm text-gray-400">Không có ảnh</span>
                )}
              </div>

              {/* Tên sản phẩm */}
              <h2 className="text-sm font-semibold text-gray-800 min-h-[3rem] line-clamp-2">
                {product.name}
              </h2>

              {/* Đã bán + Giá */}
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">Đã bán: {product.sold}</p>
                <p className="text-base text-green-600 font-semibold">
                  {product.price?.toLocaleString()}₫
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewArrivals;

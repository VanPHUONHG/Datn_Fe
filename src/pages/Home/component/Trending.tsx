import React from "react";
import { FiTruck, FiRefreshCw, FiClock, FiMapPin } from "react-icons/fi";

const Trending = () => {
  const items = [
    {
      icon: <FiTruck className="w-8 h-8 text-blue-700" />,
      title: "VẬN CHUYỂN SIÊU TỐC",
      desc: "Vận chuyển nội thành HN trong 2 tiếng!",
    },
    {
      icon: <FiRefreshCw className="w-8 h-8 text-lime-400" />,
      title: "Đổi hàng",
      desc: "Đổi hàng trong 7 ngày miễn phí!",
    },
    {
      icon: <FiClock className="w-8 h-8 text-orange-500" />,
      title: "Tiết kiệm thời gian",
      desc: "Mua sắm dễ hơn khi online",
    },
    {
      icon: <FiMapPin className="w-8 h-8 text-orange-600" />,
      title: "ĐỊA CHỈ CỬA HÀNG",
      desc: "86 Đội Cấn, P. Liễu Giai, Q. Ba Đình, Hà Nội",
    },
  ];

  return (
    <div className="mt-10">
      {/* max-w tùy chỉnh 76rem ~ 1216px */}
      <div className="mx-auto px-4 py-14 bg-blue-50 " style={{ maxWidth: "77rem" }}>
        <div className="flex justify-between flex-wrap gap-8 text-black">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 max-w-xs flex-1 min-w-[220px]"
            >
              <div className="flex-shrink-0">{item.icon}</div>
              <div>
                <h3 className="font-semibold text-black leading-tight text-sm md:text-base">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm md:text-base leading-snug text-gray-900">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Trending;

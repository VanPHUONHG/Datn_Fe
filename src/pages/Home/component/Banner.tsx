import React, { useEffect, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBanners } from "services/banner/banner.service";
import type { IBanner } from "types/banner";

const Banner = () => {
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await getAllBanners();
        const data: IBanner[] = res || [];
        const active = data.filter((b) => b.isActive);

        const fixed = active.map((b) => ({
          ...b,
          image: b.image?.replace("localhost", "127.0.0.1"),
        }));

        setBanners(fixed);
      } catch (err) {
        console.error("Lỗi lấy banner:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 3000); // 2 giây đổi ảnh

    return () => clearInterval(interval);
  }, [banners]);

  if (loading || banners.length === 0) return null;

  const handleClick = () => {
    const current = banners[currentIndex];
    if (current.link) {
      navigate(current.link);
    }
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const current = banners[currentIndex];

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <img
        onClick={handleClick}
        src={current.image}
        alt={current.title}
        className="w-full h-[500px] object-cover shadow transition-all duration-500 ease-in-out cursor-pointer"
      />

      {/* Nút chuyển trái */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/70 hover:bg-white text-black rounded-full w-10 h-10 flex items-center justify-center shadow z-20"
      >
        &lt;
      </button>

      {/* Nút chuyển phải */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/70 hover:bg-white text-black rounded-full w-10 h-10 flex items-center justify-center shadow z-20"
      >
        &gt;
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {banners.map((_, i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === currentIndex ? "bg-white" : "bg-white/50"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default memo(Banner);

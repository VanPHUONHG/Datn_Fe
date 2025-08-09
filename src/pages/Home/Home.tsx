import React, { useEffect, useState } from 'react';
import { getAllProducts } from 'services/product/product.service';
import Banner from './component/Banner';
import OutstandingProducts from './component/OutstandingProducts';
import Menu from './component/Menu';
import NewArrivals from './component/NewArrivals';
import ServicesRow from './component/ServicesRow';
import Trending from './component/Trending';
import { Link } from 'react-router-dom';
import type { Product } from 'interface/product';
import { FaArrowUp } from 'react-icons/fa';

function Home() {
  const [data, setData] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12); // Số sản phẩm hiển thị ban đầu

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllProducts();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Nút cuộn lên đầu trang
  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 8); // Mỗi lần hiện thêm 8 sản phẩm
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className="overflow-x-hidden">
        <Banner />
        <Menu />
        <OutstandingProducts />
        <NewArrivals />

        {/* Sản phẩm nổi bật */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
          <div className="text-center mb-6">
            <h1 className="text-gray-800 text-2xl font-extrabold">
              Khám phá <span className="text-green-500 font-normal">bộ sưu tập</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Sẵn sàng để khám phá</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data?.slice(0, visibleCount).map((product) => (
              <Link
                to={`/product/${product._id}`}
                key={product._id}
                className="border border-gray-200 rounded-md p-3 shadow hover:shadow-lg transition-transform hover:scale-[1.02] bg-white"
              >
                <div className="flex flex-col">
                  <div className="w-full h-52 bg-gray-100 rounded overflow-hidden flex items-center justify-center mb-3">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="object-contain h-full w-full"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">Không có ảnh</span>
                    )}
                  </div>

                  <h2 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2 text-left">
                    {product.name}
                  </h2>
                  <div className="text-sm text-gray-500 text-left">{product.origin}</div>
                  <div className="flex items-center gap-2 mt-1 text-left">
                    <span className="text-red-600 font-bold text-base">
                      {product.discount_price.toLocaleString()}₫
                    </span>
                    <span className="text-gray-400 line-through text-sm">
                      {product.price.toLocaleString()}₫
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {visibleCount < (data?.length || 0) && (
            <div className="mt-6 text-center">
           <div className="mt-6 text-center">
  <button
    onClick={handleShowMore}
    className="inline-flex items-center gap-2 text-green-600 hover:text-white hover:bg-green-600 border border-green-600 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300"
  >
    Xem thêm
    <svg
      className="w-4 h-4 transition-transform duration-200"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      {/* Mũi tên xuống */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  </button>
</div>

            </div>
          )}
        </div>
        
        <Trending />
        <ServicesRow />

        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-40 right-11 z-50 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition"
            title="Lên đầu trang"
          >
            <FaArrowUp size={15} />
          </button>
        )}
      </div>
    </>
  );
}

export default Home;

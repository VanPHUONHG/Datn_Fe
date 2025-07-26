import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { getWishlistByUser, removeFromWishlist } from 'services/wistlist/wistlist.service';
import type { Product } from 'types/product';
import type { IUser } from 'types/user';

const Wishlist = () => {
const [wishlistItems, setWishlistItems] = useState<Product[]>([]); // danh sách sản phẩm yêu thích

useEffect(() => {
  const fetchWishlist = async () => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) as IUser : null;
    const userId = user?._id;

    if (!userId) return;

    try {
      const data = await getWishlistByUser(userId);
      setWishlistItems(data);
    } catch (err) {
      console.error("Không thể lấy wishlist:", err);
    }
  };

  fetchWishlist();
}, []);

const handleRemove = async (productId: string) => {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) as IUser : null;
  const userId = user?._id;

  if (!userId) return;

  try {
    await removeFromWishlist(userId, productId);
    setWishlistItems((prev) => prev.filter(item => item._id !== productId));
          window.dispatchEvent(new Event("update-wishlist-cart"));
  } catch (err) {
    console.error("Lỗi khi xoá sản phẩm khỏi wishlist:", err);
  }
};

  return (
      <div>
            <div className="max-w-7xl mx-auto border border-blue-300 p-6 mt-6 mb-6">
                <header className="text-center mb-6">
                    <h1 className="text-gray-700 text-lg font-normal">
                        Product
                        <span className="text-green-400 font-normal">
                            Wishlist
                        </span>
                    </h1>
                    <p className="text-xs text-gray-400 mt-1">
                        Your product wish is our first priority.
                    </p>
                </header>
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xs text-gray-500 font-semibold tracking-wide">
                            WISHLIST
                        </h2>

                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left border-collapse border border-transparent">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-2 pr-6 font-normal text-gray-500">
                                        ID
                                    </th>
                                    <th className="py-2 pr-6 font-normal text-gray-500">
                                        Ảnh
                                    </th>
                                    <th className="py-2 pr-6 font-normal text-gray-500">
                                        Tên sản phẩm
                                    </th>
                                    <th className="py-2 pr-6 font-normal text-gray-500">
                                        Ngày thêm
                                    </th>
                                    <th className="py-2 pr-6 font-normal text-gray-500">
                                        Giá gốc
                                    </th>
                                       <th className="py-2 pr-6 font-normal text-gray-500">
                                        Giá khuyến mại
                                    </th>
                                    <th className="py-2 font-normal text-gray-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                       <tbody>
  {wishlistItems.map((item, index) => (
    <tr key={item._id} className="border-b border-gray-100">
      <td className="py-2 pr-6 font-normal text-gray-600">{index + 1}</td>
      <td className="py-2 pr-6">
        <img
          alt={item.name}
          className="inline-block"
          height={20}
src={item.images[0]}
          width={40}
          
        />
      </td>
      <td className="py-2 pr-6 font-normal text-gray-600">
        <Link
    to={`/product/${item._id}`}
    className="text-blue-500 hover:underline hover:text-blue-700 transition"
  >
    {item.name}
  </Link>
      </td>
    <td className="py-2 pr-6 font-normal text-gray-600">
  {new Date(item.addedAt).toLocaleDateString("vi-VN")}
</td>
    <td className="py-2 pr-6 font-normal text-gray-600">
  {item.price.toLocaleString("vi-VN")} ₫
</td>
<td className="py-2 pr-6 font-normal text-gray-600">
  {item.discount_price.toLocaleString("vi-VN")} ₫
</td>

  <td className="py-2">
  <button
    onClick={() => handleRemove(item._id)}
    className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-full transition"
    title="Xoá khỏi danh sách yêu thích"
  >
    <i className="fas fa-trash-alt text-sm" />
  </button>
</td>

    </tr>
  ))}
</tbody>

                        </table>
                    </div>
                </section>
            </div>
       
        </div>
  )
}

export default Wishlist

import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { getUserById } from 'services/user/user.service';
import type { IUser } from 'types/user';
import { Spin, message } from 'antd';
import { EditOutlined, ShoppingCartOutlined, GiftOutlined } from "@ant-design/icons";

const User = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          message.error("Không tìm thấy thông tin người dùng");
          return;
        }
        const parsedUser = JSON.parse(storedUser);
        const userId = parsedUser._id;
        const userData = await getUserById(userId);
        setUser(userData);
      } catch {
        message.error("Lỗi khi tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <Spin tip="Đang tải..." className="flex justify-center p-10" />;
  if (!user) return <div className="text-center text-red-500">Không tìm thấy người dùng</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white font-sans text-sm">
      <div className="max-w-[1250px] w-full mx-auto py-6 px-4 lg:px-0">
        <div className="flex rounded-2xl overflow-hidden shadow-lg border border-green-100 bg-white">

          {/* Sidebar */}
          <aside className="flex-shrink-0 w-64 bg-gradient-to-b from-green-100 to-white border-r border-green-100 p-6 flex flex-col">
            {/* Avatar & Name */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative w-20 h-20">
                <img
                  src="https://img.myloview.com/stickers/default-avatar-profile-icon-vector-social-media-user-image-700-205124837.jpg"
                  alt="Avatar"
                  className="w-20 h-20 rounded-full border-4 border-green-400 shadow-md object-cover"
                />
              </div>
              <Link
                to="/user/profile"
                className="mt-4 text-base font-semibold text-gray-800 hover:text-green-600 transition truncate max-w-[150px]"
              >
                {user.full_name}
              </Link>
              <Link to="/user/profile/edit">
                <button className="mt-1 text-xs text-gray-500 hover:text-green-600 flex items-center gap-1 transition">
                  <EditOutlined className="text-[12px]" /> Sửa Hồ Sơ
                </button>
              </Link>
            </div>

            {/* User Menu */}
            <nav className="flex flex-col gap-2 text-gray-700">
              <button
                onClick={() => navigate('/user/order')}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-green-100 hover:text-green-600 transition text-sm font-medium"
              >
                <ShoppingCartOutlined /> Đơn Mua
              </button>
              <Link to="/user/coupon">
                <button className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-green-100 hover:text-green-600 transition text-sm font-medium">
                  <GiftOutlined /> Kho Voucher
                </button>
              </Link>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 bg-white">
            <div className="px-8 py-6 text-sm">
              <Outlet context={user} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default User;

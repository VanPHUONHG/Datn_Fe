import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById } from "services/user/user.service";
import type { User } from "types/user";
import { ShieldCheck, ShieldX, UserCircle, ArrowLeft } from "lucide-react";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserById(id!);
        setUser(data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết người dùng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <p className="text-center py-4">Đang tải...</p>;
  if (!user) return <p className="text-center py-4 text-red-500">Không tìm thấy người dùng</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-4xl p-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-green-600">Chi tiết tài khoản</h2>
          <UserCircle className="text-green-500 w-10 h-10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 text-[15px]">
          <div>
            <p className="text-gray-500 font-semibold mb-1">Họ tên</p>
            <p className="text-gray-800 font-medium">{user.full_name}</p>
          </div>
          <div>
            <p className="text-gray-500 font-semibold mb-1">Tên đăng nhập</p>
            <p className="text-gray-800 font-medium">{user.username}</p>
          </div>
          <div>
            <p className="text-gray-500 font-semibold mb-1">Email</p>
            <p className="text-gray-800 font-medium">{user.email || "(Chưa có)"}</p>
          </div>
          <div>
            <p className="text-gray-500 font-semibold mb-1">Số điện thoại</p>
            <p className="text-gray-800 font-medium">{user.phone}</p>
          </div>
          <div>
            <p className="text-gray-500 font-semibold mb-1">Địa chỉ</p>
            <p className="text-gray-800 font-medium">{user.address}</p>
          </div>
          <div>
            <p className="text-gray-500 font-semibold mb-1">Vai trò</p>
            <p className="text-gray-800 font-medium">{user.role === "admin" ? "Admin" : "Khách hàng"}</p>
          </div>
          <div>
            <p className="text-gray-500 font-semibold mb-1">Trạng thái</p>
            {user.status === "banned" ? (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-600 text-sm rounded-full">
                <ShieldX size={16} /> Bị khóa
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-600 text-sm rounded-full">
                <ShieldCheck size={16} /> Hoạt động
              </span>
            )}
          </div>
          <div>
            <p className="text-gray-500 font-semibold mb-1">Ngày tạo</p>
            <p className="text-gray-800 font-medium">
              {new Date(user.created_at).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>

        {/* Nút quay lại */}
        <div className="mt-10 text-right">
          <button
            onClick={() => navigate("/admin/user-list")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition"
          >
            <ArrowLeft size={16} />
            Quay lại danh sách
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;

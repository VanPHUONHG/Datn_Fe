import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllUsers } from "services/user/user.service";
import type { User } from "types/user";

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        console.log("👀 Kết quả từ getAllUsers trong UserList.tsx:", res);
        setUsers(res);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p className="text-center py-5">Đang tải...</p>;

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-green-600">Danh sách khách hàng</h2>
      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="px-3 py-2 border">STT</th>
            <th className="px-3 py-2 border">Họ tên</th>
            <th className="px-3 py-2 border">Email</th>
            <th className="px-3 py-2 border">SĐT</th>
            <th className="px-3 py-2 border">Trạng thái</th>
            <th className="px-3 py-2 border">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) &&
            users
              .filter((user) => user.role !== "admin")
              .map((user, index) => (
                <tr key={user._id} className="text-center border-t">
                  <td className="px-3 py-2 border">{index + 1}</td>
                  <td className="px-3 py-2 border">{user.full_name}</td>
                  <td className="px-3 py-2 border">{user.email}</td>
                  <td className="px-3 py-2 border">{user.phone}</td>
                  <td className="px-3 py-2 border">
                    <span
                      className={`px-2 py-1 rounded-full text-white text-xs ${
                        user.status === "banned" ? "bg-red-500" : "bg-green-500"
                      }`}
                    >
                      {user.status === "banned" ? "Bị khóa" : "Hoạt động"}
                    </span>
                  </td>
                  <td className="px-3 py-2 border">
                    <div className="flex justify-center items-center gap-3">
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                        onClick={() => navigate(`/admin/user-detail/${user._id}`)}
                      >
                        Chi tiết
                      </button>
                      <Link to={`/admin/user-edit/${user._id}`}>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                          Sửa
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;

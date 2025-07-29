import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllUsers } from "services/user/user.service";
import type { User } from "types/user";

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Lọc tìm kiếm và trạng thái
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 20;

  // Fetch dữ liệu người dùng
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

  // Reset về trang đầu khi lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  if (loading) return <p className="text-center py-5">Đang tải...</p>;

  // Lọc danh sách
  const filteredUsers = users
    .filter((user) => user.role !== "admin")
    .filter((user) => {
      const keyword = search.toLowerCase();
      return (
        user.full_name?.toLowerCase().includes(keyword) ||
        user.email?.toLowerCase().includes(keyword) ||
        user.phone?.toLowerCase().includes(keyword)
      );
    })
    .filter((user) => {
      if (statusFilter === "all") return true;
      return statusFilter === "active"
        ? user.status !== "banned"
        : user.status === "banned";
    });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-green-600">Danh sách khách hàng</h2>

      {/* Bộ lọc */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, email, SĐT"
          className="border px-3 py-1 rounded w-full sm:w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border px-3 py-1 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="banned">Bị khóa</option>
        </select>
      </div>

      {/* Bảng dữ liệu */}
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
          {currentUsers.map((user, index) => (
            <tr key={user._id} className="text-center border-t">
              <td className="px-3 py-2 border">{startIndex + index + 1}</td>
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

      {/* Phân trang */}
     {totalPages > 1 && (
  <div className="flex justify-center mt-4 gap-2 flex-wrap">
    {/* Previous « */}
    <button
      className="px-3 py-1 rounded border bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
    >
      «
    </button>

    {/* Page numbers */}
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <button
        key={page}
        className={`px-3 py-1 rounded border ${
          currentPage === page
            ? "bg-green-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
        onClick={() => setCurrentPage(page)}
      >
        {page}
      </button>
    ))}

    {/* Next » */}
    <button
      className="px-3 py-1 rounded border bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
    >
      »
    </button>
  </div>
)}

    </div>
  );
};

export default UserList;

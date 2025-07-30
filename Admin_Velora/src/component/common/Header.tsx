import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const AdminHeader = () => {
  const [adminUser, setAdminUser] = useState<{ full_name: string } | null>(null);

  useEffect(() => {
    const adminUserStr = localStorage.getItem("user_admin");
    if (adminUserStr) {
      const user = JSON.parse(adminUserStr);
      setAdminUser(user);
    } else {
      setAdminUser(null);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("token_admin");
    localStorage.removeItem("user_admin");
    window.location.href = "/admin/login";
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="bg-gradient-to-r from-blue-100 via-white to-blue-100 w-full shadow-md flex p-4 relative z-50 border-b border-blue-100">
<div className="logo w-1/5 font-bold text-2xl text-blue-700 tracking-wide ml-4 hover:scale-105 transition-transform duration-200">
  Velora
</div>

      <div className="right-header w-4/5 flex justify-end items-center">
        <div className="flex items-center gap-6">
          {adminUser ? (
            <>
              <ul>
                <li className="text-gray-700 font-medium">👋 Xin chào <span className="font-semibold text-blue-600">{adminUser.full_name}</span></li>
              </ul>

              <div
                onClick={handleLogout}
                className="flex items-center space-x-2 cursor-pointer hover:text-red-600 select-none transition duration-200 ease-in-out"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleLogout()}
              >
                <i className="fas fa-sign-out-alt text-[20px]"></i>
                <div className="leading-none">
                  <div className="text-gray-600">Account</div>
                  <div
                    className="font-semibold text-[13px] text-red-500 hover:underline"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    ĐĂNG XUẤT
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Link
              to="/admin/login"
              className="text-blue-600 font-medium hover:underline transition duration-150"
            >
              LOGIN
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;

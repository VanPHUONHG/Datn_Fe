
import React, { useState } from 'react';
import { resetPassword } from '../../api/authAPI';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    username: '',
    full_name: '',
    phone: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      return message.error('Mật khẩu xác nhận không khớp!');
    }

    try {
      await resetPassword(form);
      message.success('Đổi mật khẩu thành công!');
      navigate('/login');
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Lỗi đặt lại mật khẩu');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden flex max-w-4xl w-full">
 
        <div
          className="hidden md:block w-1/2 bg-cover bg-center"
          style={{ backgroundImage: "url('https://bizweb.dktcdn.net/100/413/756/products/nike-court-royale-white-833535-1-5.jpg?v=1710902986493')" }}
        ></div>

        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-2">Khôi phục mật khẩu</h2>
          <p className="text-center text-gray-500 mb-6">Vui lòng điền chính xác thông tin để đặt lại mật khẩu</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: 'email', type: 'email', placeholder: 'Email' },
              { name: 'username', type: 'text', placeholder: 'Tên người dùng' },
              { name: 'full_name', type: 'text', placeholder: 'Họ và tên' },
              { name: 'phone', type: 'text', placeholder: 'Số điện thoại' },
              { name: 'newPassword', type: 'password', placeholder: 'Mật khẩu mới' },
              { name: 'confirmPassword', type: 'password', placeholder: 'Xác nhận mật khẩu mới' },
            ].map((field) => (
              <input
                key={field.name}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={(form as any)[field.name]}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-blue-400"
              />
            ))}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              Đặt lại mật khẩu
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500 italic">
            “Bảo vệ tài khoản của bạn – Mỗi mật khẩu là một chiếc chìa khóa.”
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

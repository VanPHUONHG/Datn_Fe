
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
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-6"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">Khôi phục mật khẩu</h2>

      {[
        { name: 'email', type: 'email', placeholder: 'Email' },
        { name: 'username', type: 'text', placeholder: 'Tên người dùng' },
        { name: 'full_name', type: 'text', placeholder: 'Họ tên' },
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
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ))}

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200"
      >
        Đặt lại mật khẩu
      </button>
    </form>
  );
};

export default ForgotPassword;

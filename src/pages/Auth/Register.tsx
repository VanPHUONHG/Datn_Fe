
import React, { useState } from 'react';
import { signup } from '../../api/authAPI';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

const Register: React.FC = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    full_name: '',
    phone: '',
    address: '',
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await signup(form);
       message.success('Đăng ký thành công!');
      console.log(res.data);
      navigate('/login'); 
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Lỗi đăng ký');
    }
  };

  return (
<form
  onSubmit={handleSubmit}
  className="max-w-md mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-6"
>
  <h2 className="text-2xl font-bold text-center text-gray-800">Đăng ký tài khoản</h2>

  <input
    name="username"
    placeholder="Tên người dùng"
    value={form.username}
    onChange={handleChange}
    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  <input
    name="email"
    placeholder="Email"
    type="email"
    value={form.email}
    onChange={handleChange}
    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  <input
    name="password"
    type="password"
    placeholder="Mật khẩu"
    value={form.password}
    onChange={handleChange}
    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  <input
    name="full_name"
    placeholder="Họ tên"
    value={form.full_name}
    onChange={handleChange}
    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  <input
    name="phone"
    placeholder="Số điện thoại"
    value={form.phone}
    onChange={handleChange}
    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  <input
    name="address"
    placeholder="Địa chỉ"
    value={form.address}
    onChange={handleChange}
    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  <button
    type="submit"
    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200"
  >
    Đăng ký
  </button>
</form>

  );
};

export default Register;

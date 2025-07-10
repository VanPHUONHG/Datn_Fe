import React, { useState } from 'react';
import { login } from '../../api/authAPI';
import { Link, useNavigate } from 'react-router-dom';
import { message } from 'antd';

const Login: React.FC = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      window.dispatchEvent(new Event('storageChanged'));

      message.success('Đăng nhập thành công!');
      navigate('/');
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Lỗi đăng nhập');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-6"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">Đăng nhập</h2>

      <input
        name="username"
        placeholder="Tên người dùng"
        value={form.username}
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

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200"
      >
        Đăng nhập
      </button>
      <p className="text-sm text-center text-blue-600 hover:underline mt-2">
        <Link to="/forgot-password">Quên mật khẩu?</Link>
      </p>
    </form>
  );
};

export default Login;

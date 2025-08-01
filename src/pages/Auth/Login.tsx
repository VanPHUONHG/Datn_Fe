import React, { useState } from 'react';
import { login } from '../../api/authAPI';
import { Link, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

const Login: React.FC = () => {
  const [form, setForm] = useState({ username: '', password: '' });
   const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden flex max-w-4xl w-full">

        <div
          className="hidden md:block w-1/2 bg-cover bg-center"
          style={{ backgroundImage: "url('http://localhost:8888/uploads/1752035084665-82711886.webp')" }}
        ></div>


        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-2">Chào mừng bạn trở lại</h2>
          <p className="text-center text-gray-500 mb-6">Đăng nhập để tiếp tục sử dụng dịch vụ</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="username"
              placeholder="Tên người dùng"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-blue-400"
            />

            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Mật khẩu"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-blue-400"
              />
              <div
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
    {showPassword ? <EyeInvisibleOutlined style={{ fontSize: 20 }} /> : <EyeOutlined style={{ fontSize: 20 }} />}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              Đăng nhập
            </button>

            <div className="flex justify-between text-sm mt-2">
              <Link to="/forgot-password" className="text-blue-600 hover:underline">
                Quên mật khẩu?
              </Link>
              <Link to="/register" className="text-blue-600 hover:underline">
                Chưa có tài khoản?
              </Link>
            </div>
          </form>


          <div className="mt-6 text-center text-sm text-gray-500 italic">
            “An toàn, nhanh chóng, và luôn đồng hành cùng bạn.”
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

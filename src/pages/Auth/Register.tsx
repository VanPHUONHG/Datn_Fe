
import React, { useState } from 'react';
import { signup } from '../../api/authAPI';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

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
const [showPassword, setShowPassword] = useState(false);

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
   <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden flex max-w-4xl w-full">
     
        <div
          className="hidden md:block w-1/2 bg-cover bg-center"
          style={{ backgroundImage: "url('http://localhost:8888/uploads/1751967850310-916565802.avif')" }}
        ></div>

        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-2">Tạo tài khoản mới</h2>
          <p className="text-center text-gray-500 mb-6">Tham gia cùng chúng tôi để trải nghiệm dịch vụ tuyệt vời!</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: 'username', placeholder: 'Tên người dùng' },
              { name: 'email', placeholder: 'Email', type: 'email' },
              { name: 'full_name', placeholder: 'Họ và tên' },
              { name: 'phone', placeholder: 'Số điện thoại' },
              { name: 'address', placeholder: 'Địa chỉ' },
            ].map((field) => (
              <input
                key={field.name}
                name={field.name}
                placeholder={field.placeholder}
                type={field.type || 'text'}
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-blue-400"
              />
            ))}

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
              Đăng ký
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500 italic">
            “Cùng bạn tạo dựng tương lai số — An toàn, nhanh chóng và tiện lợi.”
          </div>
        </div>
      </div>
    </div>

  );
};

export default Register;

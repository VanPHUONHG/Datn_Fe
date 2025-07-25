import React, { useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { sendOtp, verifyOtp } from 'api/authAPI';

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [otpData, setOtpData] = useState({ otp: '', newPassword: '', confirmPassword: '' });
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) return message.error('Vui lòng nhập email');
    try {
      await sendOtp(email);
      message.success('Đã gửi mã OTP tới email');
      setStep(2);
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Lỗi gửi OTP');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { otp, newPassword, confirmPassword } = otpData;
    if (newPassword !== confirmPassword) {
      return message.error('Mật khẩu xác nhận không khớp');
    }

    try {
      await verifyOtp({ email, otp, newPassword });
      message.success('Đặt lại mật khẩu thành công!');
      navigate('/login');
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Lỗi xác minh OTP');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden flex max-w-4xl w-full">
        <div
          className="hidden md:block w-1/2 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://bizweb.dktcdn.net/100/413/756/products/nike-court-royale-white-833535-1-5.jpg?v=1710902986493')",
          }}
        ></div>

        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-2">
            {step === 1 ? 'Gửi OTP qua Email' : 'Xác minh OTP'}
          </h2>
          <p className="text-center text-gray-500 mb-6">
            {step === 1
              ? 'Nhập email đã đăng ký để nhận mã OTP'
              : 'Nhập mã OTP và mật khẩu mới'}
          </p>

          {step === 1 ? (
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button
                onClick={handleSendOtp}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all"
              >
                Gửi mã OTP
              </button>
            </div>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <input
                type="text"
                name="otp"
                placeholder="Nhập mã OTP"
                value={otpData.otp}
                onChange={(e) => setOtpData({ ...otpData, otp: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              />
              <input
                type="password"
                placeholder="Mật khẩu mới"
                value={otpData.newPassword}
                onChange={(e) => setOtpData({ ...otpData, newPassword: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              />
              <input
                type="password"
                placeholder="Xác nhận mật khẩu mới"
                value={otpData.confirmPassword}
                onChange={(e) => setOtpData({ ...otpData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl"
              >
                Đặt lại mật khẩu
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-gray-500 italic">
            “Bảo vệ tài khoản của bạn – Mỗi mật khẩu là một chiếc chìa khóa.”
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

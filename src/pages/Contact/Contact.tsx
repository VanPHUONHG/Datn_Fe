
import React from "react";

const Contact = () => {
  return (
    <div className="bg-gray-50 py-10 px-4">
      <div className="container mx-auto max-w-6xl bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row">
        {/* Thông tin thương hiệu */}
        <div className="md:w-1/2 p-8">
          <h1 className="text-2xl font-bold mb-4 text-blue-600">
            Về thương hiệu chúng tôi
          </h1>
          <p className="text-gray-700 mb-4">
            <strong>Velora</strong> là shop giày thời trang hiện đại, 
            mang đến những thiết kế năng động, tinh tế và chất lượng cao, phục vụ cho giới trẻ yêu thích phong cách sống hiện đại và linh hoạt.
          </p>
          <p className="text-gray-700 mb-4">
            Chúng tôi cam kết không chỉ cung cấp sản phẩm tốt, mà còn mang lại trải nghiệm mua sắm trực tuyến tiện lợi, nhanh chóng và an toàn cho khách hàng trên toàn quốc.
          </p>
          <p className="text-gray-700 mb-6">
            Cảm ơn bạn đã tin tưởng lựa chọn Velora. Mọi thắc mắc, góp ý vui lòng liên hệ với chúng tôi qua thông tin dưới đây:
          </p>

          <div className="space-y-4 text-sm text-gray-700">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 mt-0.5 text-blue-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M17.657 16.657L13.414 12l4.243-4.243m-2.828-2.829a6 6 0 00-8.486 0L3 10.586a2 2 0 000 2.828l7.071 7.071a2 2 0 002.828 0l5.657-5.657a6 6 0 000-8.486z" />
              </svg>
              <p className="ml-3">86 Đội Cấn, P. Liễu Giai, Q. Ba Đình, Hà Nội</p>
            </div>
            <div className="flex items-start">
              <svg
                className="w-5 h-5 mt-0.5 text-blue-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M16 12H8m0 0l4 4m-4-4l4-4m8 8V8a2 2 0 00-2-2h-3.172a2 2 0 01-1.414-.586L10.586 3.414A2 2 0 009.172 3H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2z" />
              </svg>
              <p className="ml-3">support@velora.vn</p>
            </div>
            <div className="flex items-start">
              <svg
                className="w-5 h-5 mt-0.5 text-blue-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.077 3.23a1 1 0 01-.217.976l-2.196 2.196a11.042 11.042 0 005.516 5.516l2.196-2.196a1 1 0 01.976-.217l3.23 1.077A1 1 0 0121 17.72V21a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
              </svg>
              <p className="ml-3">087 8888 907</p>
            </div>
          </div>
        </div>

        {/* Google Map */}
        <div className="md:w-1/2 h-96 md:h-auto">
          <iframe
            className="w-full h-full"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.8901342052835!2d105.8271458148398!3d21.03581168599687!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab58e6e6db29%3A0xf7f63ea9f3b0328!2zMjY2IERvw6BuLCBQLiDhu5lp4buHbiBHdeG7k3rhu5x1IEjhuqF0IE1pbmddodG7h3Q!5e0!3m2!1svi!2s!4v1636049960480!5m2!1svi!2s"
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;

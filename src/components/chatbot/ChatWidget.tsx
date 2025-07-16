import React, { useEffect, useState } from "react";

interface ChatWidgetProps {
  onToggle: () => void;
  isOpen: boolean; // 👈 thêm prop này
  isTalkingToAdmin: boolean;   // ✅ thêm dòng này
  onEndChat: () => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ onToggle, isOpen }) => {
  const [show, setShow] = useState(false);
  const [wave, setWave] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
      setWave(true);
      setTimeout(() => setWave(false), 1200);
    }, 300);
  }, []);

  return (
    <div
      onClick={onToggle}
      className={`mb-5 fixed bottom-12 right-4 z-50 cursor-pointer group w-[100px] h-[100px] flex flex-col items-center transition-transform duration-300 ${show ? "animate-slide-in-right" : "opacity-0"
        } ${isOpen ? "translate-x-28" : ""}`} // 👈 dịch robot sang phải khi mở
    >
      {/* Speech bubble - chỉ hiển thị khi isOpen = false */}
      {!isOpen && (
        <div className="relative mb-2 px-3 py-1 rounded-xl bg-white border border-blue-500 text-sm text-gray-800 shadow group-hover:opacity-100 opacity-0 transition-opacity duration-300">
          Bạn cần hỗ trợ gì?
          <div className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-3 h-3 bg-white border-l border-b border-blue-500 rotate-45"></div>
        </div>
      )}

      {/* Robot image */}
      <img
        src="/image/chatbot.png"
        alt="chatbot"
        className={`w-20 h-20 object-contain ${wave ? "animate-wave-hand" : "animate-bounce-slow"
          }`}
      />
    </div>
  );
};


export default ChatWidget;

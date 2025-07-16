//hiển thị giao diện chat (tin nhắn, input).

import React, { useEffect, useRef } from "react";
import { LuSendHorizontal } from "react-icons/lu";
import MessageItem from "./MessageItem";

interface Variant {
  size: number;
  price: number;
  discount_price?: number;
  color: string;
  image: string;
  product_id: {
    _id: string;
    name: string;
    brand: string;
  };
}

interface Message {
  from: "user" | "bot";
  type?: "text" | "product";
  text?: string;
  products?: Variant[];
}

interface ChatWindowProps {
  messages: Message[];
  input: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onQuickSend: (text: string) => void;
  onClose: () => void;
  isTalkingToAdmin: boolean;
  onEndChat: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  input,
  onChange,
  onSend,
  onQuickSend,
  onClose,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-2 flex justify-between items-center rounded-t-2xl">
        <h2 className="text-xl font-semibold">Chat tư vấn</h2>
        <button
          onClick={onClose}
          className="text-white text-xl font-bold hover:scale-125 transition transform"
          title="Đóng"
        >
          −
        </button>
      </div>

      {/* Quick Button */}
      <div className="mt-3 mx-4 mb-2">
        <button
          onClick={() => onQuickSend("Tôi muốn gặp nhân viên tư vấn")}
          className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition"
        >
          💬 Tôi muốn được tư vấn
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 scrollbar-thin scrollbar-thumb-emerald-400">
        {messages.map((msg, index) => (
          <div key={index}>
            {msg.type === "text" && (
              <MessageItem from={msg.from} text={msg.text || ""} />
            )}
            {msg.type === "product" &&
              Array.isArray(msg.products) &&
              msg.products.length > 0 && (
                <div className="space-y-3">
                  {msg.products.map((v, i) => (
                    <div
                      key={i}
                      className="border rounded-xl p-3 bg-gray-50 shadow-sm text-sm"
                    >
                      <a
                        href={`/product/${v.product_id._id}`}
                        className="block group"
                      >
                        <div className="flex gap-3">
                          <img
                            src={v.image || "/no-image.png"}
                            alt={v.product_id.name}
                            className="w-32 h-24 object-cover rounded-lg group-hover:opacity-90 transition"
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-base">
                              {v.product_id.name}
                            </div>
                            <div className="text-gray-600">
                              Màu: {v.color} – Size: {v.size}
                            </div>
                            {v.discount_price ? (
                              <div>
                                <div className="text-gray-400 line-through text-sm">
                                  {v.price.toLocaleString()}đ
                                </div>
                                <div className="text-red-600 font-bold text-lg">
                                  {v.discount_price.toLocaleString()}đ
                                </div>
                              </div>
                            ) : (
                              <div className="text-red-600 font-bold text-lg">
                                {v.price.toLocaleString()}đ
                              </div>
                            )}
                          </div>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              )}
          </div>
        ))}

        {/* ✅ Đặt ref ở đây - cuối danh sách tin nhắn */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t flex items-center gap-2 bg-white">
        <input
          value={input}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSend();
          }}
          className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          placeholder="Nhập tin nhắn..."
        />

        <button
          onClick={onSend}
          className="p-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition"
        >
          <LuSendHorizontal size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;

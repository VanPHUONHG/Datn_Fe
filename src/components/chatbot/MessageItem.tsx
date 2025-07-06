import React from "react";

interface Props {
  from: "user" | "bot";
  text: string;
}

const MessageItem: React.FC<Props> = ({ from, text }) => {
  const isUser = from === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] px-3 py-2 rounded-lg text-sm ${
          isUser ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        {text}
      </div>
    </div>
  );
};

export default MessageItem;

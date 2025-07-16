import React, { useState, useRef, useEffect } from 'react';
import { Send, X } from 'lucide-react';
import { notification } from 'antd';
import socket from 'socket';

interface Message {
    from: 'user' | 'admin';
    content: string;
}

interface SupportRequest {
    username: string;
    message: string;
}

interface User {
    username: string;
    message: string;
}

const Chat = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Tự động lắng nghe socket user_support_request
    useEffect(() => {
        if (!socket.connected) {
            socket.connect(); // 👈 đảm bảo kết nối socket
        }

        // Khi socket kết nối thành công
        const handleConnect = () => {
            console.log("✅ Admin connected to socket server with ID:", socket.id);
        };

        // Khi nhận yêu cầu tư vấn từ người dùng
        const handleSupportRequest = (data: SupportRequest) => {
            console.log("📨 Nhận user_support_request từ:", data.username);

            notification.open({
                message: `Yêu cầu tư vấn từ ${data.username}`,
                description: data.message,
                duration: 5,
            });

            // Thêm vào danh sách user nếu chưa có
            setUsers((prev) => {
                const exists = prev.find((u) => u.username === data.username);
                if (exists) return prev;
                return [...prev, { username: data.username, message: data.message }];
            });

            // Nếu đang chat với user này thì append tin nhắn mới
            if (selectedUser?.username === data.username) {
                setMessages((prev) => [...prev, { from: 'user', content: data.message }]);
            }

            // Nếu chưa chọn ai, thì chọn user này mặc định
            if (!selectedUser) {
                setSelectedUser({ username: data.username, message: data.message });
                setMessages([
                    { from: 'user', content: data.message },
                    { from: 'admin', content: 'Chào bạn! Vui lòng cung cấp mã đơn hàng để kiểm tra.' },
                ]);
            }
        };

        socket.on("connect", handleConnect);
        socket.on("user_support_request", handleSupportRequest);

        return () => {
            socket.off("connect", handleConnect);
            socket.off("user_support_request", handleSupportRequest);
        };
    }, [selectedUser]);

    const handleSend = () => {
        if (!input.trim() || !selectedUser) return;

        const newMessage: Message = { from: 'admin', content: input };
        setMessages((prev) => [...prev, newMessage]);
        setInput('');

        // Gửi socket ngược lại nếu muốn:
        socket.emit('admin_reply', {
            toUser: selectedUser.username,
            message: input,
        });
    };

    return (
        <div className="flex h-[90vh] max-h-[90vh] bg-white rounded-lg overflow-hidden shadow-lg">
            {/* Sidebar khách hàng */}
            <div className="w-80 border-r border-gray-200 bg-gray-50 p-4 space-y-4 overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">Khách hàng</h2>
                <ul className="space-y-2">
                    {users.length > 0 ? (
                        users.map((user, index) => (
                            <li
                                key={index}
                                onClick={() => {
                                    setSelectedUser(user);
                                    setMessages([
                                        { from: 'user', content: user.message },
                                        { from: 'admin', content: 'Chào bạn! Vui lòng cung cấp mã đơn hàng để kiểm tra.' },
                                    ]);
                                }}
                                className={`p-3 rounded-lg shadow cursor-pointer transition ${selectedUser?.username === user.username
                                        ? 'bg-blue-100'
                                        : 'bg-white hover:bg-blue-50'
                                    }`}
                            >
                                {user.username}
                            </li>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 italic">Chưa có khách nào yêu cầu.</p>
                    )}
                </ul>
            </div>

            {/* Giao diện chat */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
                    {selectedUser ? (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">{selectedUser.username}</h3>
                            <p className="text-sm text-gray-500">Đang hoạt động</p>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic">Chưa chọn khách hàng</p>
                    )}
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => {
                            setSelectedUser(null);
                            setMessages([]);
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Nội dung chat */}
                <div className="flex-1 px-6 py-4 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="space-y-3">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.from === 'admin' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm shadow-md ${msg.from === 'admin'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-800 border'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input chat */}
                <div className="flex items-center gap-3 px-6 py-4 border-t bg-white">
                    <input
                        type="text"
                        className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập tin nhắn..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        disabled={!selectedUser}
                    />
                    <button
                        onClick={handleSend}
                        className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
                        disabled={!selectedUser}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;

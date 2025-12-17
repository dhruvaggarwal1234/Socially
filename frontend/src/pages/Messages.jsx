import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Avatar, Input, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { socket } from "../socket"; // ✅ make sure this file exists

const { TextArea } = Input;

export default function Messages() {
  const { receiverId } = useParams();
  const { currentUser, accessToken } = useSelector(
    (state) => state.user
  );

  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  // ⛔ No user selected
  if (!receiverId) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a conversation
      </div>
    );
  }

  // ================= FETCH CHAT =================
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const [msgRes, userRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_API_URL}/messages/${receiverId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          ),
          axios.get(
            `${import.meta.env.VITE_API_URL}/users/${receiverId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          ),
        ]);

        setMessages(msgRes.data.result || []);
        setReceiver(userRes.data);
      } catch (err) {
        console.error("Chat fetch error", err);
      }
    };

    fetchChat();
  }, [receiverId, accessToken]);

  // ================= SOCKET LISTENER =================
  useEffect(() => {
    socket.on("newMessage", (message) => {
      if (
        message.senderId === receiverId ||
        message.senderId === currentUser._id
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => socket.off("newMessage");
  }, [receiverId, currentUser._id]);

  // ================= AUTO SCROLL =================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // ================= SEND MESSAGE =================
  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/messages/${receiverId}`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setMessages((prev) => [...prev, res.data.result]);
      setText("");
    } catch (err) {
      console.error("Send message error", err);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* ================= HEADER ================= */}
      <div className="flex items-center gap-3 px-5 py-4 border-b">
        <Avatar size={42} src={receiver?.profilePhoto} />
        <div>
          <p className="font-semibold">{receiver?.fullname}</p>
          <p className="text-xs text-gray-400">Chat</p>
        </div>
      </div>

      {/* ================= MESSAGES ================= */}
      <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50 space-y-3">
        {messages.map((msg) => {
          const isMe =
            msg.senderId === currentUser._id ||
            msg.senderId?._id === currentUser._id;

          return (
            <div
              key={msg._id}
              className={`flex ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                  isMe
                    ? "bg-blue-600 text-white"
                    : "bg-white border"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* ================= INPUT ================= */}
      <div className="flex items-center gap-3 px-4 py-3 border-t">
        <TextArea
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onPressEnter={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          placeholder="Type a message..."
          autoSize={{ minRows: 1, maxRows: 4 }}
        />

        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={sendMessage}
          disabled={!text.trim()}
        />
      </div>
    </div>
  );
}

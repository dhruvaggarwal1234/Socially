import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Avatar, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { socket } from "../socket";

export default function MessagesList() {
  const navigate = useNavigate();
  const { accessToken, currentUser } = useSelector(
    (state) => state.user
  );

  const [conversations, setConversations] = useState([]);
  const [search, setSearch] = useState("");

  // 📡 FETCH CONVERSATIONS
  useEffect(() => {
    const fetchConversations = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/messages`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setConversations(res.data.result || []);
    };

    fetchConversations();
  }, [accessToken]);

  // 🔥 SOCKET LISTENER (THIS FIXES REFRESH ISSUE)
  useEffect(() => {
    socket.on("newMessage", (message) => {
      setConversations((prev) => {
        const convIndex = prev.findIndex(
          (c) => c._id === message.conversationId
        );

        let updated = [...prev];

        if (convIndex !== -1) {
          // update lastMessage + move to top
          updated[convIndex] = {
            ...updated[convIndex],
            lastMessage: message,
            updatedAt: message.createdAt,
          };

          const conv = updated.splice(convIndex, 1)[0];
          return [conv, ...updated];
        }

        return prev;
      });
    });

    return () => socket.off("newMessage");
  }, []);

  // 🔍 FILTER
  const filtered = useMemo(() => {
    return conversations.filter((c) =>
      c.participants[0]?.fullname
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, conversations]);

  return (
    <div className="h-full flex flex-col border-r bg-white">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Messages</h2>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search people..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-3"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            No conversations
          </div>
        ) : (
          filtered.map((conv) => {
            const user = conv.participants[0];

            return (
              <div
                key={conv._id}
                onClick={() =>
                  navigate(`/messages/${user._id}`)
                }
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100"
              >
                <Avatar src={user?.profilePhoto} />
                <div className="flex-1">
                  <p className="font-medium truncate">
                    {user?.fullname || "Deleted User"}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {conv.lastMessage?.text ||
                      "Start conversation"}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

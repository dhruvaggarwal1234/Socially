import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Feeds from "../components/Feeds";
import { Typography } from "antd";

const { Title } = Typography;

const Bookmarks = () => {
  const { accessToken } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBookmarks = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/bookmarks`, // ✅ FIXED
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            withCredentials: true,
          }
        );

        // backend already returns populated posts
        setPosts(res.data.bookmarks);
      } catch (err) {
        console.log("Bookmark fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [accessToken]);

  return (
    <div>
      <Title level={3}>Saved Posts</Title>

      {loading ? (
        <div className="text-gray-500">Loading bookmarks...</div>
      ) : (
        <Feeds posts={posts} />
      )}
    </div>
  );
};

export default Bookmarks;

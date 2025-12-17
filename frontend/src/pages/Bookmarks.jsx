import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Feeds from "../components/Feeds";
import { Typography } from "antd";

const { Title } = Typography;

const Bookmarks = () => {
  const { accessToken } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/bookmark`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            withCredentials: true,
          }
        );

        // 🔥 mark bookmarked posts
        const bookmarkedPosts = res.data.bookmarks.map((post) => ({
          ...post,
          isBookmarked: true,
        }));

        setPosts(bookmarkedPosts);
      } catch (err) {
        console.log("Bookmark fetch error:", err);
      }
    };

    fetchBookmarks();
  }, [accessToken]);

  return (
    <div>
      <Title level={3}>Saved Posts</Title>
      <Feeds posts={posts} />
    </div>
  );
};

export default Bookmarks;

import { useEffect, useState } from "react";
import { Tooltip } from "antd";
import { BookOutlined, BookFilled } from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";

const BookmarkButton = ({ postId, initialBookmarked }) => {
  const { accessToken } = useSelector((state) => state.user);
  const [bookmarked, setBookmarked] = useState(initialBookmarked);

  useEffect(() => {
    setBookmarked(initialBookmarked);
  }, [initialBookmarked]);

  const toggleBookmark = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/posts/${postId}/bookmark`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        }
      );

      setBookmarked((prev) => !prev);
    } catch (err) {
      console.log("Bookmark error:", err);
    }
  };

  return (
    <Tooltip title={bookmarked ? "Remove bookmark" : "Save post"}>
      <span onClick={toggleBookmark} className="cursor-pointer">
        {bookmarked ? (
          <BookFilled style={{ fontSize: 18 }} />
        ) : (
          <BookOutlined style={{ fontSize: 18 }} />
        )}
      </span>
    </Tooltip>
  );
};

export default BookmarkButton;

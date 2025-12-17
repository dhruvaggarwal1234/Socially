import { useEffect, useState } from "react";
import { Tooltip } from "antd";
import { BookOutlined, BookFilled } from "@ant-design/icons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../store/user-slice";

const BookmarkButton = ({ postId, initialBookmarked }) => {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.user);
  const [bookmarked, setBookmarked] = useState(!!initialBookmarked);

  useEffect(() => {
    setBookmarked(!!initialBookmarked);
  }, [initialBookmarked]);

  const toggleBookmark = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/posts/${postId}/bookmark`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      setBookmarked(res.data.bookmarked);

      // ✅ UPDATE REDUX (SYNC UI)
      dispatch(userActions.toggleBookmark(postId));
    } catch (err) {
      console.error("Bookmark error:", err.response?.data || err);
    }
  };

  return (
    <Tooltip title={bookmarked ? "Remove bookmark" : "Save post"}>
      <span onClick={toggleBookmark} className="cursor-pointer">
        {bookmarked ? (
          <BookFilled style={{ fontSize: 18, color: "#1677ff" }} />
        ) : (
          <BookOutlined style={{ fontSize: 18, color: "#6b7280" }} />
        )}
      </span>
    </Tooltip>
  );
};

export default BookmarkButton;

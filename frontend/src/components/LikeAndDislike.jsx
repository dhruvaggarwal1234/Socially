import { useState, useEffect } from "react";
import { Space, Typography } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";

const { Text } = Typography;

const LikeAndDislike = ({ postId, likes = [], onLikeUpdate }) => {
  const { accessToken, currentUser } = useSelector(
    (state) => state.user
  );

  const userId = currentUser?._id;

  const [likeList, setLikeList] = useState(
    likes.map((id) => id.toString())
  );
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setLikeList(likes.map((id) => id.toString()));
  }, [likes]);

  const isLiked = likeList.includes(userId);

  const handleLike = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/posts/${postId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        }
      );

      const updatedLikes = res.data.likes.map((id) =>
        id.toString()
      );

      if (!isLiked) {
        setAnimate(true);
        setTimeout(() => setAnimate(false), 200);
      }

      setLikeList(updatedLikes);
      onLikeUpdate(updatedLikes);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Space className="select-none cursor-pointer">
      <span
        onClick={handleLike}
        style={{
          transform: animate ? "scale(1.25)" : "scale(1)",
          transition: "transform 0.2s ease",
          display: "inline-flex",
        }}
      >
        {isLiked ? (
          <HeartFilled style={{ color: "#ff4d4f", fontSize: 18 }} />
        ) : (
          <HeartOutlined style={{ fontSize: 18 }} />
        )}
      </span>

      <Text>{likeList.length}</Text>
    </Space>
  );
};

export default LikeAndDislike;

import { useEffect, useState } from "react";
import {
  Typography,
  Input,
  Button,
  List,
  Avatar,
  Divider,
  Space,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";

const { Text } = Typography;

const Comments = ({ postId, comments = [] }) => {
  const { accessToken } = useSelector((state) => state.user);

  const [commentText, setCommentText] = useState("");
  const [commentList, setCommentList] = useState(comments);

  useEffect(() => {
    setCommentList(comments);
  }, [comments]);

  const addComment = async () => {
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/comments/${postId}`,
        { comment: commentText },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        }
      );

      setCommentList((prev) => [res.data.result, ...prev]);
      setCommentText("");
    } catch (err) {
      console.log("Comment error:", err);
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <Divider orientation="left">Comments</Divider>

      <List
        dataSource={commentList}
        locale={{ emptyText: "No comments yet" }}
        itemLayout="horizontal"
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar
                  src={item.creator?.creatorPhoto}
                  icon={<UserOutlined />}
                />
              }
              title={
                <Text strong>
                  {item.creator?.creatorName || "User"}
                </Text>
              }
              description={item.comment}
            />
          </List.Item>
        )}
      />

      <Space style={{ width: "100%", marginTop: 12 }}>
        <Input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          onPressEnter={addComment}
        />
        <Button type="primary" onClick={addComment}>
          Post
        </Button>
      </Space>
    </div>
  );
};

export default Comments;

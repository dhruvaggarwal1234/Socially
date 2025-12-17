import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Avatar,
  Typography,
  Space,
  Image,
  Divider,
} from "antd";
import { UserOutlined, MessageOutlined } from "@ant-design/icons";

import LikeAndDislike from "./LikeAndDislike";
import Comments from "./Comments";
import BookmarkButton from "./BookmarkButton";
import ShareButton from "./ShareButton";


const { Text, Paragraph } = Typography;

const Feed = ({ post }) => {
  const [postData, setPostData] = useState(post);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    setPostData(post);
  }, [post]);

  const creator =
    postData.creator && typeof postData.creator === "object"
      ? postData.creator
      : null;

  const handleLikeUpdate = (updatedLikes) => {
    setPostData((prev) => ({
      ...prev,
      likes: updatedLikes,
    }));
  };

  return (
    <Card className="!rounded-xl">
      {/* HEADER */}
      <Space align="start">
        <Link to={creator ? `/users/${creator._id}` : "#"}>
          <Avatar
            size={48}
            src={creator?.profilePhoto}
            icon={<UserOutlined />}
          />
        </Link>

        <div>
          <Text strong>{creator?.fullname || "User"}</Text>
          <br />
          <Text type="secondary" className="text-xs">
            {new Date(postData.createdAt).toLocaleString()}
          </Text>
        </div>
      </Space>

      {/* BODY */}
      <Paragraph className="mt-3">{postData.body}</Paragraph>

      {postData.image && (
        <Image src={postData.image} className="rounded-lg" />
      )}

      <Divider />

      {/* ACTIONS ROW */}
   {/* ACTIONS ROW */}
<div className="flex justify-between items-center">
  {/* LEFT ACTIONS */}
  <Space size="large">
    <LikeAndDislike
      postId={postData._id}
      likes={postData.likes}
      onLikeUpdate={handleLikeUpdate}
    />

    <Space
      className="cursor-pointer"
      onClick={() => setShowComments((p) => !p)}
    >
      <MessageOutlined />
      <Text>{postData.comments?.length || 0}</Text>
    </Space>
  </Space>

  {/* RIGHT ACTIONS */}
  <Space size="middle">
    <ShareButton postId={postData._id} />
    <BookmarkButton
      postId={postData._id}
      initialBookmarked={postData.isBookmarked}
    />
  </Space>
</div>


      {/* COMMENTS SECTION (FULL WIDTH, NEXT LINE) */}
      {showComments && (
        <Comments
          postId={postData._id}
          comments={postData.comments}
        />
      )}
    </Card>
  );
};

export default Feed;

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  Avatar,
  Typography,
  Space,
  Image,
  Divider,
  Dropdown,
} from "antd";
import {
  UserOutlined,
  MessageOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import axios from "axios";

import LikeAndDislike from "./LikeAndDislike";
import Comments from "./Comments";
import BookmarkButton from "./BookmarkButton";
import ShareButton from "./ShareButton";

const { Text, Paragraph } = Typography;

const Feed = ({ post }) => {
  const [postData, setPostData] = useState(post);
  const [showComments, setShowComments] = useState(false);

  const navigate = useNavigate();
  const { currentUser, accessToken } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    setPostData(post);
  }, [post]);

  const creator =
    postData.creator && typeof postData.creator === "object"
      ? postData.creator
      : null;

  const isOwner =
    currentUser?._id === creator?._id;

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/posts/${postData._id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      navigate(-1);
    } catch (err) {
      console.error("Delete failed");
    }
  };

  const menuItems = [
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Edit",
      onClick: () =>
        navigate(`/posts/${postData._id}/edit`),
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Delete",
      onClick: handleDelete,
    },
  ];

  const isBookmarked =
    currentUser?.bookmarks?.includes(postData._id);

  return (
    <Card className="!rounded-xl relative">
      {/* HEADER */}
      <div className="flex justify-between">
        <Space align="start">
          <Link to={`/users/${creator?._id}`}>
            <Avatar
              size={48}
              src={creator?.profilePhoto}
              icon={<UserOutlined />}
            />
          </Link>

          <div>
            <Link to={`/users/${creator?._id}`}>
              <Text strong className="hover:underline">
                {creator?.fullname || "User"}
              </Text>
            </Link>
            <br />
            <Text type="secondary" className="text-xs">
              {new Date(postData.createdAt).toLocaleString()}
            </Text>
          </div>
        </Space>

        {/* 3 DOT MENU */}
        {isOwner && (
          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
          >
            <MoreOutlined className="text-xl cursor-pointer" />
          </Dropdown>
        )}
      </div>

      {/* BODY */}
      <Link to={`/posts/${postData._id}`}>
        <Paragraph className="mt-3 cursor-pointer hover:opacity-80">
          {postData.body}
        </Paragraph>

        {postData.image && (
          <Image
            src={postData.image}
            className="rounded-lg"
            preview={false}
          />
        )}
      </Link>

      <Divider />

      {/* ACTIONS */}
      <div className="flex justify-between items-center">
        <Space size="large">
          <LikeAndDislike
            postId={postData._id}
            likes={postData.likes}
          />

          <Space
            className="cursor-pointer"
            onClick={() =>
              setShowComments((p) => !p)
            }
          >
            <MessageOutlined />
            <Text>
              {postData.comments?.length || 0}
            </Text>
          </Space>
        </Space>

        <Space>
          <ShareButton postId={postData._id} />
          <BookmarkButton
            postId={postData._id}
            initialBookmarked={isBookmarked}
          />
        </Space>
      </div>

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

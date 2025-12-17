import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { Popconfirm, message } from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import Feed from "../components/Feed";

const SinglePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken, currentUser } = useSelector(
    (state) => state.user
  );

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/posts/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          }
        );
        setPost(res.data.post);
      } catch (err) {
        setError("Post not found");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, accessToken]);

  // ================= DELETE =================
  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/posts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      message.success("Post deleted");
      navigate(-1);
    } catch (err) {
      message.error("Failed to delete post");
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        {error}
      </div>
    );
  }

  if (!post) return null;

  const isOwner =
    currentUser?._id === post.creator?._id;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* TOP BAR */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-black"
        >
          <ArrowLeftOutlined />
          Back
        </button>

        {/* OWNER ACTIONS */}
        {isOwner && (
          <div className="flex gap-4">
            <button
              className="text-blue-600 hover:text-blue-800"
              onClick={() => navigate(`/posts/${id}/edit`)}
            >
              <EditOutlined /> Edit
            </button>

            <Popconfirm
              title="Delete post?"
              description="This action cannot be undone"
              onConfirm={handleDelete}
              okText="Yes"
              cancelText="No"
            >
              <button className="text-red-600 hover:text-red-800">
                <DeleteOutlined /> Delete
              </button>
            </Popconfirm>
          </div>
        )}
      </div>

      {/* POST */}
      <Feed post={post} />
    </div>
  );
};

export default SinglePost;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { Avatar } from "antd";
import {
  UserAddOutlined,
  UserDeleteOutlined,
  EditOutlined,
  ShareAltOutlined,
  MessageOutlined,
} from "@ant-design/icons";

import Feeds from "../components/Feeds";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, accessToken } = useSelector(
    (state) => state.user
  );

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = currentUser?._id === id;
  const isFollowing =
    user?.followers?.some(
      (followerId) => followerId === currentUser?._id
    );

  // ================= FETCH PROFILE =================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [userRes, postRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_API_URL}/users/${id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          ),
          axios.get(
            `${import.meta.env.VITE_API_URL}/users/${id}/posts`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          ),
        ]);

        setUser(userRes.data);
        setPosts(postRes.data.posts || postRes.data);
      } catch (err) {
        console.error("Profile fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, accessToken]);

  // ================= FOLLOW / UNFOLLOW =================
  const handleFollowToggle = async () => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/${id}/follow-unfollow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // 🔥 OPTIMISTIC UI UPDATE
      setUser((prev) => {
        if (!prev) return prev;

        const alreadyFollowing = prev.followers.includes(
          currentUser._id
        );

        return {
          ...prev,
          followers: alreadyFollowing
            ? prev.followers.filter(
                (fid) => fid !== currentUser._id
              )
            : [...prev.followers, currentUser._id],
        };
      });
    } catch (err) {
      console.error("Follow error", err);
    }
  };

  // ================= SHARE PROFILE =================
  const handleShareProfile = () => {
    const profileUrl = `${window.location.origin}/users/${id}`;
    navigator.clipboard.writeText(profileUrl);
    alert("Profile link copied!");
  };

  if (loading) {
    return (
      <div className="text-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* ================= PROFILE HEADER ================= */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* AVATAR */}
          <Avatar
            size={120}
            src={user.profilePhoto}
            className="border"
          />

          {/* INFO */}
          <div className="flex-1 space-y-3">
            <h2 className="text-2xl font-bold">
              {user.fullname}
            </h2>

            <p className="text-gray-600">
              {user.bio || "No bio yet"}
            </p>

            {/* STATS */}
            <div className="flex gap-6 text-sm">
              <span>
                <strong>{user.followers.length}</strong>{" "}
                Followers
              </span>
              <span>
                <strong>{user.following.length}</strong>{" "}
                Following
              </span>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-3 mt-4">
              {isOwnProfile ? (
                <>
                  <button
                    onClick={() =>
                      navigate("/profile/edit")
                    }
                    className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100"
                  >
                    <EditOutlined /> Edit Profile
                  </button>

                  <button
                    onClick={handleShareProfile}
                    className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100"
                  >
                    <ShareAltOutlined /> Share Profile
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleFollowToggle}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white ${
                      isFollowing
                        ? "bg-gray-500 hover:bg-gray-600"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserDeleteOutlined /> Unfollow
                      </>
                    ) : (
                      <>
                        <UserAddOutlined /> Follow
                      </>
                    )}
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/messages/${id}`)
                    }
                    className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100"
                  >
                    <MessageOutlined /> Message
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= USER POSTS ================= */}
      <div>
        <h3 className="text-xl font-semibold mb-4">
          Posts
        </h3>

        <Feeds posts={posts} />
      </div>
    </div>
  );
};

export default Profile;

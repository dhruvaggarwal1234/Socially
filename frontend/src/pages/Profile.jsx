import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Avatar } from "antd";
import {
  UserAddOutlined,
  UserDeleteOutlined,
  EditOutlined,
  ShareAltOutlined,
  MessageOutlined,
} from "@ant-design/icons";

import Feeds from "../components/Feeds";
import FollowListModal from "../components/FollowListModal";
import { userActions } from "../store/user-slice";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentUser, accessToken } = useSelector(
    (state) => state.user
  );

  // 🔥 allow /users/me
  const resolvedUserId =
    id === "me" || !id ? currentUser?._id : id;

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("followers");
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  const isOwnProfile =
    currentUser?._id === resolvedUserId;

  const isFollowing =
    user?.followers?.includes(currentUser?._id);

  // ================= FETCH PROFILE =================
  const fetchProfile = useCallback(async () => {
    if (!resolvedUserId) return;

    try {
      const [userRes, postRes] = await Promise.all([
        axios.get(
          `${import.meta.env.VITE_API_URL}/users/${resolvedUserId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        ),
        axios.get(
          `${import.meta.env.VITE_API_URL}/users/${resolvedUserId}/posts`,
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
  }, [resolvedUserId, accessToken]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // ================= FOLLOW / UNFOLLOW =================
  const handleFollowToggle = async () => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/${resolvedUserId}/follow-unfollow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // optimistic profile update
      setUser((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          followers: isFollowing
            ? prev.followers.filter(
                (fid) => fid !== currentUser._id
              )
            : [...prev.followers, currentUser._id],
        };
      });

      // update redux user.following
      dispatch(
        userActions.changeCurrentUser({
          ...currentUser,
          following: isFollowing
            ? currentUser.following.filter(
                (fid) => fid !== resolvedUserId
              )
            : [...currentUser.following, resolvedUserId],
        })
      );
    } catch (err) {
      console.error("Follow error", err);
    }
  };

  // ================= FOLLOW MODAL =================
  const openFollowModal = async (tab) => {
    try {
      setActiveTab(tab);
      setModalOpen(true);

      const followerReqs = user.followers.map((id) =>
        axios.get(
          `${import.meta.env.VITE_API_URL}/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
      );

      const followingReqs = user.following.map((id) =>
        axios.get(
          `${import.meta.env.VITE_API_URL}/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
      );

      const [followersRes, followingRes] =
        await Promise.all([
          Promise.all(followerReqs),
          Promise.all(followingReqs),
        ]);

      setFollowersList(followersRes.map((r) => r.data));
      setFollowingList(followingRes.map((r) => r.data));
    } catch (err) {
      console.error("Follow list error", err);
    }
  };

  // ================= SHARE =================
  const handleShareProfile = () => {
    const url = `${window.location.origin}/users/${resolvedUserId}`;
    navigator.clipboard.writeText(url);
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
      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <Avatar
            size={120}
            src={user.profilePhoto}
            className="border"
          />

          <div className="flex-1 space-y-3">
            <h2 className="text-2xl font-bold">
              {user.fullname}
            </h2>

            <p className="text-gray-600">
              {user.bio || "No bio yet"}
            </p>

            {/* STATS */}
            <div className="flex gap-6 text-sm">
              <button
                onClick={() =>
                  openFollowModal("followers")
                }
                className="hover:underline"
              >
                <strong>{user.followers.length}</strong>{" "}
                Followers
              </button>

              <button
                onClick={() =>
                  openFollowModal("following")
                }
                className="hover:underline"
              >
                <strong>{user.following.length}</strong>{" "}
                Following
              </button>
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
                      navigate(
                        `/messages/${resolvedUserId}`
                      )
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

      {/* ================= POSTS ================= */}
      <div>
        <h3 className="text-xl font-semibold mb-4">
          Posts
        </h3>
        <Feeds posts={posts} />
      </div>

      {/* ================= FOLLOW MODAL ================= */}
      <FollowListModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        followers={followersList}
        following={followingList}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};

export default Profile;

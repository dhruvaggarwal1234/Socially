import { useState } from "react";
import axios from "axios";
import CreatePost from "../components/CreatePost";
import { useSelector } from "react-redux";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  const token = useSelector((state) => state.user.accessToken);

  const createPost = async (data) => {
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/posts`,
        data,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newPost = response.data;
      setPosts((prev) => [newPost, ...prev]);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <section className="space-y-6">
      {/* PAGE TITLE */}
      <div className="p-4 bg-white rounded-xl border shadow-sm">
        <h1 className="text-xl font-semibold">Home</h1>
        <p className="text-sm text-gray-500">
          Welcome back 👋 Share something with your network
        </p>
      </div>

      {/* CREATE POST */}
      <div className="bg-white rounded-xl border shadow-sm p-4">
        <CreatePost onCreatePost={createPost} error={error} />
      </div>

      {/* POSTS FEED (EMPTY STATE FOR NOW) */}
      <div className="bg-white rounded-xl border shadow-sm p-6 text-center text-gray-500">
        No posts yet. Start by creating one 🚀
      </div>
    </section>
  );
};

export default Home;

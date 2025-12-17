import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import CreatePost from "../components/CreatePost";
import Feeds from "../components/Feeds";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = useSelector((state) => state.user.accessToken);

  // ================= GET POSTS =================
  const getPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/posts`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= CREATE POST =================
  const createPost = async (formData) => {
    setError("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/posts`,
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // backend returns { success, message, post }
      setPosts((prev) => [res.data.post, ...prev]);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <section className="space-y-6">
      {/* Create Post */}
      <div className="bg-white rounded-xl border shadow-sm p-4">
        <CreatePost onCreatePost={createPost} error={error} />
      </div>

      {/* Feeds */}
      {loading ? (
        <div className="text-center text-gray-500">Loading posts...</div>
      ) : (
        <Feeds posts={posts} />
      )}
    </section>
  );
};

export default Home;

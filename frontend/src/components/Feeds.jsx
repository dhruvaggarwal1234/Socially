import Feed from "./Feed";

const Feeds = ({ posts }) => {
  // 🛡️ SAFETY: handle object or array
  const postList = Array.isArray(posts) ? posts : posts?.posts || [];

  if (postList.length === 0) {
    return (
      <div className="bg-white rounded-xl border shadow-sm p-6 text-center text-gray-500">
        No posts found 🚀
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {postList.map((post) => (
        <Feed key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Feeds;

import { Modal, Avatar } from "antd";
import { Link } from "react-router-dom";

const FollowListModal = ({
  open,
  onClose,
  followers = [],
  following = [],
  activeTab,
  setActiveTab,
}) => {
  const users =
    activeTab === "followers" ? followers : following;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={420}
      className="!rounded-2xl"
      bodyStyle={{ padding: 0 }}
    >
      {/* ================= HEADER ================= */}
      <div className="px-6 pt-5 pb-3 border-b">
        <h3 className="text-lg font-semibold text-center">
          Connections
        </h3>
      </div>

      {/* ================= TABS ================= */}
      <div className="flex">
        <button
          onClick={() => setActiveTab("followers")}
          className={`flex-1 py-3 text-sm font-semibold transition ${
            activeTab === "followers"
              ? "border-b-2 border-black text-black"
              : "text-gray-500 hover:text-black"
          }`}
        >
          Followers
          <span className="ml-1 text-gray-400">
            {followers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("following")}
          className={`flex-1 py-3 text-sm font-semibold transition ${
            activeTab === "following"
              ? "border-b-2 border-black text-black"
              : "text-gray-500 hover:text-black"
          }`}
        >
          Following
          <span className="ml-1 text-gray-400">
            {following.length}
          </span>
        </button>
      </div>

      {/* ================= LIST ================= */}
      <div className="max-h-[420px] overflow-y-auto px-3 py-2">
        {users.length === 0 ? (
          <div className="text-center text-gray-500 py-10 text-sm">
            No users found
          </div>
        ) : (
          users.map((user) => (
            <Link
              key={user._id}
              to={`/users/${user._id}`}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 rounded-xl transition hover:bg-gray-100"
            >
              <Avatar
                size={44}
                src={user.profilePhoto}
              />

              <div className="flex flex-col">
                <span className="font-medium text-sm text-black">
                  {user.fullname}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </Modal>
  );
};

export default FollowListModal;

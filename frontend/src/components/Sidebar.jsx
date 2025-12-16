import { NavLink } from "react-router-dom";
import {
  HomeOutlined,
  MessageOutlined,
  BookOutlined,
  UserOutlined,
} from "@ant-design/icons";

const Sidebar = () => {
  const navItem = ({ isActive }) =>
    `
      relative flex items-center gap-4
      px-5 py-3 rounded-xl
      font-medium
      transition-all duration-300
      ${
        isActive
          ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
          : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
      }
    `;

  return (
    <aside
      className="
        fixed top-16 left-0
        h-150
        w-64
        bg-white/90 backdrop-blur-xl
        border-r border-gray-200
        px-4 py-6
        flex flex-col gap-2
        shadow-sm
      "
    >
      {/* SECTION TITLE */}
      <p className="px-4 mb-3 text-xs font-semibold tracking-widest text-gray-400 uppercase">
        Menu
      </p>

      {/* HOME */}
      <NavLink to="/" end className={navItem}>
        {({ isActive }) => (
          <>
            {isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-full bg-white"></span>
            )}
            <HomeOutlined className="text-lg" />
            <span>Home</span>
          </>
        )}
      </NavLink>

      {/* MESSAGES */}
      <NavLink to="/messages" className={navItem}>
        {({ isActive }) => (
          <>
            {isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-full bg-white"></span>
            )}
            <MessageOutlined className="text-lg" />
            <span>Messages</span>
          </>
        )}
      </NavLink>

      {/* BOOKMARKS */}
      <NavLink to="/bookmarks" className={navItem}>
        {({ isActive }) => (
          <>
            {isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-full bg-white"></span>
            )}
            <BookOutlined className="text-lg" />
            <span>Bookmarks</span>
          </>
        )}
      </NavLink>

      {/* PROFILE */}
      <NavLink to="/users/me" className={navItem}>
        {({ isActive }) => (
          <>
            {isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-full bg-white"></span>
            )}
            <UserOutlined className="text-lg" />
            <span>Profile</span>
          </>
        )}
      </NavLink>
    </aside>
  );
};

export default Sidebar;

import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { CiSearch } from "react-icons/ci";
import { useState } from "react";
import ProfileImage from "./ProfileImage";
import { userActions } from "../store/user-slice";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  const [search, setSearch] = useState("");





  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    console.log("Search:", search);
  };

  const handleLogout = () => {
    dispatch(userActions.logout());
  };

  return (
    <nav className="
      sticky top-0 z-50
      bg-white/80 backdrop-blur-xl
      border-b border-gray-200/60
      shadow-sm
      transition-all duration-300
    ">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* LEFT */}
        <Link
          to="/"
          className="
            text-xl font-bold text-blue-600
            tracking-tight
            hover:opacity-90
            transition-all duration-200
          "
        >
          Socially
        </Link>

        {/* CENTER */}
        <form
          onSubmit={handleSearch}
          className="
            hidden md:flex items-center
            bg-gray-100/70 backdrop-blur
            rounded-full px-4 py-2 w-80
            border border-gray-200/60
            focus-within:ring-2 focus-within:ring-blue-500/30
            transition-all duration-300
          "
        >
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search people, posts..."
            className="
              bg-transparent outline-none text-sm w-full
              placeholder:text-gray-400
            "
          />
          <button
            type="submit"
            className="
              text-gray-500
              hover:text-blue-600
              transition-colors duration-200
            "
          >
            <CiSearch size={20} />
          </button>
        </form>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                to={`/users/${user._id}`}
                className="
                  group relative
                  transition-transform duration-200
                  hover:scale-105
                "
              >
                <div className="
                  w-9 h-9 rounded-full overflow-hidden
                  border border-gray-300
                  shadow-sm
                  group-hover:shadow-md
                  transition-all duration-300
                ">
                  <ProfileImage image={user.profilePhoto} />
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="
                  text-sm font-medium
                  text-gray-600
                  hover:text-red-500
                  transition-colors duration-200
                  cursor-pointer
                "
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="
                  text-sm font-medium
                  text-gray-600
                  hover:text-blue-600
                  transition-colors duration-200
                "
              >
                Login
              </Link>

              <Link
                to="/register"
                className="
                  px-4 py-1.5 rounded-full
                  bg-blue-600 text-white text-sm font-medium
                  shadow-md shadow-blue-500/20
                  hover:bg-blue-700 hover:shadow-lg
                  hover:-translate-y-[1px]
                  transition-all duration-300
                "
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

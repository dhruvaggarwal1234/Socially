import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { CiSearch } from "react-icons/ci";
import { useState } from "react";
import ProfileImage from "./ProfileImage";

const Navbar = () => {
  const user = useSelector((state) => state?.user?.currentUser);
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    console.log("Search:", search);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LEFT */}
        <Link
          to="/"
          className="text-xl font-bold text-blue-600"
        >
          Socially
        </Link>

        {/* CENTER */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-1.5 w-72"
        >
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search people, posts..."
            aria-label="Search"
            className="bg-transparent outline-none text-sm w-full"
          />
          <button
            type="submit"
            aria-label="Submit search"
            className="text-gray-500 hover:text-blue-600 transition"
          >
            <CiSearch size={20} />
          </button>
        </form>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {user?.token ? (
            <>
              {/* PROFILE */}
              <Link to={`/users/${user?._id}`}>
                <div className="w-9 h-9 rounded-full overflow-hidden border">
                  <ProfileImage image={user?.profilePhoto} />
                </div>
              </Link>

              {/* LOGOUT */}
              <Link
                to="/logout"
                className="text-sm text-gray-600 hover:text-blue-600 transition"
              >
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-blue-600 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
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

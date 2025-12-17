import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { CiSearch } from "react-icons/ci";
import { useEffect, useRef, useState } from "react";
import ProfileImage from "./ProfileImage";
import { userActions } from "../store/user-slice";
import axios from "axios";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser, accessToken } = useSelector(
    (state) => state.user
  );

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef(null);

  // ================= CLOSE DROPDOWN ON OUTSIDE CLICK =================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  // ================= SEARCH USERS =================
  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/users`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // 🔥 UI-only filtering
        const filtered = res.data.filter((user) =>
          user.fullname
            .toLowerCase()
            .includes(search.toLowerCase())
        );

        setResults(filtered.slice(0, 6));
        setOpen(true);
      } catch (err) {
        console.error("Search error", err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchUsers, 300);
    return () => clearTimeout(debounce);
  }, [search, accessToken]);

  const handleLogout = () => {
    dispatch(userActions.logout());
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* LEFT */}
        <Link
          to="/"
          className="text-xl font-bold text-blue-600 tracking-tight"
        >
          Socially
        </Link>

        {/* CENTER SEARCH */}
        <div
          ref={wrapperRef}
          className="relative hidden md:block"
        >
          <div className="flex items-center bg-gray-100/70 rounded-full px-4 py-2 w-80 border focus-within:ring-2 focus-within:ring-blue-500/30">
            <input
              type="search"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search people..."
              className="bg-transparent outline-none text-sm w-full"
              onFocus={() => search && setOpen(true)}
            />
            <CiSearch
              size={20}
              className="text-gray-500"
            />
          </div>

          {/* DROPDOWN */}
          {open && (
            <div className="absolute mt-2 w-full bg-white rounded-xl shadow-lg border overflow-hidden">
              {loading ? (
                <div className="p-4 text-sm text-gray-500">
                  Searching...
                </div>
              ) : results.length === 0 ? (
                <div className="p-4 text-sm text-gray-500">
                  No users found
                </div>
              ) : (
                results.map((user) => (
                  <Link
                    key={user._id}
                    to={`/users/${user._id}`}
                    onClick={() => {
                      setOpen(false);
                      setSearch("");
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden border">
                      <ProfileImage
                        image={user.profilePhoto}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {user.fullname}
                    </span>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {currentUser ? (
            <>
              <Link
                to={`/users/${currentUser._id}`}
                className="w-9 h-9 rounded-full overflow-hidden border shadow-sm"
              >
                <ProfileImage
                  image={currentUser.profilePhoto}
                />
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-600 hover:text-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-sm font-medium"
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

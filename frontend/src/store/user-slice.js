import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  socket: null,
  onlineUsers: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // ================= LOGIN =================
    loginSuccess: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;

      state.currentUser = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;

      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    },

    // ================= UPDATE USER =================
    changeCurrentUser: (state, action) => {
      state.currentUser = action.payload;

      if (action.payload) {
        localStorage.setItem(
          "currentUser",
          JSON.stringify(action.payload)
        );
      } else {
        localStorage.removeItem("currentUser");
      }
    },

    // ================= BOOKMARK TOGGLE (NEW 🔥) =================
    toggleBookmark: (state, action) => {
      const postId = action.payload;

      if (!state.currentUser) return;

      const bookmarks = state.currentUser.bookmarks || [];

      const isBookmarked = bookmarks.includes(postId);

      state.currentUser.bookmarks = isBookmarked
        ? bookmarks.filter((id) => id !== postId)
        : [...bookmarks, postId];

      // 🔥 persist to localStorage
      localStorage.setItem(
        "currentUser",
        JSON.stringify(state.currentUser)
      );
    },

    // ================= SOCKET =================
    setSocket: (state, action) => {
      state.socket = action.payload;
    },

    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },

    // ================= LOGOUT =================
    logout: (state) => {
      state.currentUser = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.socket = null;
      state.onlineUsers = [];

      localStorage.removeItem("currentUser");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;

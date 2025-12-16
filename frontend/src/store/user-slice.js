import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
  socket: null,
  onlineUsers: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    changeCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      localStorage.setItem(
        "currentUser",
        JSON.stringify(action.payload)
      );
    },

    setSocket: (state, action) => {
      state.socket = action.payload;
    },

    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },

    logout: (state) => {
      state.currentUser = null;
      state.socket = null;
      state.onlineUsers = [];
      localStorage.removeItem("currentUser");
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Theme
  themeModalIsOpen: false,
  theme: JSON.parse(localStorage.getItem("theme")) || {
    primaryColor: "",
    backgroundColor: "",
  },

  // Profile edit modal
  editProfileModalOpen: false,

  // Post edit modal
  editPostModalOpen: false,
  editPostId: "",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    /* ================= THEME ================= */
    openThemeModal: (state) => {
      state.themeModalIsOpen = true;
    },

    closeThemeModal: (state) => {
      state.themeModalIsOpen = false;
    },

    changeTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem("theme", JSON.stringify(action.payload));
    },

    /* ================= EDIT PROFILE ================= */
    openEditProfileModal: (state) => {
      state.editProfileModalOpen = true;
    },

    closeEditProfileModal: (state) => {
      state.editProfileModalOpen = false;
    },

    /* ================= EDIT POST ================= */
    openEditPostModal: (state, action) => {
      state.editPostModalOpen = true;
      state.editPostId = action.payload;
    },

    closeEditPostModal: (state) => {
      state.editPostModalOpen = false;
      state.editPostId = "";
    },
  },
});

export const uiSliceActions = uiSlice.actions;
export default uiSlice.reducer;

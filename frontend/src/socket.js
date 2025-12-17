import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_API_URL, {
  query: {
    userId: JSON.parse(localStorage.getItem("currentUser"))?._id,
  },
});

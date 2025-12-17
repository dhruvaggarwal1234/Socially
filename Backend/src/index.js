import dotenv from "dotenv";
import ConnectDB from "./Db/db.js";
import { server } from "./socket/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

ConnectDB()
  .then(() => {
    server.on("error", (error) => {
      console.error("❌ Server Error:", error);
    });

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ DB Connection Error:", error);
  });

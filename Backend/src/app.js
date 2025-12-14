import express from "express";
import cors from "cors";
import upload from "express-fileupload";

import { REQUEST_LIMIT } from "./contents.js";
import { errorHandler, notFound } from "./Middlewares/Error.middleware.js";
import {router} from "./Routes/user.routes.js"; // ✅ default import

const app = express();

// ================= GLOBAL MIDDLEWARES =================
app.use(cors({
  credentials: true,
  origin: process.env.ORIGIN,
}));

app.use(express.json({
  limit: REQUEST_LIMIT,
}));

app.use(express.urlencoded({
  extended: true,
  limit: REQUEST_LIMIT,
}));

app.use(upload());

// ================= ROUTES =================
app.use("/api/users", router);

// ================= ERROR MIDDLEWARES (ALWAYS LAST) =================
app.use(notFound);
app.use(errorHandler);

export { app };

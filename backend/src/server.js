import express from "express";
import { connectDB } from "./config/db.js";
import dns from "dns";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

connectDB();

app.listen(3000, () => {
  console.log("Server started on PORT:3000");
});
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

let requestCount = 0;
app.use((req, res, next) => {
  requestCount++;
  next();
});

// Health check endpoint (required by M6)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    commit: process.env.COMMIT_SHA || "production",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Prometheus metrics endpoint (required by M6)
app.get("/metrics", (req, res) => {
  const memoryUsage = process.memoryUsage();
  const uptime = process.uptime();
  res.set("Content-Type", "text/plain; version=0.0.4; charset=utf-8");
  res.send(
    `# HELP http_requests_total Total number of HTTP requests\n` +
      `# TYPE http_requests_total counter\n` +
      `http_requests_total ${requestCount}\n` +
      `# HELP process_uptime_seconds Process uptime in seconds\n` +
      `# TYPE process_uptime_seconds gauge\n` +
      `process_uptime_seconds ${uptime}\n` +
      `# HELP nodejs_heap_size_used_bytes Process heap memory used\n` +
      `# TYPE nodejs_heap_size_used_bytes gauge\n` +
      `nodejs_heap_size_used_bytes ${memoryUsage.heapUsed}\n` +
      `# HELP nodejs_resident_memory_bytes Resident memory size in bytes\n` +
      `# TYPE nodejs_resident_memory_bytes gauge\n` +
      `nodejs_resident_memory_bytes ${memoryUsage.rss}\n`
  );
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on PORT:${PORT}`);
});
// Application entrypoint

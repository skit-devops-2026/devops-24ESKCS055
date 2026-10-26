import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import dns from "dns";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import { seedDatabase } from "./config/seed.js";
import authRoutes from "./routes/authRoutes.js";
import debateRoutes from "./routes/debateRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);

let requestCount = 0;
app.use((req, res, next) => {
  requestCount++;
  next();
});

// Health check endpoint (required by DevOps / CI)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    commit: process.env.COMMIT_SHA || "production",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Prometheus metrics endpoint (required by DevOps / monitoring)
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

// Primary API route handlers
app.use("/api/auth", authRoutes);
app.use("/api/debates", debateRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Production frontend static delivery fallback
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const frontendDist = path.resolve(currentDir, "../../frontend/dist");
const frontendIndex = path.join(frontendDist, "index.html");

if (existsSync(frontendIndex)) {
  app.use(express.static(frontendDist));
  app.get("*", (req, res, next) => {
    if (req.path === "/api" || req.path.startsWith("/api/")) {
      return next();
    }
    res.sendFile(frontendIndex, (err) => {
      if (err) next(err);
    });
  });
} else {
  app.get("/", (req, res) => res.send("Sayso API running"));
}

// Connect to MongoDB and seed default content if unpopulated
connectDB().then(() => {
  seedDatabase();
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on PORT:${PORT}`);
});

export default app;

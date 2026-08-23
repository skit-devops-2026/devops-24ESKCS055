import express from "express";
import {
  getAllPosts,
  getPostById,
  createPost,
  deletePost,
  toggleLike,
  votePost,
} from "../controllers/postController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protectRoute, getAllPosts);
router.get("/:id", protectRoute, getPostById);
router.post("/", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);
router.post("/:id/like", protectRoute, toggleLike);
router.post("/:id/vote", protectRoute, votePost);

export default router;
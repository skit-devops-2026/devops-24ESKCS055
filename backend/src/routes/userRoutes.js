import express from "express";
import { getProfile, updateProfile, deleteAccount, toggleFollow } from "../controllers/userController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:id", protectRoute, getProfile);
router.put("/update", protectRoute, updateProfile);
router.delete("/delete", protectRoute, deleteAccount);
router.post("/:id/follow", protectRoute, toggleFollow);

export default router;
import { Router } from "express";
import { updateProfile, deleteAccount, getProfile } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.put("/profile", protect, updateProfile);
router.delete("/account", protect, deleteAccount);
router.get("/:id", getProfile);

export default router;
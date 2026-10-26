import { Router } from "express";
import { signup, login, checkAuth, logout } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, checkAuth);
router.post("/logout", logout);

export default router;
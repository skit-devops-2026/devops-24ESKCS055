import { Router } from "express";
import { getAllDebates, getCurrentDebate, createDebate } from "../controllers/debateController.js";
import { getUserStance, recordStance, postResponse } from "../controllers/responseController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

router.get("/", getAllDebates);
router.get("/current", getCurrentDebate);
router.post("/", protect, adminOnly, createDebate);

router.get("/:debateId/stance", protect, getUserStance);
router.post("/:debateId/stance", protect, recordStance);
router.post("/:debateId/responses", protect, postResponse);

export default router;

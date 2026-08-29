import { Router } from "express";
import { generateStudySetHandler } from "../controllers/ai.controller.js";

const router = Router();

// POST /api/study/generate
router.post("/generate", generateStudySetHandler);

export default router;

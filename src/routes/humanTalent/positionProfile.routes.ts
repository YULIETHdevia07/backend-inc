import { Router } from "express";
import { getActivePositionProfiles } from "../../controllers/humanTalent/positionProfile.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, getActivePositionProfiles);

export default router;
import { Router } from "express";
import { getActiveDepartments } from "../../controllers/humanTalent/department.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, getActiveDepartments);

export default router;
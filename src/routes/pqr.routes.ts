import { Router } from "express";
import { createPqr, getMyPqrs } from "../controllers/pqr.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, createPqr);
router.get("/my", authMiddleware, getMyPqrs);

export default router;
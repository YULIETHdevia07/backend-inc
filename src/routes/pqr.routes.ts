import { Router } from "express";
import { createPqr } from "../controllers/pqr.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, createPqr);

export default router;
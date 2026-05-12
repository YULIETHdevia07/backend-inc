import { Router } from "express";
import { createPqr, getAllPqrs, getMyPqrs } from "../controllers/pqr.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/role.middleware.js";

const router = Router();

router.post("/", authMiddleware, createPqr);
router.get("/my", authMiddleware, getMyPqrs);
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllPqrs
);

export default router;
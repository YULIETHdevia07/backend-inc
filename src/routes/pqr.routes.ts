import { Router } from "express";
import { createPqr, getAllPqrs, getMyPqrs, updatePqrStatus, respondPqr } from "../controllers/pqr.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/role.middleware.js";

const router = Router();

router.post("/", authMiddleware, createPqr);
router.get("/my", authMiddleware, getMyPqrs);
// Admin 
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllPqrs
);
router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  updatePqrStatus
);

router.patch(
  "/:id/respond",
  authMiddleware,
  adminMiddleware,
  respondPqr
);

export default router;
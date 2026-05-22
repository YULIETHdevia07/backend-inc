import { Router } from "express";
import {
  createPqr,
  getAllPqrs,
  getMyPqrs,
  updatePqrStatus,
  respondPqr,
  getAvailablePqrsController,
  getMyAssignedPqrsController,
  takePqrController,
  updatePqrPriorityController,
  ratePqrController,
} from "../controllers/pqr.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = Router();

router.post("/", authMiddleware, createPqr);
router.get("/my", authMiddleware, getMyPqrs);
// Admin 
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  getAllPqrs
);
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware(["ADMIN", "AGENT"]),
  updatePqrStatus
);

router.patch(
  "/:id/priority",
  authMiddleware,
  roleMiddleware(["ADMIN", "AGENT"]),
  updatePqrPriorityController
);

router.patch(
  "/:id/rate",
  authMiddleware,
  roleMiddleware(["USER"]),
  ratePqrController
);

router.patch(
  "/:id/respond",
  authMiddleware,
  roleMiddleware(["ADMIN", "AGENT"]),
  respondPqr
);

router.get(
  "/available",
  authMiddleware,
  roleMiddleware(["ADMIN", "AGENT"]),
  getAvailablePqrsController
);

router.patch(
  "/:id/take",
  authMiddleware,
  roleMiddleware(["ADMIN", "AGENT"]),
  takePqrController
);

router.get(
  "/assigned/my",
  authMiddleware,
  roleMiddleware(["ADMIN", "AGENT"]),
  getMyAssignedPqrsController
);

export default router;
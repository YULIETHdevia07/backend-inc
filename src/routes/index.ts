import { Router } from "express";

import userRoutes from "./users/user.routes.js";
import profileRoutes from "./users/profile.routes.js";
import pqrRoutes from "./pqrs/pqr.routes.js";
import authRoutes from "./auth/auth.routes.js";
import pqrMessageRoutes from "./pqrs/pqrMessage.routes.js";
import notificationRoutes from "./notifications/notification.routes.js";

import departmentRoutes from "./humanTalent/department.routes.js";
import cityRoutes from "./common/city.routes.js";
import positionProfileRoutes from "./humanTalent/positionProfile.routes.js";
import personnelRequisitionRoutes from "./humanTalent/personnelRequisition.routes.js";
import personnelHiringConfirmationRoutes from "./humanTalent/personnelHiringConfirmation.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({
    message: "API funcionando correctamente",
  });
});

router.use("/users", userRoutes);
router.use("/profile", profileRoutes);
router.use("/pqrs", pqrRoutes);
router.use("/auth", authRoutes);
router.use("/", pqrMessageRoutes);

router.use("/notifications", notificationRoutes);

router.use("/common/cities", cityRoutes);

router.use("/human-talent/departments", departmentRoutes);
router.use("/human-talent/position-profiles", positionProfileRoutes);
router.use("/human-talent/requisitions", personnelRequisitionRoutes);
router.use("/human-talent", personnelHiringConfirmationRoutes);

export default router;
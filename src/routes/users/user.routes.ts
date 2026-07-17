import { Router } from "express";

import {
  getUsers,
  getAgents,
  loginUser,
  updateUserRole,
  uploadUserSignatureController,
} from "../../controllers/users/user.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";
import { uploadUserSignature } from "../../middlewares/uploadUserSignature.middleware.js";

const router = Router();

router.get("/", authMiddleware, roleMiddleware(["ADMIN"]), getUsers);

router.get(
  "/agents",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  getAgents
);

router.patch(
  "/:id/role",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  updateUserRole
);

router.patch(
  "/signature",
  authMiddleware,
  uploadUserSignature.single("signature"),
  uploadUserSignatureController
);

router.post("/login", loginUser);

export default router;
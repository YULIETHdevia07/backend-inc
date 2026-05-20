import { Router } from "express";

import {
  getUsers,
  registerUser,
  loginUser,
  updateUserRole,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/", authMiddleware, roleMiddleware(["ADMIN"]), getUsers);

router.patch("/:id/role", authMiddleware, roleMiddleware(["ADMIN"]), updateUserRole);


router.post("/register", registerUser);

router.post("/login", loginUser);

export default router;
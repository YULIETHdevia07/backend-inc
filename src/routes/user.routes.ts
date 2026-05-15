import { Router } from "express";

import {
  getUsers,
  registerUser,
  loginUser,
  updateUserRole,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/", authMiddleware, adminMiddleware, getUsers);

router.patch("/:id/role", authMiddleware, adminMiddleware, updateUserRole);


router.post("/register", registerUser);

router.post("/login", loginUser);

export default router;
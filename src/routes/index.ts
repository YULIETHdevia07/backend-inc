import { Router } from "express";

import userRoutes from "./user.routes.js";
import profileRoutes from "./profile.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({
    message: "API funcionando correctamente",
  });
});

router.use("/users", userRoutes);
router.use("/profile", profileRoutes);

export default router;
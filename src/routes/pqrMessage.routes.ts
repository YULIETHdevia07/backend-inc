import { Router } from "express";
import { getPqrMessagesController } from "../controllers/pqrMessage.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/pqrs/:id/messages", authMiddleware, getPqrMessagesController);

export default router;
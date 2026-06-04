import { Router } from "express";
import {
    createPqrMessageWithAttachmentController,
    getPqrMessagesController,
} from "../controllers/pqrMessage.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { uploadPqrAttachment } from "../middlewares/upload.middleware.js";

const router = Router();

// Obtiene el historial de mensajes de una PQR.
router.get("/pqrs/:id/messages", authMiddleware, getPqrMessagesController);

// Envía un mensaje con archivo adjunto en una PQR.
router.post(
    "/pqrs/:id/messages/attachment",
    authMiddleware,
    uploadPqrAttachment.single("file"),
    createPqrMessageWithAttachmentController
);

export default router;
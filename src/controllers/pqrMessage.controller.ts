import type { Response } from "express";
import type { AuthRequest } from "../interfaces/auth.interface.js";
import { getPqrMessagesService } from "../services/pqrMessage.service.js";

// Obtiene el historial de mensajes de una PQR.
export const getPqrMessagesController = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const pqrId = Number(req.params.id);

        if (!pqrId || Number.isNaN(pqrId)) {
            return res.status(400).json({
                message: "El id de la PQR no es válido",
            });
        }

        if (!req.user) {
            return res.status(401).json({
                message: "Usuario no autenticado",
            });
        }

        const messages = await getPqrMessagesService(
            pqrId,
            req.user.id,
            req.user.role
        );

        return res.json({
            message: "Mensajes obtenidos correctamente",
            messages,
        });
    } catch (error) {
        return res.status(400).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Error al obtener los mensajes",
        });
    }
};
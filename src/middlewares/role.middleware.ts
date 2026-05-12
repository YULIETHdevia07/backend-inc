import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../interfaces/auth.interface.js";

export const adminMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Usuario no autenticado",
        });
    }

    if (req.user.role !== "ADMIN") {
        return res.status(403).json({
            message: "No tienes permisos para acceder a este recurso",
        });
    }

    next();
};
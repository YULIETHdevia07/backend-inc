import type { Request, Response } from "express";
import { registerUserService } from "../services/auth.service.js";

export const registerUser = async (
    req: Request,
    res: Response
) => {
    try {
        const user = await registerUserService(req.body);

        return res.status(201).json({
            message: "Usuario registrado correctamente",
            user,
        });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({
                message: error.message,
            });
        }

        return res.status(500).json({
            message: "Error al registrar usuario",
        });
    }
};
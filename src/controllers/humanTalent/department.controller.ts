import type { Request, Response } from "express";
import { getActiveDepartmentsService } from "../../services/humanTalent/department.service.js";

export const getActiveDepartments = async (req: Request, res: Response) => {
    try {
        const departments = await getActiveDepartmentsService();

        return res.status(200).json({
            message: "Áreas obtenidas correctamente",
            departments,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener las áreas",
            error,
        });
    }
};
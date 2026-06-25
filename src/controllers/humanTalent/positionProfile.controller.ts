import type { Request, Response } from "express";
import { getActivePositionProfilesService } from "../../services/humanTalent/positionProfile.service.js";

export const getActivePositionProfiles = async (
    req: Request,
    res: Response
) => {
    try {
        const positionProfiles = await getActivePositionProfilesService();

        return res.status(200).json({
            message: "Perfiles de cargo obtenidos correctamente",
            positionProfiles,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener los perfiles de cargo",
            error,
        });
    }
};
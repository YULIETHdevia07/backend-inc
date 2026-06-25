import type { Response } from "express";
import { RequisitionReason } from "@prisma/client";
import type { AuthRequest } from "../../interfaces/auth/auth.interface.js";
import { createPersonnelRequisitionService, getPersonnelRequisitionsService } from "../../services/humanTalent/personnelRequisition.service.js";

// Crea una nueva requisición de personal.
export const createPersonnelRequisition = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const {
            departmentId,
            positionId,
            reason,
            otherReason,
            cityId,
            proposedSalary,
        } = req.body;

        const allowedReasons: RequisitionReason[] = [
            "CARGO_NUEVO",
            "REEMPLAZO_RETIRO",
            "INCREMENTO_PRODUCCION",
            "SOLICITUD_PRACTICANTES",
            "OTROS",
        ];

        if (!req.user) {
            return res.status(401).json({
                message: "Usuario no autenticado",
            });
        }

        if (
            !departmentId ||
            !positionId ||
            !reason ||
            !cityId ||
            !proposedSalary
        ) {
            return res.status(400).json({
                message: "Todos los campos obligatorios deben ser enviados",
            });
        }

        if (!allowedReasons.includes(reason)) {
            return res.status(400).json({
                message: "Motivo de requisición no válido",
                allowedReasons,
            });
        }

        if (reason === "OTROS" && !otherReason?.trim()) {
            return res.status(400).json({
                message: "Debe especificar el motivo de la requisición",
            });
        }

        if (Number.isNaN(Number(departmentId))) {
            return res.status(400).json({
                message: "El área solicitante no es válida",
            });
        }

        if (Number.isNaN(Number(positionId))) {
            return res.status(400).json({
                message: "El cargo requerido no es válido",
            });
        }

        if (Number.isNaN(Number(cityId))) {
            return res.status(400).json({
                message: "La ciudad no es válida",
            });
        }

        if (
            Number.isNaN(Number(proposedSalary)) ||
            Number(proposedSalary) <= 0
        ) {
            return res.status(400).json({
                message: "El salario propuesto debe ser mayor a cero",
            });
        }

        const requisition = await createPersonnelRequisitionService({
            departmentId: Number(departmentId),
            positionId: Number(positionId),
            reason,
            otherReason,
            cityId: Number(cityId),
            proposedSalary: Number(proposedSalary),
            createdById: req.user.id,
        });

        return res.status(201).json({
            message: "Requisición de personal creada correctamente",
            requisition,
        });
    } catch (error) {
        return res.status(400).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Error al crear la requisición de personal",
        });
    }
};

// Obtiene el listado de requisiciones de personal.
export const getPersonnelRequisitions = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Usuario no autenticado",
            });
        }

        const requisitions = await getPersonnelRequisitionsService();

        return res.json({
            message: "Requisiciones de personal obtenidas correctamente",
            requisitions,
        });
    } catch (error) {
        return res.status(400).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Error al obtener las requisiciones de personal",
        });
    }
};
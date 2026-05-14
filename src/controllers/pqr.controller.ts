import type { Response } from "express";
import { createPqrService, getMyPqrsService, getAllPqrsService, getPqrByIdService, updatePqrStatusService, respondPqrService } from "../services/pqr.service.js";
import type { AuthRequest } from "../interfaces/auth.interface.js";
import { PqrStatus } from "@prisma/client";

export const createPqr = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { caseType, description } = req.body;

    if (!caseType || !description) {
      return res.status(400).json({
        message: "El título y la descripción son obligatorios",
      });
    }

    if (!req.user) {
      return res.status(401).json({
        message: "Usuario no autenticado",
      });
    }

    if (description.length > 500) {
      return res.status(400).json({
        message: "La descripción no puede superar los 500 caracteres",
      });
    }

    const pqr = await createPqrService({
      caseType,
      description,
      userId: req.user.id,
    });

    return res.status(201).json({
      message: "PQR creada correctamente",
      pqr,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al crear la PQR",
      error,
    });
  }
};

export const getMyPqrs = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Usuario no autenticado",
      });
    }

    const pqrs = await getMyPqrsService(req.user.id);

    return res.json({
      message: "PQR obtenidas correctamente",
      pqrs,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener las PQR",
      error,
    });
  }
};

// Admin

export const getAllPqrs = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const pqrs = await getAllPqrsService();

    return res.json({
      message: "Todas las PQR obtenidas correctamente",
      pqrs,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener todas las PQR",
      error,
    });
  }
};

export const updatePqrStatus = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const pqrId = Number(id);

    if (Number.isNaN(pqrId)) {
      return res.status(400).json({
        message: "El id de la PQR no es válido",
      });
    }

    const allowedStatus: PqrStatus[] = [
      "PENDIENTE",
      "EN_PROCESO",
      "RESPONDIDA",
      "CERRADA",
    ];

    if (!status) {
      return res.status(400).json({
        message: "El estado es obligatorio",
      });
    }

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Estado no válido",
        allowedStatus,
      });
    }

    const existingPqr = await getPqrByIdService(pqrId);

    if (!existingPqr) {
      return res.status(404).json({
        message: "La PQR no existe",
      });
    }

    const pqr = await updatePqrStatusService(
      pqrId,
      status
    );

    return res.json({
      message: "Estado de la PQR actualizado correctamente",
      pqr,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar el estado de la PQR",
      error,
    });
  }
};

export const respondPqr = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { response } = req.body;

    const pqrId = Number(id);

    if (Number.isNaN(pqrId)) {
      return res.status(400).json({
        message: "El id de la PQR no es válido",
      });
    }

    if (!response || response.trim() === "") {
      return res.status(400).json({
        message: "La respuesta es obligatoria",
      });
    }

    if (response.length > 500) {
      return res.status(400).json({
        message: "La respuesta no puede superar los 500 caracteres",
      });
    }

    const existingPqr = await getPqrByIdService(pqrId);

    if (!existingPqr) {
      return res.status(404).json({
        message: "La PQR no existe",
      });
    }

    const pqr = await respondPqrService(
      pqrId,
      response.trim()
    );

    return res.json({
      message: "PQR respondida correctamente",
      pqr,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al responder la PQR",
      error,
    });
  }
};
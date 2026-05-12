import type { Response } from "express";
import { createPqrService, getMyPqrsService, getAllPqrsService, updatePqrStatusService, respondPqrService } from "../services/pqr.service.js";
import type { AuthRequest } from "../interfaces/auth.interface.js";
import type { PqrStatus } from "../interfaces/pqr.interface.js";

export const createPqr = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "El título y la descripción son obligatorios",
      });
    }

    if (!req.user) {
      return res.status(401).json({
        message: "Usuario no autenticado",
      });
    }

    const pqr = await createPqrService({
      title,
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

    const pqr = await updatePqrStatusService(
      Number(id),
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

    if (!response) {
      return res.status(400).json({
        message: "La respuesta es obligatoria",
      });
    }

    const pqr = await respondPqrService(
      Number(id),
      response
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
import type { Response } from "express";
import { createPqrService, getMyPqrsService, getAllPqrsService } from "../services/pqr.service.js";
import type { AuthRequest } from "../interfaces/auth.interface.js";

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
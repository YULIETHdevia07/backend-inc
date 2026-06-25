import { Router } from "express";
import {
    createPersonnelRequisition,
    getPersonnelRequisitions,
} from "../../controllers/humanTalent/personnelRequisition.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

// Obtiene el listado de requisiciones de personal.
router.get("/", authMiddleware, getPersonnelRequisitions);

// Crea una nueva requisición de personal.
router.post("/", authMiddleware, createPersonnelRequisition);

export default router;
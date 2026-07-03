import { Router } from "express";
import {
    createPersonnelRequisition,
    decidePersonnelRequisition,
    getPersonnelRequisitions,
} from "../../controllers/humanTalent/personnelRequisition.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";

const router = Router();

// Obtiene el listado de requisiciones de personal.
router.get(
    "/",
    authMiddleware,
    roleMiddleware([
        "ADMIN",
        "JEFE_AREA",
        "JEFE_DEPARTAMENTO",
        "GERENTE_GENERAL",
        "ANALISTA_TALENTO_HUMANO",
        "JEFE_TALENTO_HUMANO",
    ]),
    getPersonnelRequisitions
);

// Crea una nueva requisición de personal.
router.post(
    "/",
    authMiddleware,
    roleMiddleware(["JEFE_AREA"]),
    createPersonnelRequisition
);

// Aprueba, rechaza o cancela una requisición de personal.
router.patch(
    "/:id/decision",
    authMiddleware,
    roleMiddleware([
        "JEFE_AREA",
        "JEFE_DEPARTAMENTO",
        "GERENTE_GENERAL",
    ]),
    decidePersonnelRequisition
);

export default router;
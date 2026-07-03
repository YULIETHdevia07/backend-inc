import { Router } from "express";

import {
    createPersonnelHiringConfirmation,
    decidePersonnelHiringConfirmation,
} from "../../controllers/humanTalent/personnelHiringConfirmation.controller.js";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";

const router = Router();

// Registra la confirmación final de contratación de una requisición.
router.post(
    "/requisitions/:id/hiring-confirmation",
    authMiddleware,
    roleMiddleware(["ANALISTA_TALENTO_HUMANO"]),
    createPersonnelHiringConfirmation
);

// Aprueba, rechaza o cancela una confirmación de contratación.
router.patch(
    "/hiring-confirmations/:id/decision",
    authMiddleware,
    roleMiddleware(["JEFE_TALENTO_HUMANO"]),
    decidePersonnelHiringConfirmation
);

export default router;
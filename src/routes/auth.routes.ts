import { Router } from "express";
import {
  registerUser,
  registerUsersBulk,
} from "../controllers/auth.controller.js";
import { uploadExcel } from "../middlewares/upload.middleware.js";

const router = Router();

router.post("/register", registerUser);

// Registra usuarios mediante carga masiva desde archivo Excel.
router.post(
  "/register/bulk",
  uploadExcel.single("file"),
  registerUsersBulk
);

export default router;
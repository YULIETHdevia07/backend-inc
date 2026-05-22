import { PqrCaseType, PqrPriority } from "@prisma/client";

// Datos necesarios para crear una nueva PQR.
export interface CreatePqrData {
  caseType: PqrCaseType;
  description: string;
  userId: number;
}

// Datos necesarios para cambiar la prioridad de una PQR.
export interface UpdatePqrPriorityData {
  priority: PqrPriority;
}

// Datos necesarios para calificar una PQR.
export interface RatePqrData {
  rating: number;
  ratingComment?: string;
}
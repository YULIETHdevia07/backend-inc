import type { Role } from "@prisma/client";

// Datos necesarios para crear un mensaje dentro de una PQR.
export interface CreatePqrMessageData {
  pqrId: number;
  senderId: number;
  senderRole: Role;
  content: string;
}
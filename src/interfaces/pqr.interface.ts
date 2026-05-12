export interface CreatePqrData {
  title: string;
  description: string;
  userId: number;
}

export type PqrStatus =
  | "PENDIENTE"
  | "EN_PROCESO"
  | "RESPONDIDA"
  | "CERRADA";
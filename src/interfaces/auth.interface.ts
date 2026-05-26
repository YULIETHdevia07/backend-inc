import type { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

// Datos necesarios para registrar un usuario.
export interface RegisterUserData {
  name: string;
  email: string;
  password: string;
}

// Datos esperados en cada fila del archivo de carga masiva.
export interface BulkRegisterUserData {
  name: string;
  email: string;
  password: string;
}

// Información de errores encontrados durante la carga masiva.
export interface BulkRegisterUserError {
  row: number;
  email?: string;
  message: string;
}
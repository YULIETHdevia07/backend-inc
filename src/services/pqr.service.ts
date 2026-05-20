import prisma from "../../prisma/client.js";
import type { CreatePqrData } from "../interfaces/pqr.interface.js";
import { PqrStatus } from "@prisma/client";

export const createPqrService = async ({
  caseType,
  description,
  userId,
}: CreatePqrData) => {
  const pqr = await prisma.pQR.create({
    data: {
      caseType,
      description,
      userId,
    },
  });

  return pqr;
};

export const getMyPqrsService = async (userId: number) => {
  const pqrs = await prisma.pQR.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return pqrs;
};

export const getPqrByIdService = async (id: number) => {
  const pqr = await prisma.pQR.findUnique({
    where: {
      id,
    },
  });

  return pqr;
};

// Admin

export const getAllPqrsService = async () => {
  const pqrs = await prisma.pQR.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return pqrs;
};

export const updatePqrStatusService = async (
  id: number,
  status: PqrStatus
) => {
  const pqr = await prisma.pQR.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });

  return pqr;
};

export const respondPqrService = async (
  id: number,
  response: string
) => {
  const pqr = await prisma.pQR.update({
    where: {
      id,
    },
    data: {
      response,
    },
  });

  return pqr;
};

// Obtiene las PQR que todavía no tienen responsable asignado
export const getAvailablePqrsService = async () => {
  const pqrs = await prisma.pQR.findMany({
    where: {
      assignedToId: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return pqrs;
};

// Permite que un AGENT tome una PQR
export const takePqrService = async (
  pqrId: number,
  agentId: number
) => {
  const result = await prisma.pQR.updateMany({
    where: {
      id: pqrId,
      assignedToId: null,
    },
    data: {
      assignedToId: agentId,
    },
  });

  if (result.count === 0) {
    return null;
  }

  const pqr = await prisma.pQR.findUnique({
    where: {
      id: pqrId,
    },
    include: {
      //  usuario que creó la PQR
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      // agente que tomó la PQR
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return pqr;
};

// Obtiene las PQR asignadas al AGENT autenticado
export const getMyAssignedPqrsService = async (agentId: number) => {
  const pqrs = await prisma.pQR.findMany({
    where: {
      assignedToId: agentId,
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return pqrs;
};

// Consulta una PQR por id incluyendo su responsable
export const getPqrWithAssignedService = async (pqrId: number) => {
  const pqr = await prisma.pQR.findUnique({
    where: {
      id: pqrId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return pqr;
};
import prisma from "../config/client.js";
import type { CreatePqrData, RatePqrData } from "../interfaces/pqr.interface.js";
import { PqrPriority, PqrStatus } from "@prisma/client";
import { buildPqrAttachmentData } from "./storage.service.js";
import {
  notifyAdminsAndAgentsAboutNewPqrService,
  notifyAdminsAboutTakenPqrService,
  notifyUserAboutClosedPqrService,
  notifyUserAboutTakenPqrService,
  notifyAboutRatedPqrService,
} from "./notification.service.js";

// Cuenta los mensajes no revisados de una PQR para un usuario específico.
const getUnreadMessagesCount = async (
  pqrId: number,
  userId: number
) => {
  const chatRead = await prisma.pqrChatRead.findUnique({
    where: {
      pqrId_userId: {
        pqrId,
        userId,
      },
    },
  });

  const unreadMessagesCount = await prisma.pqrMessage.count({
    where: {
      pqrId,
      senderId: {
        not: userId,
      },
      ...(chatRead && {
        createdAt: {
          gt: chatRead.lastReadAt,
        },
      }),
    },
  });

  return unreadMessagesCount;
};

// Agrega el contador de mensajes no revisados a cada PQR.
const addUnreadMessagesCountToPqrs = async <T extends { id: number }>(
  pqrs: T[],
  userId: number
) => {
  const pqrsWithUnreadCount = await Promise.all(
    pqrs.map(async (pqr) => ({
      ...pqr,
      unreadMessagesCount: await getUnreadMessagesCount(pqr.id, userId),
    }))
  );

  return pqrsWithUnreadCount;
};

// Crea una nueva PQR asociada al usuario autenticado
export const createPqrService = async ({
  caseType,
  description,
  userId,
  file,
}: CreatePqrData) => {
  const pqr = await prisma.pQR.create({
    data: {
      caseType,
      description,
      userId,
    },
    include: {
      // usuario que creó la PQR
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

  // Crea siempre el primer mensaje del chat con la descripción de la PQR.
  await prisma.pqrMessage.create({
    data: {
      content: description,
      pqrId: pqr.id,
      senderId: userId,

      // Si el usuario adjunta archivo, se asocia al primer mensaje.
      ...(file && {
        attachments: {
          create: buildPqrAttachmentData({
            file,
          }),
        },
      }),
    },
  });

  // Notifica a ADMIN y AGENT que existe una nueva PQR
  await notifyAdminsAndAgentsAboutNewPqrService(
    pqr.id,
    pqr.user.name,
    pqr.user.email
  );

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

  return addUnreadMessagesCountToPqrs(pqrs, userId);
};

export const getPqrByIdService = async (id: number) => {
  const pqr = await prisma.pQR.findUnique({
    where: {
      id,
    },
  });

  return pqr;
};

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

// Cambia el estado de una PQR
export const updatePqrStatusService = async (
  id: number,
  status: PqrStatus
) => {
  const currentPqr = await prisma.pQR.findUnique({
    where: {
      id,
    },
  });

  if (!currentPqr) {
    return null;
  }

  const pqr = await prisma.pQR.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });

  // Notifica al USER solo cuando la PQR cambia a CERRADA
  if (currentPqr.status !== "CERRADA" && pqr.status === "CERRADA") {
    await notifyUserAboutClosedPqrService(
      pqr.userId,
      pqr.id
    );
  }

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

// Permite que un AGENT tome una PQR sin cambiar su estado
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
      // usuario que creó la PQR
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

  if (!pqr || !pqr.assignedTo) {
    return null;
  }

  // Notifica a los ADMIN qué agente tomó la PQR
  await notifyAdminsAboutTakenPqrService(
    pqr.id,
    pqr.assignedTo.name,
    pqr.assignedTo.email,
    pqr.user.name,
    pqr.user.email,
    agentId
  );

  // Notifica al USER que su PQR ya está siendo atendida
  await notifyUserAboutTakenPqrService(
    pqr.user.id,
    pqr.id
  )

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

  return addUnreadMessagesCountToPqrs(pqrs, agentId);
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

// Cambia la prioridad de una PQR.
export const updatePqrPriorityService = async (
  pqrId: number,
  priority: PqrPriority
) => {
  const pqr = await prisma.pQR.update({
    where: {
      id: pqrId,
    },
    data: {
      priority,
    },
  });

  return pqr;
};

// Permite calificar una PQR cerrada
export const ratePqrService = async (
  pqrId: number,
  data: RatePqrData
) => {
  const pqr = await prisma.pQR.update({
    where: {
      id: pqrId,
    },
    data: {
      rating: data.rating,
      ratingComment: data.ratingComment ?? null,
      ratedAt: new Date(),
    },
    include: {
      // usuario que creó y calificó la PQR
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      // agente asignado a la PQR
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

  // Notifica a los ADMIN y al AGENT asignado que la PQR fue calificada
  await notifyAboutRatedPqrService(
    pqr.id,
    pqr.user.name,
    pqr.user.email,
    pqr.rating ?? data.rating,
    pqr.assignedToId
  );

  return pqr;
};
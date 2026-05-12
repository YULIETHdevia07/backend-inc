import prisma from "../../prisma/client.js";
import type { CreatePqrData, PqrStatus } from "../interfaces/pqr.interface.js";

export const createPqrService = async ({
  title,
  description,
  userId,
}: CreatePqrData) => {
  const pqr = await prisma.pQR.create({
    data: {
      title,
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
      status: "RESPONDIDA",
    },
  });

  return pqr;
};
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
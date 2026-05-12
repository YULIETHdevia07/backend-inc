import prisma from "../../prisma/client.js";

interface CreatePqrData {
  title: string;
  description: string;
  userId: number;
}

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
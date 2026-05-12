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
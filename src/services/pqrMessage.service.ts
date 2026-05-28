import type { Role } from "@prisma/client";
import prisma from "../config/client.js";
import type { CreatePqrMessageData } from "../interfaces/pqrMessage.interface.js";


export const createPqrMessageService = async ({
    pqrId,
    senderId,
    senderRole,
    content,
}: CreatePqrMessageData) => {
    const cleanContent = content?.trim();

    if (!cleanContent) {
        throw new Error("El mensaje es obligatorio");
    }

    if (cleanContent.length > 1000) {
        throw new Error("El mensaje no puede superar los 1000 caracteres");
    }

    const pqr = await prisma.pQR.findUnique({
        where: { id: pqrId },
    });

    if (!pqr) {
        throw new Error("La PQR no existe");
    }

    if (pqr.status === "CERRADA") {
        throw new Error("No se pueden enviar mensajes en una PQR cerrada");
    }

    if (senderRole === "USER" && pqr.userId !== senderId) {
        throw new Error("Solo puedes enviar mensajes en las PQR creadas por ti");
    }

    if (senderRole === "AGENT" && pqr.assignedToId !== senderId) {
        throw new Error("Solo puedes enviar mensajes en las PQR asignadas a ti");
    }

    const message = await prisma.pqrMessage.create({
        data: {
            content: cleanContent,
            pqrId,
            senderId,
        },
        include: {
            sender: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
        },
    });

    return message;
};

export const getPqrMessagesService = async (
    pqrId: number,
    userId: number,
    userRole: Role
) => {
    const pqr = await prisma.pQR.findUnique({
        where: { id: pqrId },
    });

    if (!pqr) {
        throw new Error("La PQR no existe");
    }

    if (userRole === "USER" && pqr.userId !== userId) {
        throw new Error("Solo puedes ver los mensajes de tus PQR");
    }

    if (userRole === "AGENT" && pqr.assignedToId !== userId) {
        throw new Error("Solo puedes ver los mensajes de las PQR asignadas a ti");
    }

    const messages = await prisma.pqrMessage.findMany({
        where: { pqrId },
        orderBy: {
            createdAt: "asc",
        },
        include: {
            sender: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
        },
    });

    return messages;
};
import type { Server } from "socket.io";
import type { AuthSocket } from "../interfaces/socket.interface.js";
import { createPqrMessageService } from "../services/pqrMessage.service.js";
import prisma from "../config/client.js";

// Registra los eventos socket relacionados únicamente con el chat de PQR
export const registerPqrSocketEvents = (
    io: Server,
    socket: AuthSocket
) => {
    socket.on("join_pqr", async ({ pqrId }) => {
        try {
            if (!socket.user) {
                socket.emit("socket_error", {
                    message: "Usuario no autenticado",
                });
                return;
            }

            const cleanPqrId = Number(pqrId);

            if (!cleanPqrId || Number.isNaN(cleanPqrId)) {
                socket.emit("socket_error", {
                    message: "El id de la PQR no es válido",
                });
                return;
            }

            const pqr = await prisma.pQR.findUnique({
                where: {
                    id: cleanPqrId,
                },
            });

            if (!pqr) {
                socket.emit("socket_error", {
                    message: "La PQR no existe",
                });
                return;
            }

            if (socket.user.role === "USER" && pqr.userId !== socket.user.id) {
                socket.emit("socket_error", {
                    message: "No puedes acceder a esta PQR",
                });
                return;
            }

            if (
                socket.user.role === "AGENT" &&
                pqr.assignedToId !== socket.user.id
            ) {
                socket.emit("socket_error", {
                    message: "No puedes acceder a esta PQR",
                });
                return;
            }

            socket.join(`pqr_${cleanPqrId}`);

            socket.emit("joined_pqr", {
                message: "Te uniste al chat de la PQR",
                pqrId: cleanPqrId,
            });
        } catch (error) {
            socket.emit("socket_error", {
                message: "Error al unirse al chat de la PQR",
            });
        }
    });

    socket.on("send_pqr_message", async ({ pqrId, content }) => {
        try {
            if (!socket.user) {
                socket.emit("socket_error", {
                    message: "Usuario no autenticado",
                });
                return;
            }

            const cleanPqrId = Number(pqrId);

            if (!cleanPqrId || Number.isNaN(cleanPqrId)) {
                socket.emit("socket_error", {
                    message: "El id de la PQR no es válido",
                });
                return;
            }

            const message = await createPqrMessageService({
                pqrId: cleanPqrId,
                content,
                senderId: socket.user.id,
                senderRole: socket.user.role,
            });

            io.to(`pqr_${cleanPqrId}`).emit("new_pqr_message", message);
        } catch (error) {
            socket.emit("socket_error", {
                message:
                    error instanceof Error
                        ? error.message
                        : "Error al enviar el mensaje",
            });
        }
    });
};
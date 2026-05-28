import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import { socketAuthMiddleware } from "../middlewares/socketAuth.middleware.js";
import { registerPqrSocket } from "../sockets/pqr.socket.js";

// Inicializa Socket.IO y registra sus middlewares y eventos.
export const initSocket = (server: HttpServer) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
        },
    });

    io.use(socketAuthMiddleware);

    registerPqrSocket(io);

    return io;
};
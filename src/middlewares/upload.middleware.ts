import multer from "multer";

// Guarda el archivo en memoria para leerlo desde req.file.buffer.
const storage = multer.memoryStorage();

// Middleware para recibir archivos Excel.
export const uploadExcel = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel",
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new Error("Solo se permiten archivos Excel"));
        }

        cb(null, true);
    },
});
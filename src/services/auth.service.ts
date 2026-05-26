
import bcrypt from "bcryptjs";
import prisma from "../../prisma/client.js";
import { isValidEmail, isValidName } from "../utils/validators.js";

interface RegisterUserData {
    name: string;
    email: string;
    password: string;
}

export const registerUserService = async ({
    name,
    email,
    password,
}: RegisterUserData) => {
    // Limpia espacios y normaliza los datos
    const cleanName = name?.trim();
    const cleanEmail = email?.trim().toLowerCase();
    const cleanPassword = password?.trim();

    if (!cleanName || !cleanEmail || !cleanPassword) {
        throw new Error("Todos los campos son obligatorios");
    }

    if (!isValidName(cleanName)) {
        throw new Error(
            "El nombre solo puede contener letras"
        );
    }

    if (cleanName.length < 3) {
        throw new Error("El nombre debe tener mínimo 3 caracteres");
    }

    if (!isValidEmail(cleanEmail)) {
        throw new Error("El correo electrónico no tiene un formato válido");
    }

    if (cleanPassword.length < 6) {
        throw new Error("La contraseña debe tener mínimo 6 caracteres");
    }

    const userExists = await prisma.user.findUnique({
        where: {
            email: cleanEmail,
        },
    });

    if (userExists) {
        throw new Error("El usuario ya existe");
    }

    const hashedPassword = await bcrypt.hash(cleanPassword, 10);

    const user = await prisma.user.create({
        data: {
            name: cleanName,
            email: cleanEmail,
            password: hashedPassword,
        },
    });

    // Retira la contraseña antes de responder
    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
};
import prisma from "../../prisma/client.js";
import { Role } from "@prisma/client";

export const getAllUsersService = async () => {
    const users = await prisma.user.findMany({
        orderBy: {
            id: "desc",
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });

    return users;
};

export const getUserByIdService = async (id: number) => {
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
    });

    return user;
};

export const updateUserRoleService = async (
    id: number,
    role: Role
) => {
    const user = await prisma.user.update({
        where: {
            id,
        },
        data: {
            role,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });

    return user;
};
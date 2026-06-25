import prisma from "../../config/client.js";

export const getActiveDepartmentsService = async () => {
    const departments = await prisma.department.findMany({
        where: {
            isActive: true,
        },
        select: {
            id: true,
            code: true,
            name: true,
        },
        orderBy: {
            name: "asc",
        },
    });

    return departments;
};
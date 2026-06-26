import prisma from "../../config/client.js";
import type { CreatePersonnelRequisitionData } from "../../interfaces/humanTalent/personnelRequisition.interface.js";

// Crea una requisición de personal en la base de datos.
export const createPersonnelRequisitionService = async ({
    departmentId,
    positionId,
    reason,
    otherReason,
    cityId,
    contractType,
    directContractType,
    contractDurationMonths,
    internContractType,
    proposedSalary,
    createdById,
}: CreatePersonnelRequisitionData) => {
    const department = await prisma.department.findFirst({
        where: {
            id: departmentId,
            isActive: true,
        },
    });

    if (!department) {
        throw new Error("El área solicitante no existe o está inactiva");
    }

    const position = await prisma.positionProfile.findFirst({
        where: {
            id: positionId,
            isActive: true,
        },
    });

    if (!position) {
        throw new Error("El cargo requerido no existe o está inactivo");
    }

    const city = await prisma.city.findFirst({
        where: {
            id: cityId,
            isActive: true,
        },
    });

    if (!city) {
        throw new Error("La ciudad no existe o está inactiva");
    }

    const user = await prisma.user.findUnique({
        where: {
            id: createdById,
        },
    });

    if (!user) {
        throw new Error("El usuario que crea la requisición no existe");
    }

    if (reason === "OTROS" && !otherReason?.trim()) {
        throw new Error("Debe especificar el motivo de la requisición");
    }

    if (!contractType) {
        throw new Error("El tipo de contratación es obligatorio");
    }

    if (contractType === "DIRECTO" && !directContractType) {
        throw new Error("Debe seleccionar el tipo de contrato directo");
    }

    if (
        contractType === "DIRECTO" &&
        directContractType === "FIJO" &&
        (!contractDurationMonths || contractDurationMonths <= 0)
    ) {
        throw new Error("Debe indicar la duración del contrato fijo en meses");
    }

    if (
        contractType === "TEMPORAL" &&
        (!contractDurationMonths || contractDurationMonths <= 0)
    ) {
        throw new Error("Debe indicar la duración del contrato temporal en meses");
    }

    if (contractType === "PRACTICANTE" && !internContractType) {
        throw new Error("Debe seleccionar el tipo de practicante");
    }

    let cleanOtherReason: string | null = null;

    if (reason === "OTROS") {
        cleanOtherReason = otherReason ? otherReason.trim() : null;
    }

    const cleanDirectContractType =
        contractType === "DIRECTO" ? directContractType : null;

    const cleanContractDurationMonths =
        contractType === "TEMPORAL" ||
            (contractType === "DIRECTO" && directContractType === "FIJO")
            ? contractDurationMonths
            : null;

    const cleanInternContractType =
        contractType === "PRACTICANTE" ? internContractType : null;

    const requisition = await prisma.personnelRequisition.create({
        data: {
            departmentId,
            positionId,
            reason,
            otherReason: cleanOtherReason,
            cityId,
            contractType,
            directContractType: cleanDirectContractType,
            contractDurationMonths: cleanContractDurationMonths,
            internContractType: cleanInternContractType,
            proposedSalary,
            createdById,
        },
        include: {
            department: {
                select: {
                    id: true,
                    code: true,
                    name: true,
                },
            },
            position: {
                select: {
                    id: true,
                    code: true,
                    name: true,
                },
            },
            city: {
                select: {
                    id: true,
                    name: true,
                },
            },
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
        },
    });

    return requisition;
};

// Obtiene el listado de requisiciones de personal.
export const getPersonnelRequisitionsService = async () => {
    const requisitions = await prisma.personnelRequisition.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            department: {
                select: {
                    id: true,
                    code: true,
                    name: true,
                },
            },
            position: {
                select: {
                    id: true,
                    code: true,
                    name: true,
                },
            },
            city: {
                select: {
                    id: true,
                    name: true,
                },
            },
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
        },
    });

    return requisitions;
};
import prisma from "../../config/client.js";
import type { CreatePersonnelRequisitionData, DecidePersonnelRequisitionData } from "../../interfaces/humanTalent/personnelRequisition.interface.js";
import { calculatePersonnelRequisitionStatus } from "../../utils/humanTalent/requisitionStatus.helper.js";

// Crea una requisición de personal.
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

    const requisition = await prisma.$transaction(async (tx) => {
        const jefeAreaStep = await tx.requisitionApprovalStep.findFirst({
            where: {
                requiredRole: "JEFE_AREA",
                isActive: true,
            },
        });

        if (!jefeAreaStep) {
            throw new Error("No existe el paso de aprobación para Jefe de Área");
        }

        const nextStep = await tx.requisitionApprovalStep.findFirst({
            where: {
                stepOrder: {
                    gt: jefeAreaStep.stepOrder,
                },
                isActive: true,
            },
            orderBy: {
                stepOrder: "asc",
            },
        });

        const createdRequisition = await tx.personnelRequisition.create({
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
        });

        // Registra automáticamente la aprobación del Jefe de Área.
        await tx.personnelRequisitionApproval.create({
            data: {
                requisitionId: createdRequisition.id,
                stepId: jefeAreaStep.id,
                decision: "APROBADA",
                decidedById: createdById,
            },
        });

        // Notifica al siguiente rol del flujo de aprobación.
        if (nextStep) {
            const usersToNotify = await tx.user.findMany({
                where: {
                    role: nextStep.requiredRole,
                },
                select: {
                    id: true,
                },
            });

            if (usersToNotify.length > 0) {
                await tx.notification.createMany({
                    data: usersToNotify.map((user) => ({
                        userId: user.id,
                        personnelRequisitionId: createdRequisition.id,
                        type: "REQUISITION_PENDING_APPROVAL",
                        title: "Nueva requisición pendiente",
                        message: `Tienes una requisición pendiente por aprobar como ${nextStep.name}.`,
                    })),
                });
            }
        }

        const requisitionWithRelations = await tx.personnelRequisition.findUnique({
            where: {
                id: createdRequisition.id,
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
                approvals: {
                    include: {
                        step: true,
                        decidedBy: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                role: true,
                            },
                        },
                    },
                },
            },
        });

        return requisitionWithRelations;
    });

    return requisition;
};

// Obtiene el listado de requisiciones de personal con estado calculado.
export const getPersonnelRequisitionsService = async () => {
    const requisitionApprovalSteps = await prisma.requisitionApprovalStep.findMany({
        where: {
            isActive: true,
        },
        orderBy: {
            stepOrder: "asc",
        },
    });

    const hiringConfirmationApprovalSteps =
        await prisma.hiringConfirmationApprovalStep.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                stepOrder: "asc",
            },
        });

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
            approvals: {
                include: {
                    step: true,
                    decidedBy: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                        },
                    },
                },
            },
            hiringConfirmation: {
                include: {
                    approvals: {
                        include: {
                            step: true,
                            decidedBy: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    role: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    const requisitionsWithStatus = requisitions.map((requisition) => {
        const status = calculatePersonnelRequisitionStatus({
            requisitionApprovals: requisition.approvals,
            requisitionApprovalSteps,
            hiringConfirmation: requisition.hiringConfirmation,
            hiringConfirmationApprovalSteps,
        });

        return {
            ...requisition,
            status,
        };
    });

    return requisitionsWithStatus;
};

// Registra la decisión de aprobación o rechazo de una requisición.
export const decidePersonnelRequisitionService = async ({
    requisitionId,
    decision,
    comment,
    decidedById,
}: DecidePersonnelRequisitionData) => {
    const result = await prisma.$transaction(async (tx) => {
        const requisition = await tx.personnelRequisition.findUnique({
            where: {
                id: requisitionId,
            },
            include: {
                approvals: true,
                createdBy: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        if (!requisition) {
            throw new Error("La requisición de personal no existe");
        }

        const user = await tx.user.findUnique({
            where: {
                id: decidedById,
            },
            select: {
                id: true,
                role: true,
            },
        });

        if (!user) {
            throw new Error("El usuario que toma la decisión no existe");
        }

        const approvalSteps = await tx.requisitionApprovalStep.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                stepOrder: "asc",
            },
        });

        const pendingStep = approvalSteps.find((step) => {
            return !requisition.approvals.some((approval) => {
                return approval.stepId === step.id;
            });
        });

        if (!pendingStep) {
            throw new Error("La requisición ya completó su flujo de aprobación");
        }

        if (pendingStep.requiredRole !== user.role) {
            throw new Error("No tienes permisos para decidir esta requisición");
        }

        const approval = await tx.personnelRequisitionApproval.create({
            data: {
                requisitionId,
                stepId: pendingStep.id,
                decision,
                comment: comment?.trim() || null,
                decidedById,
            },
        });

        if (decision === "RECHAZADA") {
            await tx.notification.create({
                data: {
                    userId: requisition.createdBy.id,
                    personnelRequisitionId: requisition.id,
                    type: "REQUISITION_REJECTED",
                    title: "Requisición rechazada",
                    message: `Tu requisición fue rechazada en el paso ${pendingStep.name}.`,
                },
            });

            return approval;
        }

        if (decision === "CANCELADA") {
            await tx.notification.create({
                data: {
                    userId: requisition.createdBy.id,
                    personnelRequisitionId: requisition.id,
                    type: "REQUISITION_REJECTED",
                    title: "Requisición cancelada",
                    message: `Tu requisición fue cancelada en el paso ${pendingStep.name}.`,
                },
            });

            return approval;
        }

        const nextStep = approvalSteps.find((step) => {
            return step.stepOrder > pendingStep.stepOrder;
        });

        if (nextStep) {
            const usersToNotify = await tx.user.findMany({
                where: {
                    role: nextStep.requiredRole,
                },
                select: {
                    id: true,
                },
            });

            if (usersToNotify.length > 0) {
                await tx.notification.createMany({
                    data: usersToNotify.map((userToNotify) => ({
                        userId: userToNotify.id,
                        personnelRequisitionId: requisition.id,
                        type: "REQUISITION_PENDING_APPROVAL",
                        title: "Nueva requisición pendiente",
                        message: `Tienes una requisición pendiente por aprobar como ${nextStep.name}.`,
                    })),
                });
            }
        } else {
            const talentUsers = await tx.user.findMany({
                where: {
                    role: "ANALISTA_TALENTO_HUMANO",
                },
                select: {
                    id: true,
                },
            });

            if (talentUsers.length > 0) {
                await tx.notification.createMany({
                    data: talentUsers.map((talentUser) => ({
                        userId: talentUser.id,
                        personnelRequisitionId: requisition.id,
                        type: "HIRING_CONFIRMATION_PENDING",
                        title: "Confirmación de contratación pendiente",
                        message: "Una requisición fue aprobada por Gerencia General y está pendiente de confirmación de contratación.",
                    })),
                });
            }
        }

        return approval;
    });

    return result;
};
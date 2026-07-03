import prisma from "../../config/client.js";
import type {
    CreatePersonnelHiringConfirmationData,
    DecidePersonnelHiringConfirmationData,
} from "../../interfaces/humanTalent/personnelHiringConfirmation.interface.js";

// Crea la confirmación final de contratación de una requisición.
export const createPersonnelHiringConfirmationService = async ({
    requisitionId,
    contractType,
    directContractType,
    contractDurationMonths,
    internContractType,
    approvedSalary,
    createdById,
}: CreatePersonnelHiringConfirmationData) => {
    const result = await prisma.$transaction(async (tx) => {
        const requisition = await tx.personnelRequisition.findUnique({
            where: {
                id: requisitionId,
            },
            include: {
                approvals: true,
                hiringConfirmation: true,
            },
        });

        if (!requisition) {
            throw new Error("La requisición de personal no existe");
        }

        if (requisition.hiringConfirmation) {
            throw new Error(
                "Esta requisición ya tiene una confirmación de contratación"
            );
        }

        const requisitionApprovalSteps =
            await tx.requisitionApprovalStep.findMany({
                where: {
                    isActive: true,
                },
            });

        const hasRejectedRequisition = requisition.approvals.some(
            (approval) =>
                approval.decision === "RECHAZADA" ||
                approval.decision === "CANCELADA"
        );

        if (hasRejectedRequisition) {
            throw new Error(
                "No se puede confirmar una requisición rechazada o cancelada"
            );
        }

        const allRequisitionStepsApproved = requisitionApprovalSteps.every(
            (step) =>
                requisition.approvals.some(
                    (approval) =>
                        approval.stepId === step.id &&
                        approval.decision === "APROBADA"
                )
        );

        if (!allRequisitionStepsApproved) {
            throw new Error(
                "La requisición todavía no ha sido aprobada por todos los responsables"
            );
        }

        const user = await tx.user.findUnique({
            where: {
                id: createdById,
            },
            select: {
                id: true,
                role: true,
            },
        });

        if (!user) {
            throw new Error("El usuario que confirma la contratación no existe");
        }

        if (user.role !== "ANALISTA_TALENTO_HUMANO") {
            throw new Error(
                "Solo el Analista de Talento Humano puede registrar la confirmación"
            );
        }

        if (contractType === "DIRECTO" && !directContractType) {
            throw new Error("Debe seleccionar el tipo de contrato directo");
        }

        if (
            contractType === "DIRECTO" &&
            directContractType === "FIJO" &&
            (!contractDurationMonths || contractDurationMonths <= 0)
        ) {
            throw new Error(
                "Debe indicar la duración del contrato fijo en meses"
            );
        }

        if (
            contractType === "TEMPORAL" &&
            (!contractDurationMonths || contractDurationMonths <= 0)
        ) {
            throw new Error(
                "Debe indicar la duración del contrato temporal en meses"
            );
        }

        if (contractType === "PRACTICANTE" && !internContractType) {
            throw new Error("Debe seleccionar el tipo de practicante");
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

        const analistaStep =
            await tx.hiringConfirmationApprovalStep.findFirst({
                where: {
                    requiredRole: "ANALISTA_TALENTO_HUMANO",
                    isActive: true,
                },
            });

        if (!analistaStep) {
            throw new Error(
                "No existe el paso de aprobación para Analista de Talento Humano"
            );
        }

        const nextStep = await tx.hiringConfirmationApprovalStep.findFirst({
            where: {
                stepOrder: {
                    gt: analistaStep.stepOrder,
                },
                isActive: true,
            },
            orderBy: {
                stepOrder: "asc",
            },
        });

        const hiringConfirmation =
            await tx.personnelHiringConfirmation.create({
                data: {
                    requisitionId,
                    contractType,
                    directContractType: cleanDirectContractType,
                    contractDurationMonths: cleanContractDurationMonths,
                    internContractType: cleanInternContractType,
                    approvedSalary,
                    createdById,
                },
            });

        await tx.personnelHiringConfirmationApproval.create({
            data: {
                hiringConfirmationId: hiringConfirmation.id,
                stepId: analistaStep.id,
                decision: "APROBADA",
                decidedById: createdById,
            },
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
                        personnelRequisitionId: requisitionId,
                        type: "HIRING_CONFIRMATION_PENDING",
                        title: "Confirmación de contratación pendiente",
                        message: `Tienes una confirmación de contratación pendiente por aprobar como ${nextStep.name}.`,
                    })),
                });
            }
        }

        const hiringConfirmationWithRelations =
            await tx.personnelHiringConfirmation.findUnique({
                where: {
                    id: hiringConfirmation.id,
                },
                include: {
                    requisition: {
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

        return hiringConfirmationWithRelations;
    });

    return result;
};

// Registra la decisión de aprobación o rechazo de una confirmación de contratación.
export const decidePersonnelHiringConfirmationService = async ({
    hiringConfirmationId,
    decision,
    comment,
    decidedById,
}: DecidePersonnelHiringConfirmationData) => {
    const result = await prisma.$transaction(async (tx) => {
        const hiringConfirmation =
            await tx.personnelHiringConfirmation.findUnique({
                where: {
                    id: hiringConfirmationId,
                },
                include: {
                    approvals: true,
                    requisition: {
                        select: {
                            id: true,
                            createdById: true,
                        },
                    },
                },
            });

        if (!hiringConfirmation) {
            throw new Error("La confirmación de contratación no existe");
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

        const approvalSteps =
            await tx.hiringConfirmationApprovalStep.findMany({
                where: {
                    isActive: true,
                },
                orderBy: {
                    stepOrder: "asc",
                },
            });

        const hasRejectedOrCanceled = hiringConfirmation.approvals.some(
            (approval) =>
                approval.decision === "RECHAZADA" ||
                approval.decision === "CANCELADA"
        );

        if (hasRejectedOrCanceled) {
            throw new Error(
                "Esta confirmación ya fue rechazada o cancelada"
            );
        }

        const pendingStep = approvalSteps.find((step) => {
            return !hiringConfirmation.approvals.some((approval) => {
                return approval.stepId === step.id;
            });
        });

        if (!pendingStep) {
            throw new Error(
                "La confirmación de contratación ya completó su flujo de aprobación"
            );
        }

        if (pendingStep.requiredRole !== user.role) {
            throw new Error(
                "No tienes permisos para decidir esta confirmación de contratación"
            );
        }

        const approval =
            await tx.personnelHiringConfirmationApproval.create({
                data: {
                    hiringConfirmationId,
                    stepId: pendingStep.id,
                    decision,
                    comment: comment?.trim() || null,
                    decidedById,
                },
            });

        if (decision === "RECHAZADA") {
            await tx.notification.create({
                data: {
                    userId: hiringConfirmation.requisition.createdById,
                    personnelRequisitionId:
                        hiringConfirmation.requisition.id,
                    type: "HIRING_CONFIRMATION_REJECTED",
                    title: "Confirmación de contratación rechazada",
                    message: `La confirmación de contratación fue rechazada en el paso ${pendingStep.name}.`,
                },
            });

            return approval;
        }

        if (decision === "CANCELADA") {
            await tx.notification.create({
                data: {
                    userId: hiringConfirmation.requisition.createdById,
                    personnelRequisitionId:
                        hiringConfirmation.requisition.id,
                    type: "HIRING_CONFIRMATION_REJECTED",
                    title: "Confirmación de contratación cancelada",
                    message: `La confirmación de contratación fue cancelada en el paso ${pendingStep.name}.`,
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
                        personnelRequisitionId:
                            hiringConfirmation.requisition.id,
                        type: "HIRING_CONFIRMATION_PENDING",
                        title: "Confirmación de contratación pendiente",
                        message: `Tienes una confirmación de contratación pendiente por aprobar como ${nextStep.name}.`,
                    })),
                });
            }
        } else {
            await tx.notification.create({
                data: {
                    userId: hiringConfirmation.requisition.createdById,
                    personnelRequisitionId:
                        hiringConfirmation.requisition.id,
                    type: "HIRING_CONFIRMATION_APPROVED",
                    title: "Requisición aprobada",
                    message:
                        "La requisición de personal completó todo el proceso de aprobación.",
                },
            });
        }

        return approval;
    });

    return result;
};
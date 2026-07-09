import prisma from "../../config/client.js";

import {
    buildHiringConfirmationApprovalCreateManyData,
    buildHiringConfirmationApprovalFlow,
} from "../../utils/humanTalent/hiringConfirmationApprovalFlow.helper.js";

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

        if (requisition.status !== "PENDIENTE_CONFIRMACION_TALENTO_HUMANO") {
            throw new Error(
                "La requisición todavía no está lista para confirmación de Talento Humano"
            );
        }

        const user = await tx.user.findUnique({
            where: {
                id: createdById,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });

        if (!user) {
            throw new Error("El usuario que confirma la contratación no existe");
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

        if (!approvedSalary || approvedSalary <= 0) {
            throw new Error("El salario aprobado debe ser mayor a cero");
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

        // Construye el flujo de Talento Humano desde la configuración activa.
        const approvalSteps = await buildHiringConfirmationApprovalFlow(
            tx,
            createdById
        );

        const analystStep = approvalSteps.find(
            (step) => step.approvalOrder === 1
        );

        if (!analystStep || analystStep.approverUserId !== createdById) {
            throw new Error(
                "Solo el usuario asignado al primer VoBo de Talento Humano puede registrar la confirmación"
            );
        }

        const firstPendingStep = approvalSteps.find(
            (step) => !step.isAutoApproved
        );

        const hiringConfirmation =
            await tx.personnelHiringConfirmation.create({
                data: {
                    requisitionId,
                    contractType,
                    directContractType: cleanDirectContractType,
                    contractDurationMonths: cleanContractDurationMonths,
                    internContractType: cleanInternContractType,
                    approvedSalary,
                    status: "PENDIENTE_APROBACION",
                    createdById,
                },
            });

        // Crea los pasos de aprobación de la confirmación de contratación.
        await tx.personnelHiringConfirmationApproval.createMany({
            data: buildHiringConfirmationApprovalCreateManyData(
                hiringConfirmation.id,
                approvalSteps,
                createdById
            ),
        });

        // La requisición pasa a espera de aprobación final de Talento Humano.
        await tx.personnelRequisition.update({
            where: {
                id: requisitionId,
            },
            data: {
                status: "PENDIENTE_APROBACION_TALENTO_HUMANO",
            },
        });

        if (!firstPendingStep) {
            throw new Error(
                "No se encontró un paso pendiente para aprobar la confirmación de contratación"
            );
        }

        // Notifica al siguiente aprobador de Talento Humano.
        await tx.notification.create({
            data: {
                userId: firstPendingStep.approverUserId,
                personnelRequisitionId: requisitionId,
                type: "HIRING_CONFIRMATION_PENDING",
                title: "Confirmación de contratación pendiente",
                message:
                    "Tienes una confirmación de contratación pendiente por aprobar.",
            },
        });

        return tx.personnelHiringConfirmation.findUnique({
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
                    orderBy: {
                        approvalOrder: "asc",
                    },
                    include: {
                        approverPosition: {
                            select: {
                                id: true,
                                code: true,
                                name: true,
                            },
                        },
                        approverUser: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                role: true,
                            },
                        },
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
    });

    return result;
};

// Registra la decisión de aprobación, rechazo o cancelación de una confirmación de contratación.
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
                    approvals: {
                        orderBy: {
                            approvalOrder: "asc",
                        },
                    },
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

        if (
            hiringConfirmation.status === "APROBADA" ||
            hiringConfirmation.status === "RECHAZADA" ||
            hiringConfirmation.status === "CANCELADA"
        ) {
            throw new Error(
                "Esta confirmación de contratación ya tiene un estado final"
            );
        }

        const user = await tx.user.findUnique({
            where: {
                id: decidedById,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });

        if (!user) {
            throw new Error("El usuario que toma la decisión no existe");
        }

        const currentApproval = hiringConfirmation.approvals.find(
            (approval) => approval.isCurrent
        );

        if (!currentApproval) {
            throw new Error(
                "La confirmación no tiene un paso activo para decidir"
            );
        }

        if (currentApproval.approverUserId !== decidedById) {
            throw new Error(
                "No tienes permisos para decidir esta confirmación de contratación"
            );
        }

        // Registra la decisión del paso actual.
        await tx.personnelHiringConfirmationApproval.update({
            where: {
                id: currentApproval.id,
            },
            data: {
                decision,
                comment: comment?.trim() || null,
                decidedById,
                decidedAt: new Date(),
                isCurrent: false,
            },
        });

        if (decision === "RECHAZADA" || decision === "CANCELADA") {
            await tx.personnelHiringConfirmation.update({
                where: {
                    id: hiringConfirmationId,
                },
                data: {
                    status: decision,
                },
            });

            await tx.personnelRequisition.update({
                where: {
                    id: hiringConfirmation.requisition.id,
                },
                data: {
                    status: decision,
                },
            });

            await tx.notification.create({
                data: {
                    userId: hiringConfirmation.requisition.createdById,
                    personnelRequisitionId: hiringConfirmation.requisition.id,
                    type: "HIRING_CONFIRMATION_REJECTED",
                    title:
                        decision === "RECHAZADA"
                            ? "Confirmación de contratación rechazada"
                            : "Confirmación de contratación cancelada",
                    message:
                        decision === "RECHAZADA"
                            ? "La confirmación de contratación fue rechazada."
                            : "La confirmación de contratación fue cancelada.",
                },
            });

            return tx.personnelHiringConfirmation.findUnique({
                where: {
                    id: hiringConfirmationId,
                },
                include: {
                    approvals: {
                        orderBy: {
                            approvalOrder: "asc",
                        },
                    },
                },
            });
        }

        const nextApproval = hiringConfirmation.approvals.find(
            (approval) =>
                approval.approvalOrder === currentApproval.approvalOrder + 1
        );

        if (nextApproval) {
            await tx.personnelHiringConfirmationApproval.update({
                where: {
                    id: nextApproval.id,
                },
                data: {
                    isCurrent: true,
                },
            });

            if (!nextApproval.approverUserId) {
                throw new Error(
                    "El siguiente paso no tiene un usuario aprobador asignado"
                );
            }

            await tx.notification.create({
                data: {
                    userId: nextApproval.approverUserId,
                    personnelRequisitionId: hiringConfirmation.requisition.id,
                    type: "HIRING_CONFIRMATION_PENDING",
                    title: "Confirmación de contratación pendiente",
                    message:
                        "Tienes una confirmación de contratación pendiente por aprobar.",
                },
            });

            return tx.personnelHiringConfirmation.findUnique({
                where: {
                    id: hiringConfirmationId,
                },
                include: {
                    approvals: {
                        orderBy: {
                            approvalOrder: "asc",
                        },
                    },
                },
            });
        }

        // Si no hay más pasos, finaliza completamente la requisición.
        await tx.personnelHiringConfirmation.update({
            where: {
                id: hiringConfirmationId,
            },
            data: {
                status: "APROBADA",
            },
        });

        await tx.personnelRequisition.update({
            where: {
                id: hiringConfirmation.requisition.id,
            },
            data: {
                status: "APROBADA",
            },
        });

        await tx.notification.create({
            data: {
                userId: hiringConfirmation.requisition.createdById,
                personnelRequisitionId: hiringConfirmation.requisition.id,
                type: "HIRING_CONFIRMATION_APPROVED",
                title: "Proceso de requisición finalizado",
                message:
                    "La requisición de personal fue aprobada completamente por Talento Humano.",
            },
        });

        return tx.personnelHiringConfirmation.findUnique({
            where: {
                id: hiringConfirmationId,
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
                    orderBy: {
                        approvalOrder: "asc",
                    },
                    include: {
                        approverPosition: {
                            select: {
                                id: true,
                                code: true,
                                name: true,
                            },
                        },
                        approverUser: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                role: true,
                            },
                        },
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
    });

    return result;
};
import type {
    ApprovalDecision,
    ContractType,
    DirectContractType,
    InternContractType,
} from "@prisma/client";

// Datos necesarios para crear la confirmación final de contratación.
export interface CreatePersonnelHiringConfirmationData {
    requisitionId: number;
    contractType: ContractType;
    directContractType: DirectContractType | null;
    contractDurationMonths: number | null;
    internContractType: InternContractType | null;
    approvedSalary: number;
    createdById: number;
}

// Datos necesarios para aprobar, rechazar o cancelar una confirmación de contratación.
export interface DecidePersonnelHiringConfirmationData {
    hiringConfirmationId: number;
    decision: ApprovalDecision;
    comment?: string | null;
    decidedById: number;
}
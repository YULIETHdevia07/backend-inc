import type {
  ApprovalDecision,
  ContractType,
  DirectContractType,
  InternContractType,
  RequisitionReason,
} from "@prisma/client";

// Datos necesarios para crear una requisición de personal.
export interface CreatePersonnelRequisitionData {
  departmentId: number;
  positionId: number;
  reason: RequisitionReason;
  otherReason?: string | null;
  cityId: number;

  contractType: ContractType;
  directContractType: DirectContractType | null;
  contractDurationMonths: number | null;
  internContractType: InternContractType | null;

  proposedSalary: number;
  createdById: number;
}

// Datos necesarios para aprobar, rechazar o cancelar una requisición.
export interface DecidePersonnelRequisitionData {
  requisitionId: number;
  decision: ApprovalDecision;
  comment?: string | null;
  decidedById: number;
}
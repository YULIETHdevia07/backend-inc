import type { RequisitionReason } from "@prisma/client";

// Datos necesarios para crear una requisición de personal.
export interface CreatePersonnelRequisitionData {
  departmentId: number;
  positionId: number;
  reason: RequisitionReason;
  otherReason?: string | null;
  cityId: number;
  proposedSalary: number;
  createdById: number;
}
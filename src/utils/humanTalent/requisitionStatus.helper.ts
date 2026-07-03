import type {
  ApprovalDecision,
  HiringConfirmationApprovalStep,
  PersonnelHiringConfirmation,
  PersonnelHiringConfirmationApproval,
  PersonnelRequisitionApproval,
  RequisitionApprovalStep,
} from "@prisma/client";

// Estados calculados de una requisición de personal.
export type PersonnelRequisitionComputedStatus =
  | "PENDIENTE_JEFE_AREA"
  | "PENDIENTE_JEFE_DEPARTAMENTO"
  | "PENDIENTE_GERENCIA_GENERAL"
  | "PENDIENTE_CONFIRMACION_TALENTO_HUMANO"
  | "PENDIENTE_ANALISTA_TALENTO_HUMANO"
  | "PENDIENTE_JEFE_TALENTO_HUMANO"
  | "APROBADA"
  | "RECHAZADA"
  | "CANCELADA";

// Datos necesarios para calcular el estado de una requisición.
interface CalculateRequisitionStatusParams {
  requisitionApprovals: PersonnelRequisitionApproval[];
  requisitionApprovalSteps: RequisitionApprovalStep[];
  hiringConfirmation:
    | (PersonnelHiringConfirmation & {
        approvals: PersonnelHiringConfirmationApproval[];
      })
    | null;
  hiringConfirmationApprovalSteps: HiringConfirmationApprovalStep[];
}

// Convierte el nombre del paso de aprobación en un estado legible para el sistema.
const getPendingRequisitionStatusByStep = (
  stepName: string
): PersonnelRequisitionComputedStatus => {
  if (stepName === "Jefe de Área") {
    return "PENDIENTE_JEFE_AREA";
  }

  if (stepName === "Jefe de Departamento") {
    return "PENDIENTE_JEFE_DEPARTAMENTO";
  }

  if (stepName === "Gerente General") {
    return "PENDIENTE_GERENCIA_GENERAL";
  }

  return "PENDIENTE_JEFE_AREA";
};

// Convierte el nombre del paso de VoBo en un estado legible para el sistema.
const getPendingHiringStatusByStep = (
  stepName: string
): PersonnelRequisitionComputedStatus => {
  if (stepName === "Analista de Talento Humano") {
    return "PENDIENTE_ANALISTA_TALENTO_HUMANO";
  }

  if (stepName === "Jefe de Talento Humano") {
    return "PENDIENTE_JEFE_TALENTO_HUMANO";
  }

  return "PENDIENTE_CONFIRMACION_TALENTO_HUMANO";
};

// Verifica si dentro de una lista de decisiones existe una decisión específica.
const hasDecision = (
  approvals: { decision: ApprovalDecision }[],
  decision: ApprovalDecision
) => {
  return approvals.some((approval) => approval.decision === decision);
};

// Calcula el estado actual de una requisición de personal.
export const calculatePersonnelRequisitionStatus = ({
  requisitionApprovals,
  requisitionApprovalSteps,
  hiringConfirmation,
  hiringConfirmationApprovalSteps,
}: CalculateRequisitionStatusParams): PersonnelRequisitionComputedStatus => {
  if (hasDecision(requisitionApprovals, "RECHAZADA")) {
    return "RECHAZADA";
  }

  if (hasDecision(requisitionApprovals, "CANCELADA")) {
    return "CANCELADA";
  }

  const sortedRequisitionSteps = [...requisitionApprovalSteps].sort(
    (a, b) => a.stepOrder - b.stepOrder
  );

  const pendingRequisitionStep = sortedRequisitionSteps.find((step) => {
    return !requisitionApprovals.some((approval) => {
      return approval.stepId === step.id;
    });
  });

  if (pendingRequisitionStep) {
    return getPendingRequisitionStatusByStep(pendingRequisitionStep.name);
  }

  if (!hiringConfirmation) {
    return "PENDIENTE_CONFIRMACION_TALENTO_HUMANO";
  }

  if (hasDecision(hiringConfirmation.approvals, "RECHAZADA")) {
    return "RECHAZADA";
  }

  if (hasDecision(hiringConfirmation.approvals, "CANCELADA")) {
    return "CANCELADA";
  }

  const sortedHiringSteps = [...hiringConfirmationApprovalSteps].sort(
    (a, b) => a.stepOrder - b.stepOrder
  );

  const pendingHiringStep = sortedHiringSteps.find((step) => {
    return !hiringConfirmation.approvals.some((approval) => {
      return approval.stepId === step.id;
    });
  });

  if (pendingHiringStep) {
    return getPendingHiringStatusByStep(pendingHiringStep.name);
  }

  return "APROBADA";
};
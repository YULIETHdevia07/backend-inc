import { PqrCaseType } from "@prisma/client";

export interface CreatePqrData {
  caseType: PqrCaseType;
  description: string;
  userId: number;
}


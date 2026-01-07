
export type DocType = 'retainer' | 'end_rep' | 'collection' | 'fdd_review';
export type BillingType = 'hourly' | 'flat_fee';
export type UserRole = 'Admin' | 'Legal Associate';

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

export interface DocumentVersion {
  id: string;
  timestamp: string;
  data: FormData;
  docType: DocType;
  version: number;
}

export interface DocSection {
  id: string;
  title: string;
  content: string;
  isOptional?: boolean;
  /** Logic-based visibility */
  condition?: (data: FormData) => boolean;
  explanation?: string;
  /** Tag for identifying specialized logic (e.g., 'jurisdiction', 'billing') */
  tag?: 'standard' | 'jurisdiction' | 'billing' | 'optional';
  /** Safety flag to indicate if text can be manually overridden in the future (Phase 5) */
  isImmutable?: boolean;
}

export interface DocTemplate {
  id: DocType;
  name: string;
  description: string;
  sections: DocSection[];
  /** Variables required for this specific document to be considered "complete" */
  requiredFields: (keyof FormData)[];
}

export interface FormData {
  // Client Info
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  // Attorney/Firm Info
  attorneyName: string;
  firmName: string;
  // Case Details
  matterDescription: string;
  jurisdiction: string;
  effectiveDate: string;
  // Financials
  billingType: BillingType;
  hourlyRate: string;
  retainerAmount: string;
  flatFeeAmount: string;
  totalDebt?: string;
  dueDate?: string;
  // Conditional Flags
  includeTerminationClause: boolean;
  includeArbitrationClause: boolean;
  isBusinessEntity: boolean;
}

export const INITIAL_FORM_DATA: FormData = {
  clientName: '',
  clientAddress: '',
  clientEmail: '',
  attorneyName: 'John Doe, Esq.',
  firmName: 'LexiForge Legal Group',
  matterDescription: '',
  jurisdiction: 'New York',
  effectiveDate: new Date().toISOString().split('T')[0],
  billingType: 'hourly',
  hourlyRate: '350',
  retainerAmount: '2500',
  flatFeeAmount: '5000',
  totalDebt: '',
  dueDate: '',
  includeTerminationClause: true,
  includeArbitrationClause: false,
  isBusinessEntity: false,
};

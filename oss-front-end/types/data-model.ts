export interface LocalizedString {
  en: string;
  om?: string;
  am?: string;
  [key: string]: string | undefined;
}

export interface Sector {
  id: string;
  name: LocalizedString;
  code: string; // e.g., OIC
  logo_url?: string;
  description?: LocalizedString;
}

export interface ServiceRequirement {
  doc_type: string;
  mandatory: boolean;
  description?: LocalizedString;
}

export interface ServiceDefinition {
  id: string;
  sector_id: string;
  title: LocalizedString;
  description?: LocalizedString;
  attributes: {
    fee: number;
    currency: "ETB" | "USD";
    sla_hours: number;
  };
  requirements: ServiceRequirement[];
  form_schema_id: string;
  workflow_process_key: string;
  target_group?: string[]; // e.g. ["Business", "Citizen"]
  enabled: boolean;
}

export interface Application {
  id: string;
  service_id: string;
  applicant_fayda_id: string;
  status:
    | "DRAFT"
    | "SUBMITTED"
    | "PENDING_VERIFICATION"
    | "APPROVED"
    | "REJECTED";
  submitted_at?: string;
  updated_at: string;
  form_data: any;
  documents: {
    doc_type: string;
    file_url: string;
    uploaded_at: string;
  }[];
}

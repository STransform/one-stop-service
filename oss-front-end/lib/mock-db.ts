import { Sector, ServiceDefinition, Application } from "@/types/data-model";
import { FormSchema } from "@/components/FormEngine";

// --- Mock Data: Sectors ---
export const sectors: Sector[] = [
  {
    id: "sector_01",
    name: {
      en: "Investment Commission",
      om: "Komishinii Investimatii",
      am: "የኦሮሚያ ኢንቨስትመንት ኮሚሽን",
    },
    code: "OIC",
    description: {
      en: "Facilitating domestic and foreign investment in Oromia.",
    },
  },
  {
    id: "sector_02",
    name: { en: "Agriculture Bureau", om: "Biiroo Qonnaa", am: "ግብርና ቢሮ" },
    code: "OAB",
    description: { en: "Overseeing agricultural development and support." },
  },
  {
    id: "sector_03",
    name: {
      en: "Revenue Authority",
      om: "Abbaa Taayitaa Galiiwwanii",
      am: "ገቢዎች ባለስልጣን",
    },
    code: "ORA",
  },
];

// --- Mock Data: Form Schemas (JSON) ---
export const formSchemas: Record<string, FormSchema> = {
  schema_v12: {
    title: "New Investment Permit Application",
    description: "Official application for new investment projects in Oromia.",
    fields: [
      {
        id: "1",
        name: "project_name",
        label: "Project Name",
        type: "text",
        required: true,
        placeholder: "e.g. Oromia Agro-Processing",
      },
      {
        id: "2",
        name: "investment_sector",
        label: "Sector",
        type: "select",
        required: true,
        options: [
          { label: "Manufacturing", value: "manufacturing" },
          { label: "Agriculture", value: "agriculture" },
          { label: "Service", value: "service" },
          { label: "Mining", value: "mining" },
        ],
      },
      {
        id: "3",
        name: "capital",
        label: "Estimated Capital (ETB)",
        type: "number",
        required: true,
        placeholder: "1000000",
      },
      {
        id: "4",
        name: "location",
        label: "Project Location",
        type: "map",
        required: true,
        description: "Pin the exact location of the investment land",
      },
      {
        id: "5",
        name: "tin_number",
        label: "TIN Number",
        type: "text",
        required: true,
        placeholder: "TIN-123456",
      },
      {
        id: "6",
        name: "land_size",
        label: "Land Size (m2)",
        type: "number",
        required: true,
        conditional: { field: "investment_sector", value: "agriculture" },
        description: "Required for agriculture projects only",
      },
      {
        id: "7",
        name: "passport_copy",
        label: "Passport / ID Copy",
        type: "file",
        required: true,
      },
      {
        id: "8",
        name: "bank_statement",
        label: "Bank Statement",
        type: "file",
        required: true,
      },
    ],
  },
  schema_land_req: {
    title: "Land Request Application",
    fields: [
      { id: "1", name: "zone", label: "Zone", type: "text", required: true },
      {
        id: "2",
        name: "purpose",
        label: "Purpose",
        type: "textarea",
        required: true,
      },
    ],
  },
};

// --- Mock Data: Services ---
export const services: ServiceDefinition[] = [
  {
    id: "srv_01",
    sector_id: "sector_01",
    title: {
      en: "New Investment Permit",
      om: "Hayyama Investimatii Haaraa",
      am: "አዲስ የኢንቨስትመንት ፈቃድ",
    },
    description: {
      en: "Apply for a new investment license to operate in Oromia Region.",
    },
    attributes: {
      fee: 5000.0,
      currency: "ETB",
      sla_hours: 48,
    },
    requirements: [
      {
        doc_type: "passport",
        mandatory: true,
        description: { en: "Valid Passport or National ID" },
      },
      {
        doc_type: "bank_statement",
        mandatory: true,
        description: { en: "Proof of financial capacity (Last 6 months)" },
      },
      {
        doc_type: "proposal",
        mandatory: false,
        description: { en: "Project Proposal Document" },
      },
    ],
    form_schema_id: "schema_v12",
    workflow_process_key: "PROCESS_INVESTMENT_NEW",
    target_group: ["Business", "Investor"],
    enabled: true,
  },
  {
    id: "srv_02",
    sector_id: "sector_01",
    title: {
      en: "Investment Permit Renewal",
      om: "Haaromsa Hayyama Investimatii",
    },
    attributes: { fee: 200.0, currency: "ETB", sla_hours: 24 },
    requirements: [{ doc_type: "prev_permit", mandatory: true }],
    form_schema_id: "schema_v12", // Reusing schema for demo
    workflow_process_key: "PROCESS_INVESTMENT_RENEWAL",
    enabled: true,
  },
  {
    id: "srv_03",
    sector_id: "sector_02",
    title: { en: "Agricultural Land Request", om: "Gaaffii Lafa Qonnaa" },
    attributes: { fee: 0, currency: "ETB", sla_hours: 72 },
    requirements: [],
    form_schema_id: "schema_land_req",
    workflow_process_key: "PROCESS_LAND_REQ",
    enabled: true,
  },
];

// --- Mock Data: Applications ---
export const applications: Application[] = [];

// --- Helper Functions ---
export const getSectors = () => sectors;
export const getSectorById = (id: string) => sectors.find((s) => s.id === id);
export const getServices = () => services;
export const getServicesBySector = (sectorId: string) =>
  services.filter((s) => s.sector_id === sectorId);
export const getServiceById = (id: string) => services.find((s) => s.id === id);
export const getFormSchema = (id: string) => formSchemas[id];

// --- Mutable Actions (Simulated) ---
export const deleteService = (id: string) => {
  console.log(`Mock DB: Deleted Service [${id}]`);
  return true;
};

export const updateService = (id: string, data: Partial<ServiceDefinition>) => {
  console.log(`Mock DB: Updated Service [${id}] with:`, data);
  return true;
};

export const deleteSector = (id: string) => {
  console.log(`Mock DB: Deleted Sector [${id}]`);
  return true;
};

export const updateSector = (id: string, data: Partial<Sector>) => {
  console.log(`Mock DB: Updated Sector [${id}] with:`, data);
  return true;
};

export const saveApplication = (app: Application) => {
  console.log(`Mock DB: Saving Application:`, app);
  applications.push(app);
  return true;
};

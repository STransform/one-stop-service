import * as mockDb from "./mock-db";
import { Sector, ServiceDefinition } from "@/types/data-model";
import { FormSchema } from "@/components/FormEngine";
import { ServiceNode, serviceHierarchy } from "./service-hierarchy";

/**
 * Service Client abstraction.
 * This class handles all communication with the backend microservices.
 * Currently, it uses mock-db but is designed to be easily switched to real fetch() calls.
 */
class ServiceClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  }

  // --- Sectors (Service Catalog / Bureaus) ---
  async getSectors(): Promise<Sector[]> {
    // Phase 1: Mock
    return mockDb.getSectors();

    /* Phase 2: Real API (Go/PostgreSQL)
    const res = await fetch(`${this.baseUrl}/catalog/sectors`);
    if (!res.ok) throw new Error("Failed to fetch sectors");
    return res.json();
    */
  }

  async getServiceHierarchy(): Promise<ServiceNode[]> {
    // Phase 1: Mock
    return serviceHierarchy;

    /* Phase 2: Real API (Go/PostgreSQL)
    const res = await fetch(`${this.baseUrl}/catalog/hierarchy`);
    if (!res.ok) throw new Error("Failed to fetch hierarchy");
    return res.json();
    */
  }

  async getSectorById(id: string): Promise<Sector | undefined> {
    return mockDb.getSectorById(id);
  }

  // --- Services (Service Catalog) ---
  async getServices(): Promise<ServiceDefinition[]> {
    return mockDb.getServices();
  }

  async getServicesBySector(sectorId: string): Promise<ServiceDefinition[]> {
    return mockDb.getServicesBySector(sectorId);
  }

  async getServiceById(id: string): Promise<ServiceDefinition | undefined> {
    return mockDb.getServiceById(id);
  }

  // --- Mutable Actions (Simulated for Phase 1) ---
  async createService(data: Partial<ServiceDefinition>): Promise<boolean> {
    console.log("Mock API Call: Register Service:", data);
    return mockDb.updateService("new_" + Date.now(), data); // Reusing update as mock
  }

  async updateService(
    id: string,
    data: Partial<ServiceDefinition>,
  ): Promise<boolean> {
    console.log(`Mock API Call: Update Service [${id}] with:`, data);
    return mockDb.updateService(id, data);
  }

  async deleteService(id: string): Promise<boolean> {
    return mockDb.deleteService(id);
  }

  // --- Form Schemas (Form Service / MongoDB) ---
  async getFormSchema(id: string): Promise<FormSchema | undefined> {
    return mockDb.getFormSchema(id);

    /* Phase 2: Real API (NestJS/MongoDB)
    const res = await fetch(`${this.baseUrl}/forms/${id}`);
    if (!res.ok) throw new Error("Failed to fetch form schema");
    return res.json();
    */
  }

  async getAllFormSchemas(): Promise<Record<string, FormSchema>> {
    return mockDb.formSchemas;
  }

  // --- Applications (Workflow Service / Camunda) ---
  async submitApplication(data: any): Promise<{ id: string; status: string }> {
    console.log("Submitting to Workflow Engine (Camunda 8)...", data);
    return {
      id: "app_" + Math.random().toString(36).substr(2, 9),
      status: "SUBMITTED",
    };

    /* Phase 2: Real API (Spring Boot/Zeebe)
    const res = await fetch(`${this.baseUrl}/workflow/submit`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    });
    return res.json();
    */
  }
}

export const api = new ServiceClient();

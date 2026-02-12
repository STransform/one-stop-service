"use strict";
"use server";

import { auth } from "@/auth";
import { saveApplication } from "@/lib/mock-db";
import { Application } from "@/types/data-model";
import { revalidatePath } from "next/cache";

export async function registerApplication(
  serviceId: string,
  formData: any,
): Promise<{ success: boolean; applicationId?: string; error?: string }> {
  const session = await auth();

  if (!session || !session.user) {
    return { success: false, error: "Authentication required" };
  }

  const applicationId = `APP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  const newApplication: Application = {
    id: applicationId,
    service_id: serviceId,
    applicant_fayda_id: session.user.id || "anonymous",
    status: "SUBMITTED",
    submitted_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    form_data: formData,
    documents: [], // Handle document uploads in a real scenario
  };

  try {
    saveApplication(newApplication);

    // Potentially revalidate paths if there is a dashboard
    // revalidatePath('/[locale]/dashboard', 'page');

    return { success: true, applicationId };
  } catch (error) {
    console.error("Failed to register application:", error);
    return { success: false, error: "Failed to save application data" };
  }
}

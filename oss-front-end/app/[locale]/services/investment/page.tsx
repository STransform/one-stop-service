"use client";

import React from "react";
import { FormEngine, FormSchema } from "@/components/FormEngine";
import { api } from "@/lib/api-client";

const investmentSchema: FormSchema = {
    title: "Application for Investment Permit",
    fields: [
        {
            id: "f1",
            name: "applicantName",
            label: "Applicant Full Name",
            type: "text",
            required: true,
            placeholder: "Enter full legal name",
        },
        {
            id: "f2",
            name: "tinNumber",
            label: "Tax Identification Number (TIN)",
            type: "text",
            required: true,
            placeholder: "10-digit TIN",
        },
        {
            id: "f3",
            name: "plannedDate",
            label: "Proposed Project Start Date",
            type: "date",
            required: true,
        },
        {
            id: "f4",
            name: "projectProposal",
            label: "Project Proposal (Conceptual)",
            type: "file",
            required: true,
        },
        {
            id: "f5",
            name: "location",
            label: "Proposed Project Location (GIS)",
            type: "map",
            required: true,
        },
    ],
};

export default function InvestmentPermitPage() {
    const handleFormSubmit = async (data: any) => {
        try {
            console.log("Submitting Form...", data);
            const response = await api.submitApplication(data);
            alert(`Application submitted successfully! Tracking ID: ${response.id}`);
        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to submit application. Please try again.");
        }
    };

    return (
        <div className="container mx-auto py-12 px-4 max-w-4xl">
            <div className="mb-8 flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                    1
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-primary">Service: Investment Permit</h1>
                    <p className="text-muted-foreground">Oromia Investment Commission - Wirtuu Module</p>
                </div>
            </div>

            <FormEngine schema={investmentSchema} onSubmit={handleFormSubmit} />
        </div>
    );
}

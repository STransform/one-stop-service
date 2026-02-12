const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8084';

export interface FormSchema {
    id?: number;
    title: string;
    schemaJson: string;
    context?: string;
    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;
    active?: boolean;
}

export interface FormSubmission {
    id?: number;
    formSchemaId: number;
    submissionData: string;
    submittedBy?: string;
    submittedAt?: string;
}

// Save a form schema to backend
export async function saveFormSchema(title: string, schemaJson: string, context?: string): Promise<FormSchema> {
    const response = await fetch(`${API_BASE_URL}/api/forms`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ title, schemaJson, context }),
    });

    if (!response.ok) {
        throw new Error('Failed to save form schema');
    }
    return response.json();
}

// Get all forms
export async function getAllForms(context?: string): Promise<FormSchema[]> {
    const url = context
        ? `${API_BASE_URL}/api/forms?context=${context}`
        : `${API_BASE_URL}/api/forms`;

    const response = await fetch(url, {
        headers: {
            // 'Authorization': `Bearer ${getToken()}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch forms');
    }
    return response.json();
}

// Get a specific form by ID
export async function getFormById(id: number): Promise<FormSchema> {
    const response = await fetch(`${API_BASE_URL}/api/forms/${id}`, {
        headers: {
            // 'Authorization': `Bearer ${getToken()}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch form');
    }
    return response.json();
}

// Update a form schema
export async function updateFormSchema(id: number, title: string, schemaJson: string, context?: string): Promise<FormSchema> {
    const response = await fetch(`${API_BASE_URL}/api/forms/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ title, schemaJson, context }),
    });

    if (!response.ok) {
        throw new Error('Failed to update form');
    }
    return response.json();
}

// Delete a form
export async function deleteForm(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/forms/${id}`, {
        method: 'DELETE',
        headers: {
            // 'Authorization': `Bearer ${getToken()}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete form');
    }
}

// Submit form data
export async function submitFormData(formSchemaId: number, data: Record<string, any>): Promise<FormSubmission> {
    const response = await fetch(`${API_BASE_URL}/api/submissions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
            formSchemaId,
            submissionData: JSON.stringify(data),
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to submit form');
    }
    return response.json();
}

// Get submissions for a specific form
export async function getFormSubmissions(formSchemaId: number): Promise<FormSubmission[]> {
    const response = await fetch(`${API_BASE_URL}/api/submissions/form/${formSchemaId}`, {
        headers: {
            // 'Authorization': `Bearer ${getToken()}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch submissions');
    }
    return response.json();
}

// Get form by context (singleton pattern)
export async function getFormByContext(context: string): Promise<FormSchema | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/forms/by-context/${context}`, {
            headers: {
                // 'Authorization': `Bearer ${getToken()}`,
            },
        });

        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error('Failed to fetch form');
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching form by context:', error);
        return null;
    }
}

// Helper function to get auth token (implement based on your auth setup)
function getToken(): string {
    // Get token from localStorage, cookies, or your auth provider
    // For example, if using NextAuth:
    // return session?.accessToken || '';

    // For now, return empty string (you'll implement this when you add auth)
    return typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
}

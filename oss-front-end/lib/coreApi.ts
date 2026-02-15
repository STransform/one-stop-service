import { getSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:8083';

export interface BureauRegistry {
    id: string;
    code: string;
    name: string;
    description?: string;
}

// Helper to get auth headers
async function getAuthHeaders() {
    const session = await getSession();
    const token = session?.accessToken;
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
}

export async function getAllBureaus(): Promise<BureauRegistry[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/bureaus`, {
        headers,
    });

    if (!response.ok) {
        throw new Error('Failed to fetch bureaus');
    }
    return response.json();
}

export async function getBureauById(id: string): Promise<BureauRegistry> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/bureaus/${id}`, {
        headers,
    });

    if (!response.ok) {
        throw new Error('Failed to fetch bureau');
    }
    return response.json();
}

export async function createBureau(data: any): Promise<BureauRegistry> {
    const headers = await getAuthHeaders();
    const payload = {
        code: data.code,
        name: data.name,
        description: data.description
    };

    const response = await fetch(`${API_BASE_URL}/api/bureaus`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error('Failed to create bureau');
    }
    return response.json();
}

export async function createBureauFromForm(formData: any, formId?: number, schema?: any): Promise<BureauRegistry> {
    const headers = await getAuthHeaders();
    const payload = { ...formData };

    if (schema) {
        payload._schemaJson = JSON.stringify(schema);
    }

    const url = formId
        ? `${API_BASE_URL}/api/bureaus/from-form?formId=${formId}`
        : `${API_BASE_URL}/api/bureaus/from-form`;

    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create bureau from form');
    }
    return response.json();
}

export async function updateBureau(id: string, data: any): Promise<BureauRegistry> {
    const headers = await getAuthHeaders();
    const payload = {
        id,
        code: data.code,
        name: data.name,
        description: data.description
    };

    const response = await fetch(`${API_BASE_URL}/api/bureaus/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error('Failed to update bureau');
    }
    return response.json();
}

export async function deleteBureau(id: string): Promise<void> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/bureaus/${id}`, {
        method: 'DELETE',
        headers,
    });

    if (!response.ok) {
        throw new Error('Failed to delete bureau');
    }
}

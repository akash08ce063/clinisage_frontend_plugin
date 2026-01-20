import { CookieUtils } from './cookieUtils';
import { API_BASE_URL } from './constants';

export interface Patient {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    created_at?: string;
}

export interface CreatePatientRequest {
    name: string;
    email?: string;
    phone?: string;
}

class PatientApi {
    private baseUrl = `${API_BASE_URL}/patients/`;

    private async getAuthHeaders(): Promise<HeadersInit> {
        const key = CookieUtils.getApiKeyWithDefault();
        return {
            'Content-Type': 'application/json',
            'x-api-key': key,
            "ngrok-skip-browser-warning": "true",
        };
    }

    async getPatients(): Promise<Patient[]> {
        try {
            const headers = await this.getAuthHeaders();
            const response = await fetch(this.baseUrl, {
                method: 'GET',
                headers
            });
            if (!response.ok) throw new Error('Failed to fetch patients');
            return await response.json();
        } catch (error) {
            console.error('Error fetching patients:', error);
            throw error;
        }
    }

    async createPatient(patient: CreatePatientRequest): Promise<Patient> {
        try {
            const headers = await this.getAuthHeaders();
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers,
                body: JSON.stringify(patient)
            });
            if (!response.ok) throw new Error('Failed to create patient');
            return await response.json();
        } catch (error) {
            console.error('Error creating patient:', error);
            throw error;
        }
    }
}

export const patientApi = new PatientApi();

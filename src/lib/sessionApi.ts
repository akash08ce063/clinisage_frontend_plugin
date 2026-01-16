import { CookieUtils } from './cookieUtils';
import { API_BASE_URL } from './constants';

export interface Session {
    id: string;
    name: string;
    practitioner_id: string;
    patient_id?: string;
    patient_name?: string;
    created_at?: string;
}

export interface CreateSessionRequest {
    name: string;
    patient_id?: string;
}

export interface UpdateSessionRequest {
    name?: string;
    patient_id?: string;
}

class SessionApi {
    private baseUrl = `${API_BASE_URL}/sessions/`;

    private async getAuthHeaders(): Promise<HeadersInit> {
        const key = CookieUtils.getApiKey();
        if (!key) return { 'Content-Type': 'application/json' };
        return {
            'Content-Type': 'application/json',
            'x-api-key': key,
            "ngrok-skip-browser-warning": "true",
        };
    }

    async createSession(session: CreateSessionRequest): Promise<Session> {
        try {
            const headers = await this.getAuthHeaders();
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers,
                body: JSON.stringify(session)
            });

            if (!response.ok) throw new Error('Failed to create session');
            return await response.json();
        } catch (error) {
            console.error('Error creating session:', error);
            throw error;
        }
    }

    async getSessions(): Promise<Session[]> {
        try {
            const headers = await this.getAuthHeaders();
            const response = await fetch(this.baseUrl, {
                method: 'GET',
                headers
            });
            if (!response.ok) throw new Error('Failed to fetch sessions');
            return await response.json();
        } catch (error) {
            console.error('Error fetching sessions:', error);
            throw error;
        }
    }

    async getSessionById(sessionId: string): Promise<Session> {
        console.log(`SessionApi: getSessionById called for ${sessionId}`);
        try {
            const headers = await this.getAuthHeaders();
            console.log('SessionApi: build request for', `${this.baseUrl}${sessionId}`, 'with headers:', headers);
            const response = await fetch(`${this.baseUrl}${sessionId}`, {
                method: 'GET',
                headers
            });
            console.log(`SessionApi: getSessionById response status: ${response.status}`);
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`SessionApi: getSessionById failed: ${response.status} ${errorText}`);
                throw new Error('Failed to fetch session');
            }
            const data = await response.json();
            console.log('SessionApi: getSessionById data received:', data.id);
            return data;
        } catch (error) {
            console.error('Error fetching session:', error);
            throw error;
        }
    }

    async deleteSession(sessionId: string): Promise<void> {
        try {
            const headers = await this.getAuthHeaders();
            const response = await fetch(`${this.baseUrl}${sessionId}`, {
                method: 'DELETE',
                headers
            });
            if (!response.ok) throw new Error('Failed to delete session');
        } catch (error) {
            console.error('Error deleting session:', error);
            throw error;
        }
    }

    async updateSession(sessionId: string, data: UpdateSessionRequest): Promise<Session> {
        try {
            const headers = await this.getAuthHeaders();
            const response = await fetch(`${this.baseUrl}${sessionId}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to update session');
            return await response.json();
        } catch (error) {
            console.error('Error updating session:', error);
            throw error;
        }
    }
}

export const sessionApi = new SessionApi();

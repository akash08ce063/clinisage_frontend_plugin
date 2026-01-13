import { CookieUtils } from './cookieUtils';
import { API_BASE_URL } from './constants';

export interface TranscriptResponse {
    id: string;
    session_id: string;
    text: string;
    created_at: string;
    audio_url: string | null;
}

class TranscriptApi {
    private baseUrl = `${API_BASE_URL}/transcript/`;

    private async getAuthHeaders(): Promise<HeadersInit> {
        const token = CookieUtils.getAuthToken();
        if (!token) {
            throw new Error('No authentication token found');
        }
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
        };
    }

    async getTranscript(sessionId: string): Promise<TranscriptResponse> {
        try {
            const authHeaders = await this.getAuthHeaders();
            const response = await fetch(`${this.baseUrl}${sessionId}`, {
                method: 'GET',
                headers: authHeaders
            });

            if (!response.ok) {
                if (response.status === 404) {
                    return {
                        id: '',
                        session_id: sessionId,
                        text: '',
                        created_at: '',
                        audio_url: null
                    };
                }
                throw new Error(`Failed to fetch transcript: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching transcript:', error);
            throw error;
        }
    }
}

export const transcriptApi = new TranscriptApi();

import { CookieUtils } from './cookieUtils';
import { API_BASE_URL } from './constants';

export interface NoteInput {
    template_id: string;
    template_prompt?: string;
    template_example?: string;
    transcribed_text?: string;
    session_id?: string;
}

export interface NoteOut {
    id: string;
    note_text: string;
    template_id: string;
    created_at: string;
}

class NoteApi {
    private baseUrl = `${API_BASE_URL}/notes/`;

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

    private handleAuthError(response: Response, operation: string): never {
        if (response.status === 401) {
            CookieUtils.removeAuthToken();
            throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(`Failed to ${operation}: ${response.statusText}`);
    }

    async generateNoteStreaming(
        sessionId: string,
        noteInput: NoteInput,
        onChunk: (chunk: string) => void,
        onComplete: (noteId?: string) => void,
        onError: (error: string) => void
    ): Promise<void> {
        try {
            const authHeaders = await this.getAuthHeaders();
            const response = await fetch(`${this.baseUrl}generate/${sessionId}/stream`, {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify(noteInput)
            });

            if (!response.ok) {
                this.handleAuthError(response, 'generate note');
            }

            if (!response.body) {
                throw new Error('No response body');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6); // Remove 'data: ' prefix

                        if (data === '[DONE]') {
                            onComplete();
                            return;
                        } else if (data.startsWith('[SAVED:')) {
                            const noteId = data.slice(7, -1); // Remove '[SAVED:' and ']'
                            onComplete(noteId);
                            return;
                        } else if (data.startsWith('[ERROR_SAVING:') || data.startsWith('[Error')) {
                            onError(data);
                            return;
                        } else {
                            // Unescape newlines and characters that were escaped in the backend
                            const unescapedData = data
                                .replace(/\\n/g, '\n')
                                .replace(/\\"/g, '"')
                                .replace(/\\\\/g, '\\');

                            // In standard SSE, multiple data: lines in one message are joined by \n
                            // If we get an empty data line, it should be treated as a newline
                            onChunk(unescapedData === "" ? "\n" : unescapedData);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error generating note:', error);
            onError(error instanceof Error ? error.message : 'Unknown error occurred');
        }
    }

    async getNotesForSession(sessionId: string): Promise<NoteOut[]> {
        try {
            const authHeaders = await this.getAuthHeaders();
            const response = await fetch(`${this.baseUrl}${sessionId}`, {
                method: 'GET',
                headers: authHeaders
            });

            if (!response.ok) {
                this.handleAuthError(response, 'fetch notes');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching notes:', error);
            throw error;
        }
    }

    async updateNote(noteId: string, noteText: string): Promise<NoteOut> {
        try {
            const authHeaders = await this.getAuthHeaders();
            const response = await fetch(`${this.baseUrl}${noteId}`, {
                method: 'PUT',
                headers: authHeaders,
                body: JSON.stringify({
                    note_text: noteText
                })
            });

            if (!response.ok) {
                this.handleAuthError(response, 'update note');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating note:', error);
            throw error;
        }
    }

    async createNote(sessionId: string, noteText: string, templateId?: string): Promise<NoteOut> {
        try {
            const authHeaders = await this.getAuthHeaders();
            const response = await fetch(`${this.baseUrl}`, {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify({
                    session_id: sessionId,
                    note_text: noteText,
                    template_id: templateId
                })
            });

            if (!response.ok) {
                this.handleAuthError(response, 'create note');
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating note:', error);
            throw error;
        }
    }

    async deleteNote(noteId: string): Promise<void> {
        try {
            const authHeaders = await this.getAuthHeaders();
            const response = await fetch(`${this.baseUrl}${noteId}`, {
                method: 'DELETE',
                headers: authHeaders
            });

            if (!response.ok) {
                throw new Error('Failed to delete note');
            }
        } catch (error) {
            console.error('Error deleting note:', error);
            throw error;
        }
    }

    async getNoteById(noteId: string): Promise<NoteOut> {
        try {
            const authHeaders = await this.getAuthHeaders();
            const response = await fetch(`${this.baseUrl}${noteId}`, {
                method: 'GET',
                headers: authHeaders
            });

            if (!response.ok) {
                this.handleAuthError(response, 'fetch note');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching note:', error);
            throw error;
        }
    }
}

export const noteApi = new NoteApi();

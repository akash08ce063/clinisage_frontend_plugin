import { CookieUtils } from './cookieUtils';
import { API_BASE_URL } from './constants';

export interface Template {
    id: string;
    template_text: string;
    template_title?: string;
    template_description?: string;
    template_creator?: string;
    template_type?: string;
    created_at?: string;
    is_default: boolean;
}

export interface CreateTemplateRequest {
    template_text: string;
    template_title?: string;
    template_description?: string;
    template_type?: string;
}

export interface UpdateTemplateRequest {
    template_text?: string;
    template_title?: string;
    template_description?: string;
    template_type?: string;
}

class TemplateApi {
    private baseUrl = `${API_BASE_URL}/templates/`;

    private async getAuthHeaders(): Promise<HeadersInit> {
        const key = CookieUtils.getApiKeyWithDefault();
        return {
            'Content-Type': 'application/json',
            'x-api-key': key,
            "ngrok-skip-browser-warning": "true",
        };
    }

    private handleAuthError(response: Response, operation: string): never {
        if (response.status === 401) {
            // Clear the invalid API key
            CookieUtils.removeApiKey();
            throw new Error('Authentication failed. Please check your API key.');
        }

        // For other errors, try to get the error message
        throw new Error(`Failed to ${operation}: ${response.statusText}`);
    }

    async getTemplates(): Promise<Template[]> {
        try {
            const headers = await this.getAuthHeaders();
            const response = await fetch(this.baseUrl, {
                method: 'GET',
                headers
            });

            if (!response.ok) {
                this.handleAuthError(response, 'fetch templates');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching templates:', error);
            throw error;
        }
    }

    async getTemplate(templateId: string): Promise<Template> {
        try {
            const headers = await this.getAuthHeaders();
            const response = await fetch(`${this.baseUrl}${templateId}`, {
                method: 'GET',
                headers
            });

            if (!response.ok) {
                this.handleAuthError(response, 'fetch template');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching template:', error);
            throw error;
        }
    }

    async getTemplatesByType(templateType: string): Promise<Template[]> {
        try {
            const headers = await this.getAuthHeaders();
            const response = await fetch(`${this.baseUrl}by-type/${templateType}`, {
                method: 'GET',
                headers
            });

            if (!response.ok) {
                this.handleAuthError(response, 'fetch templates by type');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching templates by type:', error);
            throw error;
        }
    }
}

export const templateApi = new TemplateApi();

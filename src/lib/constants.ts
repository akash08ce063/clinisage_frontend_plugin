// API Configuration
export const API_BASE_URL = 'https://51abcff84338.ngrok-free.app/api';
export const BACKEND_URL = 'https://51abcff84338.ngrok-free.app';
export const DEFAULT_TEST_API_KEY = 'b2d195b7dec3bba177ab7c66c9ba3ffad7e8f1088db245ff9013701061902154';

// Utility function to convert HTTP/HTTPS URL to WebSocket URL
export const getWebSocketUrl = (httpUrl: string, path: string = ''): string => {
    const url = new URL(httpUrl);
    const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${url.host}${path}`;
};

// Cookie names
export const COOKIE_NAMES = {
    AUTH_TOKEN: 'clinisage_auth_token',
    REFRESH_TOKEN: 'clinisage_refresh_token',
    USER_DATA: 'clinisage_user_data',
    API_KEY: 'clinisage_api_key'
} as const;

// Local storage keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'clinisage_auth_token',
    REFRESH_TOKEN: 'clinisage_refresh_token',
    USER_DATA: 'clinisage_user_data',
    API_KEY: 'clinisage_api_key'
} as const;

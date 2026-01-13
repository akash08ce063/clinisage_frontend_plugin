// API Configuration
export const API_BASE_URL = 'https://88c30838c19f.ngrok-free.app/api';
export const BACKEND_URL = 'https://88c30838c19f.ngrok-free.app';

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
    USER_DATA: 'clinisage_user_data'
} as const;

// Local storage keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'clinisage_auth_token',
    REFRESH_TOKEN: 'clinisage_refresh_token',
    USER_DATA: 'clinisage_user_data'
} as const;

import { COOKIE_NAMES, STORAGE_KEYS } from './constants';

// Cookie utilities for JWT token management
export class CookieUtils {
    static setCookie(name: string, value: string, days: number = 7): void {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
    }

    static getCookie(name: string): string | null {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    static deleteCookie(name: string): void {
        const domain = window.location.hostname;
        const baseDomain = domain.split('.').slice(-2).join('.');

        // Paths to try for deletion
        const paths = ['/', '/auth'];

        // Domains to try for deletion
        const domains = [domain, `.${baseDomain}`, baseDomain, ''];

        // Expire the cookie for all combinations
        paths.forEach(path => {
            domains.forEach(d => {
                const domainString = d ? `;domain=${d}` : '';
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=${path}${domainString};`;
            });
        });
    }


    static setApiKey(apiKey: string): void {
        this.setCookie(COOKIE_NAMES.API_KEY, apiKey, 30); // 30 days
        localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
    }

    static getApiKey(): string | null {
        return this.getCookie(COOKIE_NAMES.API_KEY) || localStorage.getItem(STORAGE_KEYS.API_KEY);
    }

    static removeApiKey(): void {
        this.deleteCookie(COOKIE_NAMES.API_KEY);
        localStorage.removeItem(STORAGE_KEYS.API_KEY);
    }


    static setUserData(userData: any): void {
        this.setCookie(COOKIE_NAMES.USER_DATA, JSON.stringify(userData), 7);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    }

    static getUserData(): any | null {
        const cookieData = this.getCookie(COOKIE_NAMES.USER_DATA);
        const localData = localStorage.getItem(STORAGE_KEYS.USER_DATA);

        if (cookieData) {
            try {
                return JSON.parse(cookieData);
            } catch {
                // Invalid JSON in cookie, try localStorage
            }
        }

        if (localData) {
            try {
                return JSON.parse(localData);
            } catch {
                // Invalid JSON in localStorage
            }
        }

        return null;
    }

    static removeUserData(): void {
        this.deleteCookie(COOKIE_NAMES.USER_DATA);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }

    static clearAllAuthData(): void {
        this.removeApiKey();
        this.removeUserData();
    }

} 

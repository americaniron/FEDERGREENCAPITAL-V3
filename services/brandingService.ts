
const CUSTOM_LOGO_KEY = 'fc_custom_logo';

export const brandingService = {
    setCustomLogo: (base64Image: string): void => {
        try {
            localStorage.setItem(CUSTOM_LOGO_KEY, base64Image);
        } catch (e) {
            console.error("Failed to save custom logo to localStorage", e);
        }
    },

    getCustomLogo: (): string | null => {
        try {
            return localStorage.getItem(CUSTOM_LOGO_KEY);
        } catch (e) {
            console.error("Failed to retrieve custom logo from localStorage", e);
            return null;
        }
    },

    clearCustomLogo: (): void => {
        try {
            localStorage.removeItem(CUSTOM_LOGO_KEY);
        } catch (e) {
            console.error("Failed to clear custom logo from localStorage", e);
        }
    }
};

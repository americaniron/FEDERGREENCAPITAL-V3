
import { SiteSettings } from '../config/settingsModel';
import { DEFAULT_SITE_SETTINGS } from '../config/defaultSettings';

const DRAFT_KEY = 'fc_draft_settings';
const PUBLISHED_KEY = 'fc_published_settings';

// Helper to check if a variable is an object
const isObject = (item: any): item is object => {
    return (item && typeof item === 'object' && !Array.isArray(item));
};

// Simple deep merge utility to handle nested settings objects like 'theme'
const deepMerge = <T extends object>(target: T, source: Partial<T>): T => {
    const output = { ...target };
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            const sourceKey = key as keyof T;
            if (isObject(source[sourceKey]) && sourceKey in target && isObject(target[sourceKey])) {
                output[sourceKey] = deepMerge(target[sourceKey] as object, source[sourceKey] as object) as T[keyof T];
            } else {
                (output as any)[sourceKey] = source[sourceKey];
            }
        });
    }
    return output;
};


export const settingsService = {
    /**
     * Retrieves the current draft settings, merged with defaults.
     */
    getDraftSettings: (): SiteSettings => {
        const data = localStorage.getItem(DRAFT_KEY);
        const stored = data ? JSON.parse(data) : {};
        return deepMerge(DEFAULT_SITE_SETTINGS, stored);
    },

    /**
     * Saves the current draft settings to local storage.
     */
    saveDraftSettings: (settings: Partial<SiteSettings>) => {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(settings));
    },

    /**
     * Retrieves the published settings, merged with defaults.
     */
    getPublishedSettings: (): SiteSettings => {
        const data = localStorage.getItem(PUBLISHED_KEY);
        const stored = data ? JSON.parse(data) : {};
        return deepMerge(DEFAULT_SITE_SETTINGS, stored);
    },

    /**
     * "Publishes" the current draft by copying it to the published key.
     */
    publishSettings: () => {
        const draft = localStorage.getItem(DRAFT_KEY);
        if (draft) {
            localStorage.setItem(PUBLISHED_KEY, draft);
        }
    }
};

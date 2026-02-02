
import { SiteUser } from '../types';
import { userService } from './userService';

const SITE_SESSION_KEY = 'fc_site_session';

export const authService = {
    loginAsSiteUser: (userId: string): SiteUser | null => {
        const user = userService.getUser(userId);
        if (user) {
            sessionStorage.setItem(SITE_SESSION_KEY, JSON.stringify(user));
            return user;
        }
        return null;
    },

    logoutSiteUser: () => {
        sessionStorage.removeItem(SITE_SESSION_KEY);
    },

    getCurrentSiteUser: (): SiteUser | null => {
        const sessionData = sessionStorage.getItem(SITE_SESSION_KEY);
        if (sessionData) {
            try {
                return JSON.parse(sessionData) as SiteUser;
            } catch (e) {
                return null;
            }
        }
        return null;
    }
};

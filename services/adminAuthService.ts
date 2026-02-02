
import { AdminUser, AdminRole, SIMULATED_USERS } from '../lib/rbac';

const SESSION_KEY = 'fc_admin_session';

export const adminAuthService = {
    /**
     * Simulates a login process. In a real app, this would be an API call.
     * @param email 
     * @param password 
     * @returns A promise that resolves with the user object or null.
     */
    login: (email: string, password: string): Promise<AdminUser | null> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = SIMULATED_USERS.find(u => u.email === email && u.password === password);
                if (user) {
                    const sessionData: AdminUser = { id: user.id, email: user.email, role: user.role };
                    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
                    resolve(sessionData);
                } else {
                    resolve(null);
                }
            }, 500); // Simulate network delay
        });
    },

    /**
     * Logs out the current admin user by clearing their session.
     */
    logout: (): void => {
        sessionStorage.removeItem(SESSION_KEY);
    },

    /**
     * Retrieves the current authenticated admin user from session storage.
     * @returns The user object or null if not authenticated.
     */
    getCurrentUser: (): AdminUser | null => {
        const sessionData = sessionStorage.getItem(SESSION_KEY);
        if (sessionData) {
            try {
                return JSON.parse(sessionData) as AdminUser;
            } catch (e) {
                console.error("Failed to parse admin session", e);
                return null;
            }
        }
        return null;
    }
};

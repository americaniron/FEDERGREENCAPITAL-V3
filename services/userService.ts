
import { SiteUser } from '../types';

const USER_DB_KEY = 'fc_site_users';

const SIMULATED_SITE_USERS: SiteUser[] = [
    { id: 'site_user_001', email: 'free.user@example.com', membershipTier: 'Free', entitlementOverrides: {} },
    { id: 'site_user_002', email: 'basic.user@example.com', membershipTier: 'Basic', entitlementOverrides: {} },
    { id: 'site_user_003', email: 'pro.user@example.com', membershipTier: 'Pro', entitlementOverrides: { 'ccar-review': true } },
    { id: 'site_user_004', email: 'enterprise.user@example.com', membershipTier: 'Enterprise', entitlementOverrides: {} },
];

export const userService = {
    _initialize: () => {
        if (!localStorage.getItem(USER_DB_KEY)) {
            localStorage.setItem(USER_DB_KEY, JSON.stringify(SIMULATED_SITE_USERS));
        }
    },

    getUsers: (): SiteUser[] => {
        userService._initialize();
        const data = localStorage.getItem(USER_DB_KEY);
        return data ? JSON.parse(data) : [];
    },

    getUser: (id: string): SiteUser | undefined => {
        return userService.getUsers().find(u => u.id === id);
    },

    updateUser: (updatedUser: SiteUser): SiteUser => {
        const users = userService.getUsers();
        const index = users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
            users[index] = updatedUser;
        } else {
            users.push(updatedUser); // Or handle error
        }
        localStorage.setItem(USER_DB_KEY, JSON.stringify(users));
        return updatedUser;
    }
};

// Initialize DB on load
userService._initialize();

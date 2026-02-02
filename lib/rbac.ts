
// --- 1. DEFINE ROLES & USERS ---

export type AdminRole = 'Super Admin' | 'Admin' | 'AI Manager' | 'Viewer';

export interface AdminUser {
    id: string;
    email: string;
    role: AdminRole;
}

// In a real application, this would be a secure database lookup.
export const SIMULATED_USERS = [
    { id: 'usr_001', email: 'super@federgreen.com', password: 'password', role: 'Super Admin' as AdminRole },
    { id: 'usr_002', email: 'admin@federgreen.com', password: 'password', role: 'Admin' as AdminRole },
    { id: 'usr_003', email: 'ai@federgreen.com', password: 'password', role: 'AI Manager' as AdminRole },
    { id: 'usr_004', email: 'viewer@federgreen.com', password: 'password', role: 'Viewer' as AdminRole },
];

// --- 2. DEFINE PERMISSIONS ---

export type Permission = 
    | 'dashboard:view'
    | 'users:manage'      // Full CRUD for users
    | 'settings:manage'   // Edit site settings
    | 'ai_tools:manage'   // Manage AI tool entitlements
    | 'entitlements:manage' // New: Manage AI tool entitlements
    | 'audit:view';       // New: View the audit log

// --- 3. MAP ROLES TO PERMISSIONS ---

const PERMISSIONS_MAP: Record<AdminRole, Permission[] | '*'> = {
    'Super Admin': '*', // Wildcard for all permissions
    'Admin': [
        'dashboard:view',
        'settings:manage',
        'users:manage'
    ],
    'AI Manager': [
        'dashboard:view',
        'entitlements:manage',
        'audit:view'
    ],
    'Viewer': [
        'dashboard:view'
    ]
};

// --- 4. CREATE PERMISSION CHECKER UTILITY ---

export const hasPermission = (role: AdminRole, requiredPermission: Permission): boolean => {
    const permissions = PERMISSIONS_MAP[role];

    if (permissions === '*') {
        return true; // Super Admin has all permissions
    }
    
    if (requiredPermission.endsWith(':view')) {
        if(requiredPermission === 'dashboard:view') return true;
        if(requiredPermission === 'audit:view' && permissions.includes('audit:view')) return true;
    }

    return permissions.includes(requiredPermission);
};

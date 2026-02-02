
import React, { useState, useEffect } from 'react';
import { adminAuthService } from '../../services/adminAuthService';
import AdminLayout from '../admin/AdminLayout';
import AdminLogin from '../admin/AdminLogin';
import { AdminUser } from '../../lib/rbac';

/**
 * A dedicated security guard for the /admin route.
 * It checks for a valid admin session. If found, it renders the AdminLayout.
 * If not, it renders the AdminLogin page, effectively locking down the
 * entire admin portal.
 */
const AdminAuthGuard: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<AdminUser | null>(adminAuthService.getCurrentUser());

    const handleLogin = () => {
        // Re-check auth status after a login attempt
        setCurrentUser(adminAuthService.getCurrentUser());
    };

    if (currentUser) {
        return <AdminLayout />;
    }

    return <AdminLogin onLoginSuccess={handleLogin} />;
};

export default AdminAuthGuard;
